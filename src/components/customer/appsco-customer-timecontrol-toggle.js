import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomerTimecontrolToggle extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                @apply --appsco-customer-timecontrol-toggle;
            }
            :host paper-toggle-button {
                cursor: pointer;
            }
            :host .info {
                margin-top: 10px;
            }
        </style>

        <paper-toggle-button id="switch" checked\$="[[ customer.time_control ]]" on-change="_onSwitchChanged">Time Control activated by partner</paper-toggle-button>
        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <div class="info">
            <template is="dom-if" if="[[ _isTimecontrolActivated  ]]">
                <p>Time Control activated for customer by partner.</p>
            </template>

            <template is="dom-if" if="[[ !_isTimecontrolActivated  ]]">
                <p>Time Control can be activated for customer by partner.</p>

                <p>Once activating the time control package customer will be able to use time control.</p>
            </template>
        </div>
`;
    }

    static get is() { return 'appsco-customer-timecontrol-toggle'; }

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
                type: Array,
                value: function () {
                    return {};
                }
            },

            _isTimecontrolActivated: {
                type: Boolean,
                computed: '_computeIsTimecontrolActive(customer)'
            },

            _timecontrolPackageStateApi: {
                type: String,
                computed: '_computeTimecontrolPackageStateApi(customer)'
            },

            _errorMessage: {
                type: String
            }
        };
    }

    resetCustomer() {
        const customer = JSON.parse(JSON.stringify(this.customer));
        this.set('customer', {});
        this.set('customer', customer);
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _turnTimecontrolPackageOn() {
        this._callTimecontrolPackagesApi(1);
    }

    _turnTimecontrolPackageOff() {
        this._callTimecontrolPackagesApi(0);
    }

    _callTimecontrolPackagesApi(status) {
        const request = document.createElement('iron-request'),
            options = {
                url: this._timecontrolPackageStateApi,
                method: 'PUT',
                handleAs: 'json',
                headers: this._headers,
                body: 'form[timecontrol]=' + status
            };

        if (!this._timecontrolPackageStateApi || !this._headers) {
            this._showError(this.apiErrors.getError(404));
            return false;
        }

        request.send(options).then(function() {
            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('customer-timecontrol-state-changed', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        customer: request.response.customer,
                        partner: request.response.partner
                    }
                }));
            }

        }.bind(this), function() {
            this._showError(this.apiErrors.getError(request.response.code));
            this.customer.time_control = !status;
        }.bind(this));
    }

    _onSwitchChanged(event) {
        event.target.checked ? this._turnTimecontrolPackageOn() : this._turnTimecontrolPackageOff();
    }

    _computeIsTimecontrolActive(customer) {
        return customer && customer.time_control == true;
    }

    _computeTimecontrolPackageStateApi(customer) {
        return customer ? (customer.self + '/timecontrol') : null;
    }
}
window.customElements.define(AppscoCustomerTimecontrolToggle.is, AppscoCustomerTimecontrolToggle);
