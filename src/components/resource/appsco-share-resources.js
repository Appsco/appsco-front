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
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../components/appsco-search.js';
import '../account/appsco-contacts.js';
import '../components/appsco-list-item-styles.js';
import '../application/appsco-applications.js';
import './appsco-resource-list-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoShareRecources extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
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
            .filter-resources {
                @apply --layout-horizontal;
                @apply --layout-center;
                margin-top: 0 !important;
            }
            appsco-search {
                margin-right: 20px;
                @apply --layout-flex;
            }
            paper-dropdown-menu {
                @apply --layou-flex-none;
                width: 150px;
                margin-top: 2px;

                --paper-input-container-input: {
                    font-size: 14px;
                    cursor: pointer;
                };
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
            :host div.error-container {
                height: 20px;
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" 
                      on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Share resources</h2>

            <appsco-loader active="[[ _shareLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <div class="error-container">
                <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>
            </div>

            <div class="filter-resources">
                <appsco-search id="appscoSearch" label="Search for resources" float-label="" 
                               on-search="_onSearchResources" on-search-clear="_onSearchResourcesClear"></appsco-search>
                <paper-dropdown-menu horizontal-align="left" on-iron-activate="_onResourceTypeSelected" 
                                     on-iron-overlay-opened="_onInnerIronOverlay" on-iron-overlay-closed="_onInnerIronOverlay">
                    <paper-listbox id="resourceTypeList" class="dropdown-content" selected="0" slot="dropdown-content">
                        <template is="dom-repeat" items="[[ _resourceTypeList ]]">
                            <paper-item value\$="[[ item.value ]]" name\$="[[ item.name ]]">
                                [[ item.name ]]
                            </paper-item>
                        </template>
                    </paper-listbox>
                </paper-dropdown-menu>
            </div>

            <paper-dialog-scrollable>

                <div class="dialog-container">
                    <div class="resource-list">
                        <paper-progress id="resourceListProgress" hidden\$="[[ !_progressVisible ]]" indeterminate=""></paper-progress>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <paper-checkbox id="bulkSelect" on-tap="_onBulkSelect" checked\$="[[ _bulkSelect ]]"></paper-checkbox>
                                    </th>
                                    <th>Name</th>
                                    <th>Type</th>
                                </tr>
                            </thead>

                            <tbody>
                                <template is="dom-repeat" items="[[ _resourceList ]]">
                                    <tr>
                                        <td>
                                            <appsco-resource-list-item item="[[ item ]]" 
                                                                       on-select-item="_onResourceListItemSelectChanged"></appsco-resource-list-item>
                                        </td>

                                        <td>
                                            <div class="item-info">
                                                <span class="info-value">[[ item.title ]]</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="item-info">
                                                <span class="info-value item-type">[[ getDisplayType(item.auth_type) ]]</span>
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
                    Selected [[ _numberOfSelectedResources ]] out of [[ _resourcesCount ]]
                </div>
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onAssignResourcesAction">Assign</paper-button>
            </div>
        </paper-dialog>`;
    }

    static get is() { return 'appsco-share-resources'; }

    static get properties() {
        return {
            getResourcesApi: {
                type: String,
                value: function() {
                    return '';
                },
                observer: '_onResourceApiChanged'
            },

            shareResourcesApi: {
                type: String
            },

            resources: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _shareToCompanyRoles: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _resourceTypeList: {
                type: Array,
                value: function () {
                    return [
                        {
                            name: 'All',
                            value: 'all',
                            auth_types: []
                        },
                        {
                            name: 'Application',
                            value: 'application',
                            auth_types: ['item', 'unpw']
                        },
                        {
                            name: 'SSO application',
                            value: 'ssp_application',
                            auth_types: ['saml', 'saml_dropbox', 'saml_office_365']
                        },
                        {
                            name: 'Link',
                            value: 'link',
                            auth_types: ['none']
                        },
                        {
                            name: 'Login',
                            value: 'login',
                            auth_types: ['login']
                        },
                        {
                            name: 'Credit card',
                            value: 'cc',
                            auth_types: ['cc']
                        },
                        {
                            name: 'Software licence',
                            value: 'software_licence',
                            auth_types: ['softwarelicence']
                        },
                        {
                            name: 'Passport',
                            value: 'passport',
                            auth_types: ['passport']
                        },
                        {
                            name: 'Secure note',
                            value: 'secure_note',
                            auth_types: ['securenote']
                        }
                    ];
                }
            },

            _resourceList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _resourceListAll: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _message: {
                type: String
            },

            _selectedResources: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _shareLoader: {
                type: Boolean,
                value: false
            },

            _resourcesLoaded: {
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

            _resourcesCount: {
                type: Number,
                computed: '_computeResourceListCount(_resourceList)'
            },

            _numberOfSelectedResources: {
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
            },

            _progressVisible: {
                type: Boolean,
                value: true
            }
        };
    }

    static get observers() {
        return [
            '_setResourceList(_resourcesLoaded)'
        ];
    }

    toggle() {
        this.$.dialog.toggle();
    }

    _onResourceApiChanged() {
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

    _showResourceListProgress() {
        this._progressVisible = true;
    }

    _hideResourceListProgress() {
        setTimeout(function() {
            this._progressVisible = false;
        }.bind(this), 500);
    }

    _onDialogOpened() {
        this.$.appscoSearch.setup();
        this.reloadApplications();
        this._componentReady = true;
    }

    _onDialogClosed() {
        this._reset();
    }

    _onResourcesLoadFinished() {
        this._resourcesLoaded = true;
    }

    _setResourceList(resourcesLoaded) {
        const listItems = [];

        this._showResourceListProgress();

        this.set('_resourceList', []);
        this.set('_resourceListAll', []);

        if (resourcesLoaded) {
            const resourcesComponent = this.shadowRoot.getElementById('appscoRoles'),
                resources = resourcesComponent.getAllItems();

            resources.forEach(function(resource, index) {
                resource.account.selected = false;
                listItems.push(resource);
            }.bind(this));
        }

        this.set('_resourceList', listItems);
        this.set('_resourceListAll', listItems);
        this._hideResourceListProgress();
    }

    _onBulkSelect() {
        this._hideError();

        if (this._componentReady) {
            this._bulkSelect = !this._bulkSelect;
            this._bulkSelect ? this._selectAllResources() : this._deselectAllResources();
        }
    }

    _selectAllResources() {
        const list = JSON.parse(JSON.stringify(this._resourceList)),
            length = list.length,
            listAll = JSON.parse(JSON.stringify(this._resourceListAll)),
            lengthAll = listAll.length;

        for (let i = 0; i < length; i++) {
            list[i].selected = true;

            for (let j = 0; j < lengthAll; j++) {
                if (listAll[j].self === list[i].self) {
                    listAll[j].selected = true;
                }
            }
        }

        this.set('_resourceList', []);
        this.set('_resourceList', list);

        this.set('_resourceListAll', []);
        this.set('_resourceListAll', listAll);

        this._recalculateInfo();
    }

    _deselectAllResources() {
        const list = JSON.parse(JSON.stringify(this._resourceList)),
            length = list.length,
            listAll = JSON.parse(JSON.stringify(this._resourceListAll)),
            lengthAll = listAll.length;

        for (let i = 0; i < length; i++) {
            list[i].selected = false;

            for (let j = 0; j < lengthAll; j++) {
                if (listAll[j].self === list[i].self) {
                    listAll[j].selected = false;
                }
            }
        }

        this.set('_resourceList', []);
        this.set('_resourceList', list);

        this.set('_resourceListAll', []);
        this.set('_resourceListAll', listAll);

        this._recalculateInfo();
    }

    _onResourceListItemSelectChanged(event) {
        const item = event.detail.item,
            listAll = JSON.parse(JSON.stringify(this._resourceListAll)),
            lengthAll = listAll.length;

        if (!item.selected) {
            this._bulkSelect = false;
        }

        for (let j = 0; j < lengthAll; j++) {
            if (listAll[j].self === item.self) {
                listAll[j].selected = item.selected;
            }
        }

        this.set('_resourceListAll', []);
        this.set('_resourceListAll', listAll);

        this._recalculateInfo();
        this._setBulkSelectStatus();
        this._hideError();
    }

    _recalculateInfo() {
        const list = this._resourceListAll,
            length = list.length;

        this._numberOfSelectedResources = 0;

        for (let i = 0; i < length; i++) {
            if (list[i].selected) {
                this._numberOfSelectedResources++;
            }
        }
    }

    _setBulkSelectStatus() {
        this._bulkSelect = (this._numberOfSelectedResources === this._resourceListAll.length);
    }

    _onSearchResources(event) {
        const searchValue = event.detail.term,
            searchLength = searchValue.length;

        this._filterTerm = searchValue;

        if (searchLength < 3) {
            this._filterTerm = '';
        }

        this._filterResourceList();
    }

    _onSearchResourcesClear() {
        this._filterTerm = '';
        this._filterResourceList();
    }

    _onResourceTypeSelected(event) {
        this._filterType = event.detail.item.getAttribute('value');
        this._filterResourceList();
        this._setBulkSelectStatus();
    }

    _filterResourceList() {
        const listAll = JSON.parse(JSON.stringify(this._resourceListAll)),
            lengthAll = listAll.length,
            term = this._filterTerm.toLowerCase(),
            type = this._filterType;

        this._hideMessage();
        this.set('_resourceList', []);

        let resourceList = [];

        if ('all' === type) {
            if (term) {
                for (let i = 0; i < lengthAll; i++) {
                    if (-1 !== listAll[i].title.toLowerCase().indexOf(term.toLowerCase())) {
                        resourceList.push(listAll[i]);
                    }
                }
            }
            else {
                resourceList = listAll;
            }
        }
        else {
            if (term) {
                for (let i = 0; i < lengthAll; i++) {
                    if (this.isTypeMatching(type, listAll[i].auth_type) && (-1 !== listAll[i].title.toLowerCase().indexOf(term))) {
                        resourceList.push(listAll[i]);
                    }
                }
            }
            else {
                for (let i = 0; i < lengthAll; i++) {
                    if (this.isTypeMatching(type, listAll[i].auth_type)) {
                        resourceList.push(listAll[i]);
                    }
                }
            }
        }

        this.set('_resourceList', resourceList);

        if (0 === resourceList.length) {
            this._showMessage('There are no resources available according to selected filters.');
        }
    }

    _reset() {
        this.$.appscoSearch.reset();
        this.$.resourceTypeList.selected = 0;
        this.set('_resourceList', []);
        this.set('_resourceListAll', []);
        this.set('resources', []);
        this.set('_selectedResources', []);
        this._componentReady = false;
        this._resourcesLoaded = false;
        this._filterTerm = '';
        this._filterType = 'all';
        this._numberOfSelectedResources = 0;
        this._bulkSelect = false;
        this._hideLoader();
        this._hideError();
        this._hideMessage();
    }

    _computeResourceListCount(resourceList) {
        return resourceList && resourceList.length ? resourceList.length : 0;
    }

    _resourcesAssignFinished() {
        this.$.dialog.close();

        this.dispatchEvent(new CustomEvent('resources-shared', {
            bubbles: true,
            composed: true,
            detail: {
                companyRole: this._shareToCompanyRoles, // remove
                resources: this._selectedResources
            }
        }));

        this.set('_selectedResources', []);
        this.set('_shareToCompanyRoles', []);
        this._hideLoader();
    }

    _assignResources(companyRoles) {
        const resources = this._selectedResources,
            request = document.createElement('iron-request'),
            options = {
                url: this.shareResourcesApi,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers
            };
        let body = [];

        resources.forEach((resource) => {
            body.push('resources[]=' + encodeURIComponent(resource.self));
        })

        companyRoles.forEach((role) => {
            body.push(`companyRoles[]=${role.alias}`);
        });

        options.body = body.join('&');

        request.send(options).then(function() {
            this._resourcesAssignFinished();
        }.bind(this), function() {
            this._showError(this.apiErrors.getError(request.response.code));
            this._hideLoader();
        }.bind(this));
    }

    _onAssignResourcesAction() {
        const list = JSON.parse(JSON.stringify(this._resourceListAll)),
            length = list.length;

        this.set('_selectedResources', []);
        for (let i = 0; i < length; i++) {
            if (list[i].selected) {
                this._selectedResources.push(list[i]);
            }
        }

        if (0 === this._selectedResources.length) {

        }

        this._assignResources(this._shareToCompanyRoles);

    }

    _onInnerIronOverlay(event) {
        event.stopPropagation();
    }

    setShareToCompanyRoles(companyRoles) {
        this._shareToCompanyRoles = companyRoles;
    }

    reloadApplications(searchValue) {
        const request = document.createElement('iron-request'),
            url = this.getResourcesApi + '?extended=1&limit=9999';

        const options = {
            url: url,
            method: 'GET',
            handleAs: 'json',
            headers: this._headers
        };

        this._showLoader();
        request.send(options).then(function() {
            const applications = request.response.applications;

            if (applications && applications.length > 0) {
                this.set('_resourceListAll', applications);
                this.set('_resourceList', applications);
            }
            else {
                this.set('_resourceListAll', []);
                this.set('_resourceList', []);
                this._message = 'No applications match search criteria.';
            }

            this._hideLoader();
        }.bind(this));
    }

    getDisplayType(auth_type) {
        const resourceTypes = this._resourceTypeList;
        for (let i = 0; i < resourceTypes.length; i++) {
            if (resourceTypes[i].auth_types.indexOf(auth_type) > -1) {
                return resourceTypes[i].name;
            }
        }

        return 'Application';
    }

    isTypeMatching(selectedType, resourceAuthType) {
        const resourceTypes = this._resourceTypeList;
        for (let i = 0; i < resourceTypes.length; i++) {
            if (
                resourceTypes[i].value === selectedType
                && resourceTypes[i].auth_types.indexOf(resourceAuthType) > -1
            ) {
                return true;
            }
        }

        return false;
    }
}
window.customElements.define(AppscoShareRecources.is, AppscoShareRecources);
