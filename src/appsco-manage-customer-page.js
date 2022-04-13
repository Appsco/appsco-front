import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import './components/page/appsco-content.js';
import './components/page/appsco-manage-page-styles.js';
import './components/customer/appsco-manage-customer-components-page.js';
import './components/customer/appsco-customer-partner-admins-page.js';
import './components/customer/appsco-manage-customer-subscription.js';
import './components/customer/appsco-manage-customer-page-actions.js';
import './components/customer/appsco-add-partner-admin.js';
import './components/resource/appsco-share-resources.js';
import './components/customer/appsco-remove-customer.js';
import './components/customer/appsco-customer-partner-admin-remove.js';
import './lib/mixins/appsco-page-mixin.js';
import './lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoManageCustomerPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-manage-page-styles">
            :host div[resource] {
                height: calc(100% - 32px - 20px);
            }
            :host div[label] {
                color: var(--secondary-text-color);
                @apply --paper-font-body1;
                @apply --application-details-label;
                font-size: 12px;
            }
            .customer-icon {
                width: 96px;
                height: 96px;
                margin-left: auto;
                margin-right: auto;
                background-color: var(--brand-color);
                border-radius: 50%;
                position: relative;
            }
            .customer-icon iron-icon {
                width: 48px;
                height: 48px;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;

                --iron-icon-fill-color: #ffffff;
            }
            .customer-name {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 16px;
                @apply --text-wrap-break;
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <iron-ajax id="ironAjaxGetCustomer" on-error="_onGetCustomerError" on-response="_onGetCustomerResponse" headers="[[ _headers ]]"></iron-ajax>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">

                <div class="resource-header">
                    <div class="customer-icon">
                        <iron-icon icon="icons:social:domain"></iron-icon>
                    </div>
                </div>

                <div class="resource-content">
                    <div class="customer-name">[[ customer.name ]]</div>
                    <div label="">Customer ID</div>
                    <div class="customer-id">[[ customer.company_uuid ]]</div>
                    <div label="">Contact</div>
                    <div class="customer-email">[[ customer.contact_email ]]</div>
                </div>

                <div class="resource-actions flex-horizontal">
                    <paper-button class="button danger-button flex" on-tap="_onDeleteCustomerAction">
                        Delete
                    </paper-button>
                </div>

            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <neon-animated-pages class="flex" selected="{{ _selected }}" attr-for-selected="name">

                        <appsco-manage-customer-components-page id="appscoManageCustomerComponentsPage" name="appsco-customer-components-page" authorization-token="[[ authorizationToken ]]" customer="[[ customer ]]" customer-partner-admins-api="[[ partnerAdminsApi ]]" api-errors="[[ apiErrors ]]" on-manage-customer-roles="_onManageCustomerRoles" on-manage-customer-subscription="_onManageCustomerSubscription">
                        </appsco-manage-customer-components-page>

                        <appsco-customer-partner-admins-page id="appscoCustomerPartnerAdminsPage" name="appsco-customer-partner-admins-page" customer="[[ customer ]]" partner-admins-api="[[ partnerAdminsApi ]]" authorization-token="[[ authorizationToken ]]" on-add-partner-admin="_onAddPartnerAdminAction" on-remove-partner-admin-from-customer="_onRemovePartnerAdminFromCustomer" on-back="_onResourceBack">
                        </appsco-customer-partner-admins-page>

                    </neon-animated-pages>
                </div>

            </div>
        </appsco-content>

        <appsco-manage-customer-subscription id="appscoManageCustomerSubscription" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" partner="[[ currentCompany ]]" on-customer-subscription-state-changed="_onCustomerSubscriptionStateChanged" on-customer-licences-managed="_onCustomerLicencesManaged">
        </appsco-manage-customer-subscription>

        <appsco-add-partner-admin id="appscoAddPartnerAdmin" authorization-token="[[ authorizationToken ]]" get-roles-api="[[ companyRolesApi ]]" add-partner-admin-api="[[ addPartnerAdminToCustomerApi ]]" api-errors="[[ apiErrors ]]" on-partner-admins-added="_onPartnerAdminsAdded" on-accounts-loaded="_hideProgressBar">
        </appsco-add-partner-admin>

        <appsco-share-resources id="appscoShareResources" authorization-token="[[ authorizationToken ]]" share-resources-api="{{ _customerShareResourcesApi }}" get-resources-api="{{ _customerResourcesApi }}" api-errors="[[ apiErrors ]]" >
        </appsco-share-resources>

        <appsco-customer-partner-admin-remove id="appscoCustomerPartnerAdminRemove" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-partner-admin-removed-from-customer="_onPartnerAdminRemovedFromCustomer">
        </appsco-customer-partner-admin-remove>

        <appsco-remove-customer id="appscoRemoveCustomer" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]">
        </appsco-remove-customer>
