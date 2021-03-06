import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../components/appsco-search.js';
import '../resource/appsco-account-list-item.js';
import '../account/appsco-accounts.js';
import '../account/appsco-contacts.js';
import '../components/appsco-list-item-styles.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoSendNotification extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                display: block;
                position: relative;

                --paper-checkbox-unchecked-color: var(--secondary-text-color);
                --paper-checkbox-checked-color: var(--secondary-text-color);
                --paper-checkbox-size: 22px;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host paper-progress {
                width: 100%;
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host appsco-form-error {
                box-sizing: border-box;
                margin-top: 0 !important;
            }
            .dialog-container {
                padding-bottom: 20px;
            }
            .filter-accounts {
                @apply --layout-horizontal;
                @apply --layout-center;
                margin-top: 0 !important;
            }
            appsco-search {
                margin-right: 20px;
                @apply --layout-flex;
            }
            :host .item-info {
                padding: 0;
            }
            :host .info-value {
                font-size: 14px;
            }
            :host .item-type {
                text-transform: capitalize;
            }
            :host table {
                width: 100%;
                border-collapse: collapse;
            }
            :host table thead tr th {
                text-align: left;
                font-size: 16px;
                font-weight: normal;
                padding: 10px 4px;
                border-bottom: 1px solid var(--divider-color);
            }
            :host table thead tr th:first-of-type {
                width: 40px;
            }
            :host table thead tr th:last-of-type {
                width: 60px;
            }
            :host table tbody tr td {
                padding: 10px 4px 0;
            }
            :host paper-checkbox {
                width: 22px;
                margin: 0 auto 0 4px;
            }
            :host paper-checkbox::shadow paper-ripple {
                width: 200% !important;
                height: 200% !important;
                top: -50% !important;
                left: -50% !important;
            }
            :host .message {
                @apply --info-message;
            }
            :host .selected-info {
                height: 20px;
                position: absolute;
                top: 0;
                left: 24px;
                bottom: 0;
                margin: auto;
                font-size: 12px;
                color: var(--secondary-text-color);
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host *[hidden] {
                display: none;
            }
            paper-input {
                width: 100%;
                line-height: 26px;
                box-sizing: border-box;

                --paper-input-container-label: {
                    font-size: 14px;
                    line-height: 20px;
                    bottom: 0;
                    top: initial;
                    left: 5px;
                };

                --paper-input-container-input: {
                    font-size: 14px;
                    line-height: 20px;
                    left: 5px;
                };

                --paper-input-container-underline-focus: {
                    border-bottom: 1px solid var(--paper-input-focused-color);
                };
            }
            div[prefix] iron-icon {
                width: 18px;
                height: 18px;
                margin: 0;
                @apply --paper-input-prefix-icon;
                @apply --appsco-search-input-prefix-icon;

                --iron-icon-fill-color: var(--paper-input-color);
            }
            paper-input[focused] div[prefix] {
                @apply --paper-input-focused-prefix;
            }
            paper-input[focused] div[prefix] iron-icon {
                fill: var(--paper-input-focused-color);
            }
        </style>

        <appsco-accounts hidden="" id="appscoRoles" type="account" size="1000" authorization-token="[[ authorizationToken ]]" list-api="[[ getRolesApi ]]" no-auto-load="" on-list-loaded="_onAccountsLoadFinished" on-filter-done="_onAccountsLoadFinished" on-list-empty="_onAccountsLoadFinished"></appsco-accounts>

        <appsco-contacts hidden="" id="appscoContacts" type="contact" size="1000" authorization-token="[[ authorizationToken ]]" list-api="[[ getContactsApi ]]" no-auto-load="" on-list-loaded="_onContactsLoadFinished" on-list-empty="_onContactsLoadFinished"></appsco-contacts>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Send notification</h2>

            <appsco-loader active="[[ _shareLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

            <paper-input id="notificationMessage" label="Message" value="{{ _notificationMessage }}">
                <div prefix="" slot="prefix">
                    <iron-icon icon="icons:create"></iron-icon>
                </div>
            </paper-input>

            <div class="filter-accounts">
                <appsco-search id="appscoSearch" label="Search for accounts" float-label="" on-search="_onSearchAccounts" on-search-clear="_onSearchAccountsClear"></appsco-search>
            </div>

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <div class="account-list">
                        <paper-progress id="accountListProgress" indeterminate=""></paper-progress>
                        <table>
                            <thead>
                            <tr>
                                <th>
                                    <paper-checkbox id="bulkSelect" on-tap="_onBulkSelect" checked\$="[[ _bulkSelect ]]"></paper-checkbox>
                                </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                            </tr>
                            </thead>

                            <tbody>
                            <template is="dom-repeat" items="[[ _accountList ]]">
                                <tr>
                                    <td>
                                        <appsco-account-list-item item="[[ item.account ]]" on-select-item="_onAccountListItemSelectChanged"></appsco-account-list-item>
                                    </td>

                                    <td>
                                        <div class="item-info">
                                            <span class="info-value">[[ item.account.display_name ]]</span>
                                        </div>
                                    </td>

                                    <td>
                                        <div class="item-info">
                                            <span class="info-value">[[ item.account.email ]]</span>
                                        </div>
                                    </td>

                                    <td>
                                        <div class="item-info">
                                            <span class="info-value item-type">[[ item.type ]]</span>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            </tbody>
                        </table>

                        <template is="dom-if" if="[[ _message ]]">
                            <p class="message">
                                [[ _message ]]
                            </p>
                        </template>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <div class="selected-info">
                    Selected [[ _numberOfSelectedAccounts ]] out of [[ _accountsCount ]]
                </div>
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onSendAction">Send</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-send-notification'; }

    static get properties() {
        return {
            getRolesApi: {
                type: String
            },

            getContactsApi: {
                type: String
            },

            companyNotificationsApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _response: {
                type: Number,
                value: 0
            },

            _accountList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _accountListAll: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _message: {
                type: String,
                value: ''
            },

            _notificationMessage: {
                type: String,
                value: ''
            },

            _selectedRoles: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _selectedContacts: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _shareLoader: {
                type: Boolean,
                value: false
            },

            _rolesLoaded: {
                type: Boolean,
                value: false
            },

            _contactsLoaded: {
                type: Boolean,
                value: false
            },

            _componentReady: {
                type: Boolean,
                value: false
            },

            _bulkSelect: {
                type: Boolean,
                value: false
            },

            _accountsCount: {
                type: Number,
                value: 0
            },

            _numberOfSelectedAccounts: {
                type: Number,
                value: 0
            },

            _filterTerm: {
                type: String,
                value: ''
            },

            _filterType: {
                type: String,
                value: 'all'
            }
        };
    }

    static get observers() {
        return [
            '_setAccountList(_rolesLoaded, _contactsLoaded)'
        ];
    }

    toggle() {
        this.$.dialog.toggle();
    }

    setFilterType(type) {
        this._filterType = type;
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

    _showMessage(message) {
        this._message = message;
    }

    _hideMessage() {
        this._message = '';
    }

    _showAccountListProgress() {
        this.$.accountListProgress.hidden = false;
    }

    _hideAccountListProgress() {
        setTimeout(function() {
            this.$.accountListProgress.hidden = true;
        }.bind(this), 500);
    }

    _onDialogOpened() {
        this.$.appscoSearch.setup();
        this.shadowRoot.getElementById('appscoRoles').reloadItems();
        this.shadowRoot.getElementById('appscoContacts').reloadItems();
        this._componentReady = true;
    }

    _onDialogClosed() {
        this._reset();
    }

    _onAccountsLoadFinished() {
        this._rolesLoaded = true;
    }

    _onContactsLoadFinished() {
        this._contactsLoaded = true;
    }

    _setAccountList(rolesLoaded, contactsLoaded) {
        const listItems = [],
            type = this._filterType;

        this._showAccountListProgress();

        this.set('_accountList', []);
        this.set('_accountListAll', []);

        if (rolesLoaded && contactsLoaded) {
            const rolesComponent = this.shadowRoot.getElementById('appscoRoles'),
                roles = rolesComponent.getAllItems(),
                contactsComponents = this.shadowRoot.getElementById('appscoContacts'),
                contacts = contactsComponents.getAllItems();

            if ('all' === type || 'user' === type) {
                roles.forEach(function (role, index) {
                    role.type = 'user';
                    role.account.selected = false;
                    listItems.push(role);
                }.bind(this));
            }

            if ('all' === type || 'contact' === type) {
                contacts.forEach(function (contact, index) {
                    contact.type = 'contact';
                    contact.account.selected = false;
                    listItems.push(contact);
                }.bind(this));
            }
        }

        this.set('_accountList', listItems);
        this.set('_accountListAll', listItems);
        this._accountsCount = this._accountList.length;
        this._hideAccountListProgress();
    }

    _onBulkSelect() {
        this._hideError();

        if (this._componentReady) {
            this._bulkSelect = !this._bulkSelect;
            this._bulkSelect ? this._selectAllAccounts() : this._deselectAllAccounts();
        }
    }

    _selectAllAccounts() {
        const list = JSON.parse(JSON.stringify(this._accountList)),
            length = list.length,
            listAll = JSON.parse(JSON.stringify(this._accountListAll)),
            lengthAll = listAll.length;

        for (let i = 0; i < length; i++) {
            list[i].account.selected = true;

            for (let j = 0; j < lengthAll; j++) {
                if (listAll[j].account.self === list[i].account.self) {
                    listAll[j].account.selected = true;
                }
            }
        }

        this.set('_accountList', []);
        this.set('_accountList', list);

        this.set('_accountListAll', []);
        this.set('_accountListAll', listAll);

        this._recalculateInfo();
    }

    _deselectAllAccounts() {
        const list = JSON.parse(JSON.stringify(this._accountList)),
            length = list.length,
            listAll = JSON.parse(JSON.stringify(this._accountListAll)),
            lengthAll = listAll.length;

        for (let i = 0; i < length; i++) {
            list[i].account.selected = false;

            for (let j = 0; j < lengthAll; j++) {
                if (listAll[j].account.self === list[i].account.self) {
                    listAll[j].account.selected = false;
                }
            }
        }

        this.set('_accountList', []);
        this.set('_accountList', list);

        this.set('_accountListAll', []);
        this.set('_accountListAll', listAll);

        this._recalculateInfo();
    }

    _onAccountListItemSelectChanged(event) {
        const item = event.detail.item,
            listAll = JSON.parse(JSON.stringify(this._accountListAll)),
            lengthAll = listAll.length;

        if (!item.selected) {
            this._bulkSelect = false;
        }

        for (let j = 0; j < lengthAll; j++) {
            if (listAll[j].account.self === item.self) {
                listAll[j].account.selected = item.selected;
            }
        }

        this.set('_accountListAll', []);
        this.set('_accountListAll', listAll);

        this._recalculateInfo();
        this._setBulkSelectStatus();
        this._hideError();
    }

    _recalculateInfo() {
        const list = this._accountListAll,
            length = list.length;

        this._numberOfSelectedAccounts = 0;

        for (let i = 0; i < length; i++) {
            if (list[i].account.selected) {
                this._numberOfSelectedAccounts++;
            }
        }
    }

    _setBulkSelectStatus() {
        this._bulkSelect = (this._numberOfSelectedAccounts === this._accountListAll.length);
    }

    _onSearchAccounts(event) {
        const searchValue = event.detail.term,
            searchLength = searchValue.length;

        this._filterTerm = searchValue;

        if (searchLength < 3) {
            this._filterTerm = '';
        }

        this._filterAccountList();
    }

    _onSearchAccountsClear() {
        this._filterTerm = '';
        this._filterAccountList();
    }

    _filterAccountList() {
        const listAll = JSON.parse(JSON.stringify(this._accountListAll)),
            lengthAll = listAll.length,
            term = this._filterTerm,
            type = this._filterType;

        this._hideMessage();
        this.set('_accountList', []);

        if ('all' === type) {
            if (term) {
                for (let i = 0; i < lengthAll; i++) {
                    if ((-1 !== listAll[i].account.name.indexOf(term)) || (-1 !== listAll[i].account.email.indexOf(term))) {
                        this.push('_accountList', listAll[i]);
                    }
                }
            }
            else {
                this.set('_accountList', listAll);
            }
        }
        else {
            if (term) {
                for (let i = 0; i < lengthAll; i++) {
                    if ((type === listAll[i].type) && ((-1 !== listAll[i].account.name.indexOf(term)) || (-1 !== listAll[i].account.email.indexOf(term)))) {
                        this.push('_accountList', listAll[i]);
                    }
                }
            }
            else {
                for (let i = 0; i < lengthAll; i++) {
                    if (type === listAll[i].type) {
                        this.push('_accountList', listAll[i]);
                    }
                }
            }
        }

        if (0 === this._accountList.length) {
            this._showMessage('There are no accounts available according to selected filters.');
        }
    }

    _reset() {
        this.$.appscoSearch.reset();
        this._notificationMessage = '';
        this.set('_accountList', []);
        this.set('_accountListAll', []);
        this.set('_selectedRoles', []);
        this.set('_selectedContacts', []);

        this._componentReady = false;
        this._rolesLoaded = false;
        this._contactsLoaded = false;
        this._filterTerm = '';
        this._numberOfSelectedAccounts = 0;
        this._accountsCount = 0;
        this._bulkSelect = false;
        this._hideLoader();
        this._hideError();
        this._hideMessage();
    }

    _notificationsSendFinished() {
        this.$.dialog.close();

        this.dispatchEvent(new CustomEvent('notification-sent', {
            bubbles: true,
            composed: true,
            detail: {
                counter: this._response
            }
        }));

        this.set('_selectedRoles', []);
        this.set('_selectedContacts', []);

        this.set('_response', 0);
        this._hideLoader();
    }

    _sendNotification() {
        const roles = this._selectedRoles,
            contacts = this._selectedContacts,
            rolesLength = roles.length - 1,
            contactsLength = contacts.length - 1,
            request = document.createElement('iron-request'),
            options = {
                url: this.companyNotificationsApi + '/admin-message',
                method: 'POST',
                handleAs: 'json',
                headers: this._headers
            };

        let body = 'admin_message[message]=' + this._notificationMessage;

        for (let i = 0; i <= rolesLength; i++) {
            let isFirst = (i === 0) ? '&' : '';
            let hasNext = (i === rolesLength) ? '' : '&';
            body += isFirst + 'admin_message[company_role][]=' + encodeURIComponent(roles[i].self) + hasNext;
        }

        for (let n = 0; n <= contactsLength; n++) {
            let isFirst = (n === 0) ? '&' : '';
            let hasNext = (n === contactsLength) ? '' : '&';
            body += isFirst + 'admin_message[contact][]=' + encodeURIComponent(contacts[n].self) + hasNext;
        }

        options.body = body;

        request.send(options).then(function() {
            this.set('_response', request.response['notified']);
            this._notificationsSendFinished();

        }.bind(this), function() {
            this._showError(this.apiErrors.getError(request.response.code));
            this._hideLoader();
        }.bind(this));
    }

    _onSendAction() {
        const list = JSON.parse(JSON.stringify(this._accountListAll)),
            length = list.length;

        for (let i = 0; i < length; i++) {
            if (list[i].account.selected) {
                if ('user' === list[i].type) {
                    this._selectedRoles.push(list[i]);
                } else {
                    this._selectedContacts.push(list[i]);
                }
            }
        }

        if (0 === this._selectedRoles.length && 0 === this._selectedContacts.length) {
            this._showError('Please add at least one user to send notification to.');
            return false;
        }

        this._showLoader();
        this._sendNotification();
    }
}
window.customElements.define(AppscoSendNotification.is, AppscoSendNotification);
