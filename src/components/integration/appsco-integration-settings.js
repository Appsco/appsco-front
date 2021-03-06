import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '../components/appsco-form-error.js';
import '../components/appsco-loader.js';
import '../../provisioning/appsco-integration-form.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoIntegrationSettings extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-integration-settings;
            }
            :host .submit-button {
                margin: 20px 0 0 0;
                @apply --form-action;
            }
        </style>

        <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <iron-form id="form" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse" on-keyup="_onKeyUp">
            <form action="[[ _computedAction ]]" method="POST">

                <appsco-integration-form id="appscoIntegrationForm" name="appsco-integration-form" form-type="update" integration="[[ integration ]]">
                </appsco-integration-form>
            </form>
        </iron-form>

        <paper-button id="submit" class="submit-button" on-tap="_submitForm">Save</paper-button>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnter"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-integration-settings'; }

    static get properties() {
        return {
            integration: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _computedAction: {
                type: Object,
                computed: "_computeAction(integration)"
            },

            integrationApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _isIntegrationActive: {
                type: String,
                computed: '_computeIsIntegrationActive(integration)'
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            _target: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this._target = this.$.form;
    }

    _computeIsIntegrationActive(integration) {
        return integration && integration.active;
    }

    _computeAction(integration) {
        return integration.self ? integration.self : null;
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _onEnter() {
        this._submitForm();
    }

    _submitForm() {
        this.$.form.submit();
    }

    _onFormPresubmit(event) {
        this._showLoader();
        const form = event.target,
            integrationKind = this.$.appscoIntegrationForm.getIntegrationKind(),
            integrationScheduleSync = this.$.appscoIntegrationForm.getIntegrationScheduleSync(),
            integrationForceSync = this.$.appscoIntegrationForm.getIntegrationForceSync();

        form.request.method = 'PUT';

        form.request.body['activate_integration[kind]'] =
            integrationKind ? integrationKind : '';
        form.request.body['activate_integration[scheduleSyncInterval]'] =
            integrationScheduleSync ? integrationScheduleSync : '';
        form.request.body['activate_integration[forceSyncInterval]'] =
            integrationForceSync ? integrationForceSync : '';
    }

    _onFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.request.response.code));
        this._hideLoader();
    }

    _onFormResponse(event) {
        this.set('integration', event.detail.response.integration_active);

        this.dispatchEvent(new CustomEvent('integration-settings-changed', {
            bubbles: true,
            composed: true,
            detail: {
                integration: this.integration
            }
        }));
        this._hideError();
        this._hideLoader();
    }

    _onKeyUp() {
        this._hideError();
    }

    _reloadPage() {
        window.location.reload(true);
    }

    reset() {
        const integration = JSON.parse(JSON.stringify(this.integration));

        this._hideError();
        this._hideLoader();

        setTimeout(function() {
            this.set('integration', {});
            this.set('integration', integration);
        }.bind(this), 10);
    }
}
window.customElements.define(AppscoIntegrationSettings.is, AppscoIntegrationSettings);
