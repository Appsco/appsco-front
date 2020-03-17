import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/components/appsco-loader.js';
import '../components/application/appsco-application-add-settings.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DisableUpgradeMixin } from "@polymer/polymer/lib/mixins/disable-upgrade-mixin";

class AppscoDialogApplicationAdd extends DisableUpgradeMixin(PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            appsco-application-settings {
                --form-action: {
                    display: none;
                };
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <h2>Add Resource</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <div>
                        <appsco-application-add-settings
                            id="appscoApplicationAddSettings"
                            application-template="[[ applicationTemplate ]]"
                            authorization-token="[[ authorizationToken ]]"
                            dashboard-api="[[ dashboardApi ]]"
                            on-form-error="_onFormError">
                        </appsco-application-add-settings>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onSave">Save</paper-button>
            </div>

        </paper-dialog>
`;
    }

    static get is() { return 'appsco-dialog-application-add'; }

    static get properties() {
        return {
            applicationTemplate: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            dashboardApi: {
                type: String
            },

            _loader: {
                type: Boolean,
                value: false
            }
        };
    }

    ready(){
        super.ready();

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('application-added', this.toggle);
        this.addEventListener('form-error', this._hideLoader);
    }

    setApplicationTemplate(applicationTpl) {
        this.applicationTemplate = applicationTpl;
    }

    toggle() {
        this.$.dialog.toggle();
    }

    _onDialogClosed() {
        this._hideLoader();
        this.reset();
    }

    _onSave() {
        this._showLoader();
        this.$.appscoApplicationAddSettings.addApplication();
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _onFormError() {
        this._hideLoader();
    }

    reset() {
        this.$.appscoApplicationAddSettings.reset();
    }
}
window.customElements.define(AppscoDialogApplicationAdd.is, AppscoDialogApplicationAdd);
