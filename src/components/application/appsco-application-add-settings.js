import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/iron-form/iron-form.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import './appsco-application-info.js';
import './appsco-application-settings.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationAddSettings extends mixinBehaviors([
    NeonSharedElementAnimatableBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
            :host appsco-application-info {
                margin-bottom: 10px;

            --paper-font-caption: {
                 font-size: 14px;
             };
            }
        </style>

        <div id="applicationHeader">
            <template is="dom-if" if="[[ application.self ]]">
                <appsco-application-info application="[[ application ]]"></appsco-application-info>
            </template>
        </div>
        <div id="appscoApplicationSettings">

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is saving application" multi-color=""></appsco-loader>

            <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

            <iron-form id="addApplicationForm" headers="[[ _headers ]]" on-iron-form-response="_onFormResponse">
                <form hidden="" method="POST" action\$="[[ _computedAction ]]">
                    <paper-input name="application[resource]" value="[[ applicationTemplate.self ]]" hidden></paper-input>
                </form>
            </iron-form>

            <appsco-application-settings
                id="applicationSettings"
                show-save-button="[[ _saveButton ]]"
                on-application-settings-no-changes="_fireNoChangesInSettings"
                on-application-settings-saved="_fireSettingsChanged"
                authorization-token="[[ authorizationToken ]]"
                application-tpl="[[ applicationTemplate ]]"
                application="[[ application ]]">
            </appsco-application-settings>

        </div>
`;
    }

    static get is() { return 'appsco-application-add-settings'; }

    static get properties() {
        return {
            _saveButton: {
                type: Boolean,
                value: false
            },

            applicationTemplate: {
                type: Object
            },

            application: {
                type: Object,
                notify: true,
                value: function () {
                    return {};
                }
            },

            dashboardApi: {
                type: String
            },

            /**
             * Computed action to call in order to save application as icon.
             */
            _computedAction: {
                type: String,
                computed: "_computeAction(dashboardApi)"
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            animationConfig: {
                type: Object
            },

            sharedElements: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': [{
                name: 'hero-animation',
                id: 'hero',
                toPage: this
            }, {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 600
                }
            }],
            'exit': {
                name: 'fade-out-animation',
                node: this
            }
        };
        this.sharedElements = {
            'hero': this.shadowRoot.getElementById('appscoApplicationSettings')
        };
    }

    _fireNoChangesInSettings(e) {
        this.application = e.detail.application;
        this._onApplicationAdded();
    }

    _fireSettingsChanged(e) {
        this.application = e.detail.application;
        this._onApplicationAdded();
    }

    /**
     * Computes action for saving application as icon.
     *
     * @param {String} dashboardApi
     * @returns {string}
     * @private
     */
    _computeAction(dashboardApi) {
        return dashboardApi + '/icons';
    }

    /**
     * Called on form error when trying to add new application as icon.
     *
     * @param {Object} event
     * @private
     */
    _onFormError(event) {
        this._errorMessage = event.detail.error.message;
        this._hideLoader();
    }

    /**
     * Called after application is added as icon.
     * It calls application configure method.
     *
     * @param {Object} event
     * @private
     */
    _onFormResponse(event) {
        this.$.applicationSettings.save(event.detail.response.icon);
    }

    /**
     * Submits form which adds application as item.
     */
    addApplication() {
        if (this.$.applicationSettings.isValid()) {
            this.$.addApplicationForm.submit();
        } else {
            this.dispatchEvent(new CustomEvent('form-error', { bubbles: true, composed: true }));
        }
    }

    /**
     * Called after application has been added.
     * It fires event.
     *
     * @private
     */
    _onApplicationAdded() {
        this._hideLoader();

        this.dispatchEvent(new CustomEvent('application-added', {
            bubbles: true,
            composed: true,
            detail: {
                application: this.application
            }
        }));
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    reset() {
        this.$.addApplicationForm.reset();
        this.set('application', {});
        this.set('applicationTemplate', {});
        this.$.applicationSettings.reset();
        this._hideLoader();
    }
}
window.customElements.define(AppscoApplicationAddSettings.is, AppscoApplicationAddSettings);
