import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../components/appsco-search.js';
import '../application/appsco-account-card.js';
import '../application/appsco-application-card.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoGroupAddResource extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host .dialog-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            appsco-search {
                margin-bottom: 10px;
            }
            .dialog-container {
                padding-bottom: 20px;
            }
            .item-list {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                padding: 2px;
                margin-right: -8px;
            }
            appsco-account-card, appsco-application-card {
                margin-right: 6px;
                margin-bottom: 6px;
            }
            .selected-item {
                --group-card: {
                    padding-right: 10px;
                    width: 136px;
                };
            }
            :host .message {
                @apply --paper-font-body2;
                margin: 0;
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --info-message;
            }
            :host .message:first-letter {
                text-transform: capitalize;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-confirm] {
                @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>[[ _computedTitle ]]</h2>

            <appsco-loader class="dialog-loader" active="[[ _dialogLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <div class="item-list">

                        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                        <template is="dom-repeat" items="[[ _selectedItems ]]">

                            <template is="dom-if" if="[[ _isResourceTypeApplication ]]">
                                <appsco-application-card class="selected-item" application="[[ item ]]" remove-action="" on-selected="_onRemoveSelectedItem"></appsco-application-card>
                            </template>

                            <template is="dom-if" if="[[ !_isResourceTypeApplication ]]">
                                <appsco-account-card class="selected-item" account="[[ item.account ]]" remove-action="" on-selected="_onRemoveSelectedItem"></appsco-account-card>
                            </template>

                        </template>
                    </div>

                    <appsco-search id="appscoSearch" label="Search [[ _resourceTypeTitle ]]s" float-label="" on-search="_onSearch" on-search-clear="_onSearchClear"></appsco-search>

                    <div class="item-list">

                        <appsco-loader active="[[ _searchLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

                        <template is="dom-repeat" items="[[ _searchList ]]">
                            <template is="dom-if" if="[[ _isResourceTypeApplication ]]">
                                <appsco-application-card application="[[ item ]]" on-selected="_onItemSelected"></appsco-application-card>
                            </template>

                            <template is="dom-if" if="[[ !_isResourceTypeApplication ]]">
                                <appsco-account-card account="[[ item.account ]]" on-selected="_onItemSelected"></appsco-account-card>
                            </template>

                        </template>

                        <template is="dom-if" if="[[ _message ]]">
                            <p class="message">
                                [[ _message ]]
                            </p>
                        </template>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onAddResourcesToGroupAction">Add</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-group-add-resource'; }

    static get properties() {
        return {
            group: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            listItemsApi: {
                type: String
            },

            size: {
                type: Number,
                value: 8
            },

            resourceType: {
                type: String,
                value: ''
            },

            /**
             * Items to add to groups.
             */
            _items: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _resourceTypeTitle: {
                type: String,
                computed: '_computeResourceTypeTitle(resourceType)'
            },

            _isResourceTypeApplication: {
                type: String,
                computed: '_computeResourceTypeApplication(resourceType)'
            },

            _computedTitle: {
                type: String,
                computed: '_computeTitle(_resourceTypeTitle)'
            },

            /**
             * Items which are added to group.
             * This array is populated from adding API response.
             */
            _responseItems: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            /**
             * Groups list from search.
             */
            _searchList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            /**
             * Selected items from search list.
             */
            _selectedItems: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _message: {
                type: String,
                value: ''
            },

            /**
             * Indicates if search loader should be displayed or not.
             */
            _searchLoader: {
                type: Boolean,
                value: false
            },

            /**
             * Indicates if dialog loader should be displayed or not.
             */
            _dialogLoader: {
                type: Boolean,
                value: false
            },

            _requests: {
                type: Number,
                value: 0
            }
        };
    }

    toggle() {
        this.$.dialog.toggle();
    }

    open() {
        this.$.dialog.open();
    }

    close() {
        this.$.dialog.close();
    }

    setGroup(group) {
        this.group = group;
    }

    setType(type) {
        this.resourceType = type;
    }

    setListItemsApi(listApi) {
        this.listItemsApi = listApi;
    }

    _computeTitle(resourceType) {
        return resourceType ? ('Add ' + resourceType + 's to group') : 'Add to group';
    }

    _computeResourceTypeTitle(resourceType) {
        return ('role' === resourceType) ? 'user' : resourceType;
    }

    _computeResourceTypeApplication(resourceType) {
        return 'resource' === resourceType;
    }

    _onDialogOpened() {
        this.$.appscoSearch.setup();
    }

    _onDialogClosed() {
        this._reset();
        this.set('_selectedItems', []);
    }

    _showDialogLoader() {
        this._dialogLoader = true;
    }

    _hideDialogLoader() {
        this._dialogLoader = false;
    }

    _showSearchLoader() {
        this._searchLoader = true;
    }

    _hideSearchLoader() {
        this._searchLoader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _reset() {
        this.$.appscoSearch.reset();
        this.set('_searchList', []);
        this._hideSearchLoader();
        this._hideDialogLoader();
        this._hideError();
        this._message = '';
    }

    _handleSearchItemsResult(result, term) {
        let items;

        switch (this.resourceType) {
            case 'resource':
                items = result.applications;
                break;
            case 'role':
                items = result.company_roles;
                break;
            case 'contact':
                items = result.contacts;
                break;
            default:
                items = [];
        }

        if (items && items.length > 0) {
            this.set('_searchList', items);
        }
        else {
            this.set('_searchList', []);
            this._message = this._resourceTypeTitle + ' with name \'' + decodeURIComponent(term) + '\' does not exist.';
        }
    }

    /**
     * Gets groups by term.
     *
     * @param {Object} event
     * @private
     */
    _onSearch(event) {
        const searchValue = event.detail.term,
            searchLength = searchValue.length;

        this._showSearchLoader();
        this._message = '';
        this._hideError();

        if (searchLength === 0) {
            this._message = '';
            this._hideSearchLoader();
            this.set('_searchList', []);
            return false;
        }

        if (searchLength < 2) {
            this._message = 'Please type two or more letters.';
            this._hideSearchLoader();
            this.set('_searchList', []);
            return false;
        }

        const request = document.createElement('iron-request'),
            url = this.listItemsApi + '?extended=1&limit=' + this.size + '&term=' + searchValue,
            options = {
                url: url,
                method: 'GET',
                handleAs: 'json',
                headers: this._headers
            };

        request.send(options).then(function() {
            if (200 === request.status) {
                this._handleSearchItemsResult(request.response, searchValue);
            }

            this._hideSearchLoader();
        }.bind(this));
    }

    _onSearchClear() {
        this._reset();
    }

    /**
     * Called after group has been selected from search list.
     *
     * @param {Object} event
     * @private
     */
    _onItemSelected(event) {
        this._hideError();
        this.push('_selectedItems', event.model.item);
        this.splice('_searchList', this._searchList.indexOf(event.model.item), 1);
    }

    _onRemoveSelectedItem(event) {
        this.push('_searchList', event.model.item);
        this.splice('_selectedItems', this._selectedItems.indexOf(event.model.item), 1);
    }

    _onAddActionFinished() {
        if (this._responseItems.length > 0) {
            this.dispatchEvent(new CustomEvent('resources-added-to-group', {
                bubbles: true,
                composed: true,
                detail: {
                    group: this.group,
                    items: this._responseItems,
                    resourceType: this.resourceType
                }
            }));

            this.close();
        }
        else {
            this._showError('There was an error while adding ' + this.resourceType + 's to group. Please close the dialog and try again.');
        }

        this.set('_selectedItems', []);
        this.set('_responseItems', []);
        this._hideDialogLoader();
    }

    _addResourceToGroup(item) {
        return new Promise(function(resolve, reject) {
            let request = document.createElement('iron-request'),
                options = {
                    url: item.self + '/groups',
                    method: 'POST',
                    handleAs: 'json',
                    headers: this._headers
                },
                body;

            body = this.group.meta ? 'groups[]=' + encodeURIComponent(this.group.meta.self) : '';
            options.body = body;

            request.send(options).then(function() {
                if (200 === request.status) {
                    switch (this.resourceType) {
                        case 'resource':
                            resolve(request.response.application);
                            break;

                        case 'role':
                        case 'contact':
                            resolve(request.response);
                            break;
                    }
                }
            }.bind(this), function() {
                if (404 === request.status) {
                    reject('There was an error while adding resources to group. Not all ' + this.resourceType + 's were added to group.');
                }
            }.bind(this));
        }.bind(this));
    }

    _onAddResourcesToGroupAction() {
        if (0 === this._selectedItems.length) {
            this._showError('Please add at least one ' + this.resourceType + ' to add to group.');
            return false;
        }

        const items = this._selectedItems,
            length = items.length;

        this._requests = length;

        this._hideError();
        this._showDialogLoader();

        for (let i = 0; i < length; i++) {
            const item = items[i];

            (function(me) {
                me._addResourceToGroup(item).then(function(item) {
                    me.push('_responseItems', item);
                    me._requests--;

                    if (me._requests === 0) {
                        me._onAddActionFinished();
                    }
                }.bind(me), function(message) {
                    me._showError(message);
                    me._requests--;

                    if (me._requests === 0) {
                        me._onAddActionFinished();
                    }
                }.bind(me));
            })(this);
        }
    }
}
window.customElements.define(AppscoGroupAddResource.is, AppscoGroupAddResource);