`;
    }

    static get is() { return 'appsco-manage-customer-page'; }

    static get properties() {
        return {
            route: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            customer: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            currentCompany: {
                type: Object
            },

            customersApi: {
                type: String,
                observer: '_onCustomersApiChanged'
            },

            partnerAdminsApi: {
                type: String,
                computed: '_computePartnerAdminsApi(customer)'
            },

            companyRolesApi: {
                type: String
            },

            addPartnerAdminToCustomerApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _customerResourcesApi: {
                type: String,
                computed: '_computeCustomerResourceApi(customer)'
            },

            _customerShareResourcesApi: {
                type: String,
                computed: '_computeCustomerShareResourceApi(customer)'
            },

            mediumScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            /**
             * Selected page.
             * It has value of component's 'name' attribute.
             */
            _selected: {
                type: String,
                value: 'appsco-customer-components-page',
                notify: true
            },

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mediumScreen, tabletScreen, mobileScreen)'
        ];
    }

    ready() {
        super.ready();

        this.pageLoaded = false;
        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };

        beforeNextRender(this, function() {
            if (this.mobileScreen || this.tabletScreen || this.mediumScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._getCustomer();
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    setCustomer(customer) {
        this.set('customer', customer);
    }

    resetCustomer() {
        const customer = JSON.parse(JSON.stringify(this.customer));

        this.set('customer', {});
        this.set('customer', customer);
    }

    reloadCustomer(customer) {
        this.set('customer', {});
        this.set('customer', customer);

        this.$.appscoManageCustomerComponentsPage.reloadCustomer(customer);
    }

    resetPage() {
        this._showCustomerComponentsPage();
    }

    removePartnerAdmins(customer, partnerAdmins) {
        if (customer.alias === this.customer.alias) {
            this._removePartnerAdmins(partnerAdmins);
        }
    }

    reloadPartnerAdmins(customers) {
        for (let idx in customers) {
            if (this.customer.alias === customers[idx].alias) {
                this._reloadPartnerAdmins();
                break;
            }
        }
    }

    _computeCustomerResourceApi(customer) {
        return customer.hasOwnProperty('self') ? `${customer.self}/resources` : '';
    }

    _computeCustomerShareResourceApi(customer) {
        return customer.hasOwnProperty('self') ? `${customer.self}/resources/share` : '';
    }

    _removePartnerAdmins(partnerAdmins) {
        this.$.appscoManageCustomerComponentsPage.removePartnerAdmins(partnerAdmins);
        this.$.appscoCustomerPartnerAdminsPage.removePartnerAdmins(partnerAdmins);
    }

    _reloadPartnerAdmins() {
        this.$.appscoManageCustomerComponentsPage.reloadPartnerAdmins();
        this.$.appscoCustomerPartnerAdminsPage.reloadPartnerAdmins();
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _updateScreen(medium, tablet, mobile) {
        this.updateStyles();

        if (mobile) {
            this.$.appscoContent.hideSection('resource');
        }
        else if (!this.$.appscoContent.resourceActive) {
            this.$.appscoContent.showSection('resource');
        }
    }

    _computePartnerAdminsApi(customer) {
        return (customer && customer.meta) ? customer.meta.list_partner_admins : null;
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _onCustomersApiChanged() {
        this._getCustomer();
    }

    _getCustomer() {
        if (!this.customer.self && this.customersApi && this._headers) {
            const customerApi = this.customersApi + this.route.path,
                getCustomerRequest = this.$.ironAjaxGetCustomer;

            if (getCustomerRequest.lastRequest) {
                getCustomerRequest.lastRequest.abort();
            }

            getCustomerRequest.url = customerApi;
            getCustomerRequest.generateRequest();
        }
    }

    _onGetCustomerResponse(event) {
        if (200 === event.detail.status && event.detail.response) {
            this.set('customer', event.detail.response);
        }

        this._onPageLoaded();
    }

    _onGetCustomerError(event) {
        if (!event.detail.request.aborted) {
            this.dispatchEvent(new CustomEvent('page-error', { bubbles: true, composed: true }));
        }
    }

    _showCustomerComponentsPage() {
        this._selected = 'appsco-customer-components-page';
    }

    reload() {
        this.$.appscoManageGroupComponentsPage.loadPage();
        this.$.appscoGroupRolesPage.loadPage();
    }

    _onManageCustomerRoles() {
        this._showCustomerRolesPage();
    }

    _showCustomerRolesPage() {
        this._selected = 'appsco-customer-partner-admins-page';
    }

    _showAccountComponentsPage() {
        this._selected = 'appsco-customer-components-page';
    }

    _onResourceBack() {
        this._showAccountComponentsPage();
    }

    _onDeleteCustomerAction() {
        const dialog = this.shadowRoot.getElementById('appscoRemoveCustomer');
        dialog.setCustomer(this.customer);
        dialog.open();
    }

    _onRemovePartnerAdminFromCustomer(event) {
        const customer = event.detail.customer,
            partnerAdmin = event.detail.partnerAdmin;

        const dialog = this.shadowRoot.getElementById('appscoCustomerPartnerAdminRemove');
        dialog.setCustomer(customer);
        dialog.setPartnerAdminRole(partnerAdmin);
        dialog.open();
    }

    _onPartnerAdminRemovedFromCustomer(event) {
        const partnerAdmin = event.detail.partnerAdmin,
            customer = event.detail.customer;

        this.removePartnerAdmins(customer, [partnerAdmin]);
        this._notify('Partner admin role revoked');
    }

    _onManageCustomerSubscription(event) {
        const customer = event.detail.customer,
            dialog = this.shadowRoot.getElementById('appscoManageCustomerSubscription');

        dialog.setCustomer(customer);
        dialog.toggle();
    }

    _onCustomerLicencesManaged(event) {
        const customer = event.detail.customer;
        this.reloadCustomer(customer);
        this._notify('Licences successfully assigned.');
    }

    _onAddPartnerAdminAction() {
        const dialog = this.shadowRoot.getElementById('appscoAddPartnerAdmin');
        dialog.setCustomers([this.customer]);
        dialog.open();
        this._hideProgressBar();
    }

    _onPartnerAdminsAdded(event) {
        const customers = event.detail.customers;
        this.reloadPartnerAdmins(customers);
        const dialog = this.shadowRoot.getElementById('appscoShareResources');
        dialog.setShareToCompanyRoles(event.detail.partnerAdmins);
        dialog.toggle();
        this._hideProgressBar();
    }

    _onCustomerSubscriptionStateChanged(event) {
        const customer = event.detail.customer;
        this.setCustomer(customer);

        this._notify('Subscription paid externally has been turned ' +
            (customer.subscription_paid_externally ? 'on' : 'off') +
            ' for customer ' + customer.name + '.');
    }
}
window.customElements.define(AppscoManageCustomerPage.is, AppscoManageCustomerPage);
