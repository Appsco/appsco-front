import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import './appsco-access-on-boarding-roles-item.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import { AppscoListObserverBehavior } from '../components/appsco-list-observer-behavior.js';
import '../components/appsco-list-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccessOnBoardingRoles extends mixinBehaviors([
    AppscoListBehavior,
    AppscoListObserverBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host {
                --appsco-list-item: {
                    @apply --appsco-access-on-boarding-list-item;
                };
                --appsco-list-item-activated: {
                    @apply --appsco-access-on-boarding-list-item-activated;
                };
            }
            :host appsco-access-on-boarding-roles-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-access-on-boarding-roles-item;
            }
            :host .info-total {
                margin-bottom: 10px;
            }
            :host .total {
                @apply --paper-font-caption;
                opacity: 0.6;
            }
        </style>

        <iron-ajax auto="" url="[[ _eventTypesListUrl ]]" handle-as="json" on-response="_onEventTypesListResponse">
        </iron-ajax>

        <iron-ajax id="getListApiRequest" url="[[ _listApi ]]" on-error="_onGetListError" on-response="_onGetListResponse" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

        <div class="list-container">

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_listEmpty ]]">

                <div class="info-total" hidden\$="[[ !_accountsCount ]]">
                    <span class="total">Total accounts: [[ _accountsCount ]]</span>
                </div>

                <div class="list">
                    <template is="dom-repeat" items="[[ _listItems ]]" on-dom-change="_onItemsDomChange">

                        <appsco-access-on-boarding-roles-item id="appscoListItem_[[ index ]]" item="[[ item ]]" type="[[ type ]]" event-types-list="[[ _eventTypesList ]]" authorization-token="[[ authorizationToken ]]"></appsco-access-on-boarding-roles-item>
                    </template>
                </div>
            </template>
        </div>

        <template is="dom-if" if="[[ !_listEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button class="load-more-action" on-tap="_onLoadMoreAction">Load More</paper-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-access-on-boarding-roles'; }

    static get properties() {
        return {
            _accountsCount: {
                type: Number,
                value: 0
            },

            _eventTypesListUrl: {
                type: String,
                value: function () {
                    return this.resolveUrl('./data/event-types.json');
                }
            },

            _eventTypesList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _request: {
                type: Object,
                value: function () {
                    return {};
                }
            }
        };
    }

    static get observers() {
        return [
            '_observeItems(_listItems)'
        ];
    }

    static get importMeta() {
        return import.meta;
    }

    ready() {
        super.ready();

        afterNextRender(this, function () {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('filter-done', this._getResultTotal);
        this.addEventListener('list-loaded', this._getResultTotal);
        this.addEventListener('list-empty', this._getResultTotal);
        this.addEventListener('remove-item', this._onRemoveItemAction);
    }

    _observeItems(items) {
        this.setObservableType('accounts');
        this.populateItems(items);
    }

    _getAccessOnBoarding(term, group) {
        return new Promise(function(resolve, reject) {
            const request = document.createElement('iron-request'),
                url = (this.listApi + '?extended=1&limit=1000' +
                    (group.alias ? ('&group=' + group.alias) : '') +
                    (term ? ('&term=' + term) : '')),
                options = {
                    url: url,
                    method: 'GET',
                    handleAs: 'json',
                    headers: this._headers
                };

            this._request = request;

            request.send(options).then(function() {
                if (200 === request.status) {
                    resolve(request.response.items);
                }
            }.bind(this), function() {
                reject(this.apiErrors.getError(404));
            }.bind(this));
        }.bind(this));
    }

    filterRoles(filters) {
        const filterTerm = (filters.term && (2 <= filters.term.length)) ? filters.term : '',
            filterGroup = (filters.group && ('all' !== filters.group.alias)) ? filters.group : {},
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length;

        for (const key in this._request) {
            this._request.abort();
        }

        this._getAccessOnBoarding(filterTerm, filterGroup).then(function(roles) {
            const itemsLength = roles.length;

            if (0 === itemsLength) {
                this._showMessage('There are no accounts with asked filters.');
                this._handleEmptyLoad();
                return false;
            }

            this._hideMessage();
            this._showProgressBar();
            this._hideLoadMoreAction();
            this._clearListLoaders();
            this.set('_listItems', []);
            this._listEmpty = false;

            roles.forEach(function(role, index) {
                for (let i = 0; i < allLength; i++) {
                    const currentListItem = allListItems[i];

                    if (role.user_info.id === currentListItem.user_info.id) {
                        this.push('_listItems', currentListItem);
                    }
                }

                if (index === itemsLength - 1) {
                    this._hideProgressBar();
                }

            }.bind(this));

            if (0 === this._listItems.length) {
                this._showMessage('There are no asked accounts.');
                this._handleEmptyLoad();
                return false;
            }

            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
        }.bind(this), function(message) {}.bind(this));
    }

    removeItems(items) {
        const currentItems = JSON.parse(JSON.stringify(this._listItems)),
            length = currentItems.length,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length,
            lengthModify = items.length;

        for (let i = 0; i < lengthModify; i++) {
            const item = items[i];

            for (let j = 0; j < length; j++) {
                if (item.user_info.self === currentItems[j].user_info.self) {
                    currentItems.splice(j, 1);
                    j--;
                    break;
                }
            }

            for (let k = 0; k < allLength; k++) {
                if (item.user_info.self === allListItems[k].user_info.self) {
                    allListItems.splice(k, 1);
                    k--;
                    break;
                }
            }

            this._totalItems--;
        }

        this.set('_listItems', []);
        this.set('_listItems', currentItems);

        this.set('_allListItems', []);
        this.set('_allListItems', allListItems);

        this.dispatchEvent(new CustomEvent('items-removed', {
            bubbles: true,
            composed: true,
            detail: {
                items: items
            }
        }));

        if (0 === this._listItems.length) {
            this._showMessage('You have removed all ' + this._typeDisplay + 's in company.');
            this._handleEmptyLoad();
        }
    }

    _onEventTypesListResponse(event, ironRequest) {
        this.set('_eventTypesList', ironRequest.response);
    }

    _getResultTotal() {
        this._accountsCount = this.getCurrentCount();
    }

    _onRemoveItemAction(event) {
        this.removeItems([event.detail.item]);
    }
}
window.customElements.define(AppscoAccessOnBoardingRoles.is, AppscoAccessOnBoardingRoles);
