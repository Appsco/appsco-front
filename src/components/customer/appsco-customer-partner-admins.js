import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/transform-animation.js';
import './appsco-company-partner-admin-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomerPartnerAdmins extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --appsco-customer-partner-admins;
            }
            .roles {
                @apply --layout-vertical;
                @apply --layout-start;
            }
            appsco-company-partner-admin-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-company-group-role-item;
            }
            .partner-admins-container {
                width: 100%;
                position: relative;
            }
            appsco-loader {
                background-color: rgba(255, 255, 255, 0.4);
            }
            .load-more-box {
                margin-top: 10px;
                padding-top: 4px;
                position: relative;
            }
            .load-more-box paper-progress {
                width: 100%;
                position: absolute;
                top: 4px;
                left: 0;
            }
            .progress-bar {
                min-width: 100px;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --appsco-list-progress-bar;
            }
            .roles {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                width: 100%;
            }
            .info-total {
                margin-bottom: 10px;
            }
            .total {
                @apply --paper-font-caption;
                color: var(--secondary-text-color);
            }
            .load-more-box paper-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
            .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
            :host([preview]) .roles {
                @apply --layout-horizontal;
            }
            :host([preview]) appsco-company-partner-admin-item {
                width: auto;
                margin: 0 2px 0 0;
                @apply --appsco-company-partner-admin-item-preview;
            }
            :host .options paper-button {
                @apply --primary-button;
                display: inline-block;
            }
            :host .options {
                margin-bottom: 10px;
            }
        </style>

        <div class="partner-admins-container">

            <iron-ajax id="getPartnerAdminsApiRequest" url="[[ _listApi ]]" headers="[[ _headers ]]" debounce-duration="300" on-error="_onError" on-response="_onResponse"></iron-ajax>

            <paper-progress id="paperProgress" class="progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !preview ]]">
                <div class="options">
                    <paper-button on-tap="_onAddPartnerAdmin">Add partner admin</paper-button>
                </div>
            </template>

            <template is="dom-if" if="[[ !_partnerAdminsEmpty ]]">
                <template is="dom-if" if="[[ preview ]]">
                    <div class="info-total">
                        <div class="total">
                            Total partner admins: [[ _totalPartnerAdmins ]]
                        </div>
                    </div>
                </template>

                <div class="roles" preview="[[ preview ]]">
                    <template is="dom-repeat" items="{{ _partnerAdmins }}" on-dom-change="_onItemsDomChange">

                        <appsco-company-partner-admin-item id="appscoPartnerAdminItem_[[ index ]]" customer="[[ customer ]]" partner-admin="{{ item }}" preview="[[ preview ]]"></appsco-company-partner-admin-item>

                    </template>
                </div>
            </template>
        </div>

        <template is="dom-if" if="[[ !_partnerAdminsEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button on-tap="_loadMorePartnerAdmins" id="loadMore">Load More</paper-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-customer-partner-admins'; }

    static get properties() {
        return {
            customer: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            listApi: {
                type: String,
                observer: '_onListApiChanged'
            },

            size: {
                type: Number,
                value: 10
            },

            loadMore: {
                type: Boolean,
                value: false
            },

            preview: {
                type: Boolean,
                value: false
            },

            /**
             * If true roles will load on listApi change.
             */
            autoLoadActive: {
                type: Boolean,
                value: false
            },

            _listApi: {
                type: String
            },

            _loadMore: {
                type: Boolean,
                value: false
            },

            _partnerAdmins: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },

            _allPartnerAdmins: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _partnerAdminsEmpty: {
                type: Boolean,
                value: false
            },

            _message: {
                type: String,
                value: ''
            },

            _nextPageApiUrl: {
                type: String
            },

            _totalPartnerAdmins: {
                type: Number,
                value: 0
            },

            _renderedIndex: {
                type: Number,
                value: -1
            },

            _loaders: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'cascaded-animation',
                animation: 'slide-from-left-animation',
                nodes: [],
                nodeDelay: 50,
                timing: {
                    duration: 300
                }
            }
        };
    }

    _onListApiChanged(url) {
        if (url) {
            this._listApi = ((url.indexOf('extended') !== -1) ? url : (url + '?extended=1')) + '&page=1&limit=' + this.size;

            if (this.autoLoadActive && url && url.length > 0) {
                this._loadPartnerAdmins();
            }
        }
    }

    _setLoadMoreAction() {
        this._loadMore = (this.loadMore && this._allPartnerAdmins.length < this._totalPartnerAdmins);
    }

    _hideLoadMoreAction() {
        this._loadMore = false;
    }

    _onAddPartnerAdmin() {
        this.dispatchEvent(new CustomEvent('add-partner-admin', {
            bubbles: true,
            composed: true,
            detail: {
                customer: this.customer
            }
        }));
    }

    _loadPartnerAdmins() {
        this._showProgressBar();
        this._loadMore = false;
        this._clearPartnerAdmins();
        this.$.getPartnerAdminsApiRequest.generateRequest();
    }

    loadPartnerAdmins() {
        this._loadPartnerAdmins();
    }

    reloadPartnerAdmins() {
        this._loadPartnerAdmins();
    }

    _loadMorePartnerAdmins() {
        this._showLoadMoreProgressBar();
        this.$.getPartnerAdminsApiRequest.url = this._nextPageApiUrl;
        this.$.getPartnerAdminsApiRequest.generateRequest();
    }

    _onError(event) {
        this._message = 'We couldn\'t load partner admins at the moment. Please try again in a minute.';
        this._handleEmptyLoad();
    }

    _handleEmptyLoad() {
        this._partnerAdminsEmpty = true;
        this._message = 'There are no partner admins for customer.';

        this.dispatchEvent(new CustomEvent('empty-load', { bubbles: true, composed: true }));

        this._hideProgressBar();
        this._hideLoadMoreProgressBar();
    }

    _clearLoaders() {
        for (let idx in this._loaders) {
            clearTimeout(this._loaders[idx]);
        }
        this.set('_loaders', []);
    }

    _clearPartnerAdmins() {
        this._clearLoaders();
        this.set('_partnerAdmins', []);
        this.set('_allPartnerAdmins', []);
    }

    _onResponse(event) {
        const response = event.detail.response;

        if (response && response.partner_admins) {
            const partnerAdmins = response.partner_admins,
                meta = response.meta,
                partnerAdminsCount = partnerAdmins.length - 1;

            this._totalPartnerAdmins = meta.total;
            this._nextPageApiUrl = meta.next + '&limit=' + this.size;

            if (meta.total === 0) {
                this._handleEmptyLoad();
                return false;
            }

            this._partnerAdminsEmpty = false;
            this._message = '';

            this._clearPartnerAdmins();
            partnerAdmins.forEach(function(el, index) {
                this._loaders.push(setTimeout(function() {
                    this.push('_partnerAdmins', el);
                    this.push('_allPartnerAdmins', el);

                    if (index === partnerAdminsCount) {
                        this._loadMore = this.loadMore;

                        if (this._partnerAdmins.length === meta.total) {
                            this._loadMore = false;
                        }

                        this._hideProgressBar();
                        this._hideLoadMoreProgressBar();
                        this._setLoadMoreAction();

                        this.dispatchEvent(new CustomEvent('partner-admins-loaded', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                companyRoles: partnerAdmins
                            }
                        }));
                    }
                }.bind(this), (index + 1) * 30));
            }.bind(this));
        }
    }

    addPartnerAdmins(partnerAdmins) {
        const length = partnerAdmins.length,
            allPartnerAdmins = this._allPartnerAdmins,
            allLength = allPartnerAdmins.length;

        this._partnerAdminsEmpty = false;
        this._message = '';
        this._renderedIndex = length - 1;

        for (let i = 0; i < length; i++) {
            if (0 === allLength) {
                this.push('_partnerAdmins', partnerAdmins[i]);
                this.push('_allPartnerAdmins', partnerAdmins[i]);

                this._totalPartnerAdmins++;
            }
            else {
                for (let j = 0; j < allLength; j++) {
                    if (allPartnerAdmins[j].alias === partnerAdmins[i].alias) {
                        break;
                    }
                    else if (j === allLength - 1) {
                        this.unshift('_partnerAdmins', partnerAdmins[i]);
                        this.unshift('_allPartnerAdmins', partnerAdmins[i]);

                        this._totalPartnerAdmins++;
                    }
                }
            }
        }
    }

    removePartnerAdmins(partnerAdmins) {
        const length = partnerAdmins.length,
            _partnerAdmins = this._partnerAdmins,
            _length = _partnerAdmins.length,
            allPartnerAdmins = this._allPartnerAdmins,
            allLength = allPartnerAdmins.length;

        for (let i = 0; i < length; i++) {
            const role = partnerAdmins[i];

            for (let j = 0; j < _length; j++) {
                if (role.self === _partnerAdmins[j].self) {
                    this.splice('_partnerAdmins', j, 1);
                    break;
                }
            }

            for (let k = 0; k < allLength; k++) {
                if (role.self === allPartnerAdmins[k].self) {
                    this.splice('_allPartnerAdmins', k, 1);
                    break;
                }
            }

            this._totalPartnerAdmins--;
        }

        if (0 === this._partnerAdmins.length) {
            this._handleEmptyLoad();
        }
    }

    _showProgressBar() {
        this.shadowRoot.getElementById('paperProgress').hidden = false;
    }

    _showLoadMoreProgressBar() {
        this.shadowRoot.getElementById('loadMoreProgress').hidden = false;
    }

    _hideProgressBar() {
        setTimeout(function() {
            this.shadowRoot.getElementById('paperProgress').hidden = true;
        }.bind(this), 300);
    }

    _hideLoadMoreProgressBar() {
        setTimeout(function() {
            this.shadowRoot.getElementById('loadMoreProgress').hidden = true;
        }.bind(this), 300);

    }

    _onItemsDomChange() {
        const index = this._renderedIndex;

        if (-1 !== index) {
            this.animationConfig.entry.nodes = [];

            for (let i = 0; i <= index; i++) {
                const addedItem = this.shadowRoot.getElementById('appscoPartnerAdminItem_' + i);
                this.animationConfig.entry.nodes.push(addedItem);
            }

            this.playAnimation('entry');

            this._renderedIndex = -1;
        }
    }
}
window.customElements.define(AppscoCustomerPartnerAdmins.is, AppscoCustomerPartnerAdmins);
