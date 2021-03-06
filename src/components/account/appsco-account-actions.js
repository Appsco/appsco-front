import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/shadow.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountActions extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                @apply --appsco-account-actions;
            }
            :host .advanced-settings-button {
                @apply --account-advanced-settings-action;
            }
            :host .advanced-settings-button[active] {
                @apply --shadow-elevation-2dp;
                @apply --account-advanced-settings-action-active;
            }
            :host .advanced-settings-button[disabled] {
                opacity: 0.5;
            }
        </style>

        <template is="dom-if" if="[[ _shouldShowAdvancedActions ]]">
            <paper-button
                id="advancedSettingsAction"
                class="advanced-settings-button"
                disabled\$="[[ _advancedDisabled ]]"
                toggles=""
                on-tap="_onAdvancedSettingsAction"
                >Advanced settings</paper-button>
        </template>
`;
    }

    static get is() { return 'appsco-account-actions'; }

    static get properties() {
        return {
            advancedActions: {
                type: Boolean,
                value: false
            },

            _advancedActionsVisible: {
                type: Boolean,
                value: true
            },

            _shouldShowAdvancedActions: {
                type: Boolean,
                computed: '_computeShouldShowAdvancedActions(advancedActions, _advancedActionsVisible)'
            },

            _advancedDisabled: {
                type: Boolean,
                value: false
            }
        };
    }

    _onAdvancedSettingsAction() {
        this.dispatchEvent(new CustomEvent('advanced-settings', { bubbles: true, composed: true }));
    }

    disableAdvancedSettings() {
        this._advancedDisabled = true;
    }

    enableAdvancedSettings() {
        this._advancedDisabled = false;
    }

    resetAdvancedSettingsAction() {
        const button = this.shadowRoot.getElementById('advancedSettingsAction');
        if (button) {
            button.active = false;
        }
    }

    hideAdvancedSettings() {
        this._advancedActionsVisible = false;
    }

    showAdvancedSettings() {
        this._advancedActionsVisible = true;
    }

    _computeShouldShowAdvancedActions(advancedActionsEnabled, _advancedActionsVisible) {
        return advancedActionsEnabled && _advancedActionsVisible;
    }
}
window.customElements.define(AppscoAccountActions.is, AppscoAccountActions);
