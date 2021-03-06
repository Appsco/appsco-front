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
import '../../components/appsco-loader.js';
import '../../components/appsco-form-error.js';
import '../appsco-account-card.js';
import '../../components/appsco-search.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyApplicationShare extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
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
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            appsco-search {
                margin-bottom: 10px;
            }
            .dialog-container {
                padding-bottom: 20px;
            }
            .account-list {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                padding: 2px;
                margin-right: -8px;
            }
            appsco-account-card {
                margin-right: 6px;
                margin-bottom: 6px;
            }
            .selected-account {
                --account-card: {
                    padding-right: 10px;
                    width: 136px;
                };
            }
            :host .message {
                margin: 0;
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
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

            <h2>Share resources</h2>

            <appsco-loader active="[[ _shareLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">


                    <div class="account-list">

                        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                        <template is="dom-repeat" items="[[ _selectedAccounts ]]">
                            <appsco-account-card class="selected-account" account="[[ item ]]" remove-action="" on-selected="_onAccountRemove"></appsco-account-card>
                        </template>
                    </div>

                    <appsco-search id="appscoSearch" label="Share to others" float-label="" on-search="_onSearch" on-search-clear="_onSearchClear"></appsco-search>

                    <div class="account-list">

                        <appsco-loader active="[[ _searchLoader ]]" loader-alt="Appsco is searching accounts" multi-color=""></appsco-loader>

                        <template is="dom-repeat" items="[[ _searchList ]]">
                            <appsco-account-card account="[[ item ]]" on-selected="_onAccountSelect"></appsco-account-card>
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
                <paper-button autofocus="" on-tap="_onShareApplicationsAction">Share</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-company-application-share'; }

    static get properties() {
        return {
            companyApi: {
                type: String
            },

            /**
             * Applications to share.
             */
            applications: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            /**
             * Number of accounts to load show in search result.
             */
            size: {
                type: Number,
                value: 8
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            /**
             * Applications which are shared.
             * This array is populated from sharing API response.
             */
            _responseApplications: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            /**
             * Application list from search.
             */
            _searchList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _message: {
                type: String
            },

            /**
             * Selected accounts from search list.
             */
            _selectedAccounts: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            /**
             * Indicates if search loader should be displayed or not.
             */
            _searchLoader: {
                type: Boolean,
                value: false
            },

            /**
             * Indicates if share applications loader should be displayed or not.
             */
            _shareLoader: {
                type: Boolean,
                value: false
            }
        };
    }

    toggle() {
        this.$.dialog.toggle();
    }

    _showLoader() {
        this._shareLoader = true;
    }

    _hideLoader() {
        this._shareLoader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _onDialogOpened() {
        this.$.appscoSearch.setup();
    }

    _onDialogClosed() {
        this._reset();
        this.set('_selectedAccounts', []);
    }

    /**
     * Gets accounts by term.
     *
     * @param {Object} event
     * @private
     */
    _onSearch(event) {
        const searchValue = event.detail.term,
            searchLength = searchValue.length;

        this._searchLoader = true;
        this._message = '';

        if (searchLength === 0) {
            this._message = '';
            this._searchLoader = false;
            this.set('_searchList', []);
            return false;
        }

        if (searchLength < 3) {
            this._message = 'Please type three or more letters.';
            this._searchLoader = false;
            this.set('_searchList', []);
            return false;
        }

        const request = document.createElement('iron-request'),
            url = this.companyApi + '/directory/accounts/search?extended=1&limit=' + this.size + '&term=' + searchValue;

        this._message = '';

        const options = {
            url: url,
            method: 'GET',
            handleAs: 'json',
            headers: this._headers
        };

        request.send(options).then(function() {
            const accounts = request.response.accounts;

            if (accounts && accounts.length > 0) {
                this.set('_searchList', accounts);
            }
            else {
                this.set('_searchList', []);
                this._message = 'There are no accounts with asked name.';
            }

            this._searchLoader = false;
        }.bind(this));
    }

    _onSearchClear() {
        this._reset();
    }

    _reset() {
        this.$.appscoSearch.reset();
        this.set('_searchList', []);
        this._searchLoader = false;
        this._hideLoader();
        this._hideError();
        this._message = '';
    }

    /**
     * Called after account has been selected from search list.
     *
     * @param {Object} event
     * @private
     */
    _onAccountSelect(event) {
        this._hideError();
        this.push('_selectedAccounts', event.model.item);
        this.splice('_searchList', this._searchList.indexOf(event.model.item), 1);
    }

    _onAccountRemove(event) {
        this.push('_searchList', event.model.item);
        this.splice('_selectedAccounts', this._selectedAccounts.indexOf(event.model.item), 1);
    }

    _applicationsShareFinished() {
        this.$.dialog.close();

        this.dispatchEvent(new CustomEvent('applications-shared', {
            bubbles: true,
            composed: true,
            detail: {
                applications: this._responseApplications
            }
        }));

        this.set('_selectedAccounts', []);
        this.set('_responseApplications', []);
        this._hideLoader();
    }

    _shareToAccounts(application, last) {
        let accounts = this._selectedAccounts,
            length = accounts.length - 1,
            request = document.createElement('iron-request'),
            options = {
                url: application.self + '/share',
                method: 'POST',
                handleAs: 'json',
                headers: this._headers
            },
            body = '';

        for (let i = 0; i <= length; i++) {
            let next = (i === length) ? '' : '&';
            body += 'accounts[]=' + encodeURIComponent(accounts[i].self) + next;
        }

        options.body = body;

        request.send(options).then(function() {
            this.push('_responseApplications', request.response);

            if (last) {
                this._applicationsShareFinished();
            }
        }.bind(this), function() {
            this._showError(this.apiErrors.getError(request.response.code));
            this._hideLoader();
        }.bind(this));
    }

    _onShareApplicationsAction() {
        if (0 === this._selectedAccounts.length) {
            this._showError('Please add at least one user to share resources to.');
            return false;
        }

        const applications = this.applications,
            length = applications.length - 1;

        this._showLoader();

        for (let i = 0; i <= length; i++) {
            if (i === length) {
                this._shareToAccounts(applications[i], true);
                return false;
            }

            this._shareToAccounts(applications[i], false);
        }
    }
}
window.customElements.define(AppscoCompanyApplicationShare.is, AppscoCompanyApplicationShare);
