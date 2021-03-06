import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-image/iron-image.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoEditOAuthApplicationForm extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host .save-action {
                margin: 20px 0 0 0;
                @apply --form-action;
            }
            :host .application-image {
                width: 64px;
                height: 64px;
                margin-left: 20px;
            }
            :host .horizontal-align {
                @apply --layout-horizontal;
            }
            :host .flex {
                @apply --layout-flex;
            }
            :host .no-flex {
                @apply --layout-flex-none;
            }
        </style>

        <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

        <div class="dialog-container">

            <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

            <iron-form id="form" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                <form method="POST" action="[[ _oauthApplicationUpdateApi ]]">

                    <div class="input-container">
                        <paper-input id="title" label="Title" name="oauth_application[title]" value="[[ application.title ]]" required="" auto-validate="" error-message="Please enter title of the application."></paper-input>
                    </div>

                    <div class="input-container">
                        <paper-input label="Redirect URL" name="oauth_application[redirect_url]" value="[[ application.redirect_url ]]" pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&amp;//=]*)" required="" auto-validate="" error-message="Please enter valid URL."></paper-input>
                    </div>

                    <div class="input-container">
                        <paper-input label="Website URL" name="oauth_application[website_url]" value="[[ application.website_url ]]" pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&amp;//=]*)" required="" auto-validate="" error-message="Please enter valid URL."></paper-input>
                    </div>

                    <div class="input-container horizontal-align">
                        <paper-input label="Icon" name="oauth_application[icon_url]" value\$="[[ _applicationIcon ]]" pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&amp;//=]*)" required="" auto-validate="" error-message="Please enter valid icon URL." class="flex" on-value-changed="_onIconInputValueChanged"></paper-input>

                        <iron-image class="application-image no-flex" src="[[ _applicationIcon ]]" alt="Application image" preload="" fade="" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAI5JREFUeAHt1YEJwCAQBEFN/60KYgMRbGMnHXjs5Ofa5x/h7wu//T3dAAqIL4BAPIChAAXEF0AgHoCfIAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBe4yV0EThqVC64AAAAASUVORK5CYII=" sizing="contain"></iron-image>
                    </div>

                    <div class="input-container">
                        <paper-textarea label="Description" name="oauth_application[description]" value="[[ application.description ]]" rows="3"></paper-textarea>
                    </div>
                </form>
            </iron-form>
        </div>

        <div class="buttons">
            <paper-button class="save-action" autofocus="" on-tap="_onSaveAction">Save</paper-button>
        </div>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnterAction"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-edit-oauth-application-form'; }

    static get properties() {
        return {
            application: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _oauthApplicationUpdateApi: {
                type: Object,
                computed: '_computeUpdateApi(application)'
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
            },

            _applicationIcon: {
                type: String
            }
        };
    }

    static get observers() {
        return [
            '_onApplicationChanged(application)'
        ];
    }

    ready() {
        super.ready();

        this._target = this.$.form;
    }

    initialize() {
        const application = JSON.parse(JSON.stringify(this.application));

        this.set('application', {});
        this.set('application', application);
        this.$.title.focus();
    }

    reset() {
        this._target.reset();
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

    _computeUpdateApi(application) {
        return application.self ? application.self : null;
    }

    _onApplicationChanged(application) {
        this._applicationIcon = application.icon_url ? application.icon_url : null;
    }

    _onIconInputValueChanged(event) {
        this.debounce('setIconURL', function() {
            this._applicationIcon = event.detail.value;
        }.bind(this), 500);
    }

    _onEnterAction() {
        this._onSaveAction();
    }

    _onSaveAction() {
        this._hideError();

        if (this._target.validate()) {
            this._showLoader();
            this._target.submit();
        }

    }

    _onFormPresubmit(event) {
        event.target.request.method = 'PUT';
    }

    _onFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.request.response.code));
        this._hideLoader();
    }

    _onFormResponse(event) {
        this._hideLoader();

        this.dispatchEvent(new CustomEvent('oauth-application-updated', {
            bubbles: true,
            composed: true,
            detail: {
                application: event.detail.response
            }
        }));
    }
}
window.customElements.define(AppscoEditOAuthApplicationForm.is, AppscoEditOAuthApplicationForm);
