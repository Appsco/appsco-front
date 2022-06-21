import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-input/paper-input.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import './appsco-customer-subscription-toggle.js';
import './appsco-customer-handbook-toggle.js';
import './appsco-customer-timecontrol-toggle.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoManageCustomerSubscription extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-manage-customer-subscription;

                --form-error-box: {
                    margin-top: 0;
                };
            }
            :host paper-dialog {
                @apply --appsco-paper-dialog;
                width: 670px;
                top: 114px;
                
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host appsco-loader {
                @apply --paper-dialog-appsco-loader;
            }
            :host appsco-form-error {
                box-sizing: border-box;
            }
        </style>
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <h2>Change customer subscription</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

            <appsco-customer-subscription-toggle id="appscoAccountRoles" customer="[[ customer ]]" partner="[[ partner ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-customer-subscription-state-changed="_onManageCustomerState"></appsco-customer-subscription-toggle>

            <template is="dom-if" if="[[ _isPaidExternally ]]">
                <paper-input allowed-pattern="\\d+" id="numOfLicences" label="Number of licences" error-message="Please enter number of licences." value="[[ customer.max_subscription_size ]]" auto-validate=""></paper-input>
            </template>
            <template is="dom-if" if="[[ _hasAppsCoOneHr ]]">
                <h3 style="margin-bottom:0; border-top: 1px solid #e8e8e8; padding-top: 10px;">Appsco One Packages</h3>
                <paper-radio-group style="margin-top:5px;" selected="{{ selectedPackage }}">
<!--                    <paper-radio-button name="none">Handbook Only</paper-radio-button>-->
                    <paper-radio-button name="free">Appsco One Free</paper-radio-button>
                    <paper-radio-button name="plus">Appsco One Plus</paper-radio-button>
<!--                    <paper-radio-button name="premium">Appsco One Premium</paper-radio-button>-->
                </paper-radio-group>
            </template>

<!--            <template is="dom-if" if="[[ _isNotHandbookOnly ]]">-->
                <h3>Handbook</h3>
                <appsco-customer-handbook-toggle id="appscoCustomerHandbook" customer="[[ customer ]]" partner="[[ partner ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]"></appsco-customer-handbook-toggle>

                <h3>Time Control</h3>
                <appsco-customer-timecontrol-toggle id="appscoCustomerTimecontrol" customer="[[ customer ]]" partner="[[ partner ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]"></appsco-customer-timecontrol-toggle>
<!--            </template>-->

            <div class="buttons">
                <paper-button dialog-dismiss="">Close</paper-button>
                <template is="dom-if" if="[[ _isPaidExternally ]]">
                    <paper-button autofocus="" on-tap="_assign">Assign</paper-button>
                </template>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-manage-customer-subscription'; }

    static get properties() {
        return {
            customer: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            partner: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            apiErrors: {
                type: String
            },

            _isPaidExternally: {
                type: Boolean,
                computed: "_computeIsPaidExternally(customer)"
            },

            _isNotHandbookOnly: {
                type: Boolean,
                computed: "_computeIsNotHandbookOnly(selectedPackage, _hasAppsCoOneHr)"
            },

            _activePackage: {
                type: String,
                computed: "_computeActivePackage(customer)"
            },

            hasAppscoOneHr: {
                type: Boolean,
                value: false
            },

            _hasAppsCoOneHr: {
                type: Boolean,
                value: false,
                computed: "_computeHasAppsCoOneHr(_isPaidExternally, hasAppscoOneHr)"
            },

            selectedPackage: {
                type: String,
                value: 'free'
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            _updateNumberOfLicencesApi: {
                type: String,
                computed: '_computeUpdateNumberOfLicencesApi(customer)'
            }
        };
    }

    toggle() {
        this.$.dialog.open();
    }

    close() {
        this.$.dialog.close();
    }

    setCustomer(customer) {
        this.customer = customer;
    }

    _setPartner(partner) {
        this.set('partner', {});
        this.set('partner', partner);
    }

    _setCustomer(customer) {
        this.set('customer', {});
        this.set('customer', customer);
    }

    _onDialogClosed() {
        this._loader = false;
        this._errorMessage = '';
    }

    _computeUpdateNumberOfLicencesApi(customer) {
        return customer ? (customer.self + '/update-number-of-licences') : null;
    }

    _computeIsPaidExternally(customer) {
        return customer && customer.subscription_paid_externally == true;
    }

    _computeHasAppsCoOneHr(_isPaidExternally, hasAppscoOneHr) {
        return _isPaidExternally && hasAppscoOneHr;
    }

    _computeIsNotHandbookOnly(selectedPackage, _hasAppsCoOneHr) {
        return selectedPackage !== 'none' && _hasAppsCoOneHr;
    }

    _computeActivePackage(customer) {
        if(!customer.self) {
            return;
        }
        this.set('hasAppscoOneHr', false);
        const appRequest = document.createElement('iron-request'),
            options = {
                url: `${customer.self}/appscoonehr-configuration`,
                method: 'GET',
                handleAs: 'json',
                headers: this._headers
            };

        appRequest.send(options).then(function() {
            let packageSelected = 'none';
            appRequest.response.packages.forEach((availablePackage) => {
                if(availablePackage === 'free') {
                    packageSelected = 'free';
                }
                if(availablePackage === 'plus') {
                    packageSelected = 'plus';
                }
                if(availablePackage === 'premium') {
                    packageSelected = 'premium';
                }
            })
            this.set('hasAppscoOneHr', true);
            this.selectedPackage = packageSelected;
        }.bind(this), function() {
            this.set('hasAppscoOneHr', false);
            if (appRequest.status !== 200) {
                this._errorMessage ="Could not retrieve AppsCo One packages!";
            }
            this._loader = false;
        }.bind(this));

    }

    _onManageCustomerState(event) {
        const customer = event.detail.customer,
            partner = event.detail.partner;

        this._setCustomer(customer);
        this._setPartner(partner);
    }

    _updatePackages(customer) {
        if(!customer.self) {
            return;
        }
        const appRequest = document.createElement('iron-request'),
            options = {
                url: `${customer.self}/appscoonehr-packages`,
                method: 'PUT',
                handleAs: 'json',
                headers: this._headers,
                body: 'form[package]=' + this.selectedPackage
            };
        this._loader = true;
        appRequest.send(options).then(function() {
        }.bind(this), function() {
            if (appRequest.status !== 200) {
                this._errorMessage = this.apiErrors.getError(appRequest.response.code);
            }
            this._loader = false;
        }.bind(this));
    }

    _assign() {
        const numberOfLicences = this.shadowRoot.getElementById('numOfLicences');

        if (numberOfLicences.value.length === 0) {
            numberOfLicences.invalid = true;
            numberOfLicences.focus();
            return false;
        }

        const appRequest = document.createElement('iron-request'),
            options = {
                url: this._updateNumberOfLicencesApi,
                method: 'PUT',
                handleAs: 'json',
                headers: this._headers,
                body: 'form[number_of_licences]=' + numberOfLicences.value
            };

        this._loader = true;

        appRequest.send(options).then(function() {
            this.$.dialog.close();
            this._setPartner(appRequest.response.partner);

            this.dispatchEvent(new CustomEvent('customer-licences-managed', {
                bubbles: true,
                composed: true,
                detail: {
                    'customer' : appRequest.response.customer
                }
            }));
            this._updatePackages(appRequest.response.customer);
        }.bind(this), function() {
            if (appRequest.status !== 200) {
                this._errorMessage = this.apiErrors.getError(appRequest.response.code);
            }
            this._loader = false;
        }.bind(this));
    }
}
window.customElements.define(AppscoManageCustomerSubscription.is, AppscoManageCustomerSubscription);
