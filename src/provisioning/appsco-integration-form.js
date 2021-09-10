import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoIntegrationForm extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
            paper-dropdown-menu {
                width: 100%;
            }
            paper-toggle-button {
                cursor: pointer;
                margin-top: 20px;
            }
            .input-container {
                margin-bottom: 20px;
            }
            .input-info {
                margin: 0;
            }
        </style>

        <div class="input-container">
            <paper-input type="text" label="Title" name="activate_integration[name]" value="[[ integration.name ]]" required="" error-message="Please enter integration title." auto-validate="">
            </paper-input>
        </div>

        <div class="input-container url">
            <paper-input type="text" label="Url" name="activate_integration[service_url]" value="[[ integration.service_url ]]" error-message="Please enter valid integration url." auto-validate="" required="" pattern="[[ _urlValidationPattern ]]" disabled="[[ !hasOwnUrl ]]" hidden="[[ !hasOwnUrl ]]">
            </paper-input>
        </div>

        <div class="input-container url">
            <paper-input type="text" label="Token" name="activate_integration[credentials]" value="[[ integration.credentials ]]" required="" error-message="Please enter valid API token." disabled="[[ !requireToken ]]" hidden="[[ !requireToken ]]">
            </paper-input>
        </div>

        <div class="input-container instance">
            <paper-input type="text" label="Instance id" name="activate_integration[instance_id]" value="[[ integration.instance_id ]]" required="" disabled="[[ !requiresInstanceId ]]" hidden="[[ !requiresInstanceId ]]"></paper-input>
        </div>

        <div class="input-container claims">
            <paper-input type="text" label="Client id" name="activate_integration[claims][client_id]" value="[[ integration.claims.client_id ]]" required="" disabled="[[ !requiresClaims ]]" hidden="[[ !requiresClaims ]]"></paper-input>
            <paper-input type="text" label="Client secret" name="activate_integration[claims][client_secret]" value="[[ integration.claims.client_secret ]]" required="" disabled="[[ !requiresClaims ]]" hidden="[[ !requiresClaims ]]"></paper-input>
        </div>

        <div class="input-container itx">
            <paper-input type="text" label="Client token" name="activate_integration[claims][tokenv2]" value="[[ integration.claims.tokenv2 ]]" required="" disabled="[[ !requiresITXClaims ]]" hidden="[[ !requiresITXClaims ]]"></paper-input>
            <paper-input type="text" label="User id for associated user" name="activate_integration[claims][rcntrl]" value="[[ integration.claims.rcntrl ]]" required="" disabled="[[ !requiresITXClaims ]]" hidden="[[ !requiresITXClaims ]]"></paper-input>
            <paper-input type="text" label="Corporation group" name="activate_integration[claims][ccntrl]" value="[[ integration.claims.ccntrl ]]" required="" disabled="[[ !requiresITXClaims ]]" hidden="[[ !requiresITXClaims ]]"></paper-input>
            <paper-input type="text" label="Corporation id" name="activate_integration[claims][corp_id]" value="[[ integration.claims.corp_id ]]" required="" disabled="[[ !requiresITXClaims ]]" hidden="[[ !requiresITXClaims ]]"></paper-input>
        </div>

        <div class="input-container">
            <p class="input-info">Integration type determines the way in which AppsCo integrates with [[ integration.integration.title ]].</p>
            <paper-dropdown-menu id="integrationKindSelect" label="Integration type" name="activate_integration[kind]" horizontal-align="left" disabled="[[ _disableIntegrationTypeChange ]]" on-iron-overlay-closed="_onSelectClosed" required="" error-message="Please select integration type." auto-validate="">
                <paper-listbox id="integrationKindList" class="dropdown-content" attr-for-selected="value" selected="[[ _preselectedIntegrationKind ]]" slot="dropdown-content">
                    <template is="dom-repeat" items="[[ _integrationKindList ]]">
                        <paper-item value="[[ item.value ]]">[[ item.name ]]</paper-item>
                    </template>

                </paper-listbox>

            </paper-dropdown-menu>
        </div>

        <div class="input-container" style="display: none;">
            <p class="input-info">
                Schedule sync interval implies synchronization interval between AppsCo and [[ integration.integration.title ]].
                Synchronization will run at 00:00 at the start of the schedule sync interval.
            </p>
            <p>
                During the sync action, only stand-alone rules (rules that can run on their own) will run.
            </p>
            <paper-dropdown-menu id="integrationScheduleSyncSelect" label="Schedule sync interval" name="activate_integration[scheduleSyncInterval]" horizontal-align="left" on-iron-overlay-closed="_onSelectClosed" required="" error-message="Please select schedule sync interval." auto-validate="">
                <paper-listbox id="integrationScheduleSyncList" class="dropdown-content filter" attr-for-selected="value" selected="[[ _scheduleSyncInterval ]]" slot="dropdown-content">
                    <template is="dom-repeat" items="[[ _integrationScheduleSyncList ]]">
                        <paper-item value="[[ item.value ]]">[[ item.name ]]</paper-item>
                    </template>
                </paper-listbox>
            </paper-dropdown-menu>
        </div>

        <template is="dom-if" if="[[ _canForceSync ]]">
            <div class="input-container" style="display: none;">
                <p class="input-info">
                    Resync interval implies interval in which provisioned users from RA
                    which are no longer found in RA will be removed from AppsCo.
                </p>
                <paper-dropdown-menu id="integrationForceSyncSelect" label="Resync interval" name="activate_integration[forceSyncInterval]" horizontal-align="left" on-iron-overlay-closed="_onSelectClosed" auto-validate="">
                    <paper-listbox id="integrationScheduleForceSyncList" class="dropdown-content filter" attr-for-selected="value" selected="[[ integration.forceSyncInterval ]]" slot="dropdown-content">
                        <template is="dom-repeat" items="[[ _integrationForceSyncList ]]">
                            <paper-item value="[[ item.value ]]">[[ item.name ]]</paper-item>
                        </template>
                    </paper-listbox>
                </paper-dropdown-menu>
            </div>
        </template>

        <div class="input-container" style="display: none;">
            <p class="input-info">Comma-separated list of email accounts that are to be excluded by this integration.</p>
            <paper-input type="text" label="Whitelist" name="activate_integration[excluded_emails]" value="[[ integration.excluded_emails ]]" >
            </paper-input>
        </div>

        <div class="input-container">
            <p>
                When integration is active, integration rules will be applied according to sync interval.
            </p>
            <paper-toggle-button id="toggleIntegrationActive" checked\$="[[ _isIntegrationActive ]]" name="activate_integration[active]">Activate integration</paper-toggle-button>

        </div>
`;
    }

    static get is() { return 'appsco-integration-form'; }

    static get properties() {
        return {
            integration: {
                type: Object,
                value: function () {
                    return {
                        scheduleSyncInterval: 'daily'
                    };
                }
            },

            formType: {
                type: String,
                value: ''
            },

            hasOwnUrl: {
                type: Boolean,
                value: false,
                computed: '_computeHasOwnUrl(integration)',
                reflectToAttribute: true
            },

            requireToken: {
                type: Boolean,
                value: false,
                computed: '_computeRequireToken(integration)',
                reflectToAttribute: true
            },

            requiresClaims: {
                type: Boolean,
                value: false,
                computed: '_computeRequiresClaims(integration)',
                reflectToAttribute: true
            },

            requiresITXClaims: {
                type: Boolean,
                value: false,
                computed: '_computeRequiresITX(integration)',
                reflectToAttribute: true
            },

            requiresInstanceId: {
                type: Boolean,
                value: false,
                computed: '_computeRequiresInstanceId(integration)',
                reflectToAttribute: true
            },

            _disableIntegrationTypeChange: {
                type: Boolean,
                computed: '_computeDisableIntegrationTypeChange(formType)'
            },

            _integrationKindList: {
                type: Array,
                value: function () {
                    return [
                        {
                            value: 'ra',
                            name: 'From integration system to AppsCo'
                        },
                        {
                            value: 'pst',
                            name: 'From AppsCo to integration system'
                        }
                    ];
                }
            },

            _urlValidationPattern: {
                type: String,
                value: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)'
            },

            _preselectedIntegrationKind: {
                type: String,
                computed: '_computePreselectedIntegrationType(integration, _integrationKindList)'
            },

            _canForceSync: {
                type: Boolean,
                computed: '_computeCanForceSync(_preselectedIntegrationKind)'
            },

            _scheduleSyncInterval: {
                type: String,
                computed: '_computeScheduleSyncInterval(integration)'
            },

            _integrationScheduleSyncList: {
                type: Array,
                value: function () {
                    return [
                        {
                            value: 'daily',
                            name: 'Every day'
                        },
                        {
                            value: 'weekly',
                            name: 'Every Monday'
                        },
                        {
                            value: 'monthly',
                            name: 'Every 1st in the month'
                        }
                    ];
                }
            },

            _integrationForceSyncList: {
                type: Array,
                value: function () {
                    return [
                        {
                            value: null,
                            name: 'Never'
                        },
                        {
                            value: 'daily',
                            name: 'Every day'
                        },
                        {
                            value: 'weekly',
                            name: 'Every Monday'
                        },
                        {
                            value: 'monthly',
                            name: 'Every 1st in the month'
                        }
                    ];
                }
            },

            _isIntegrationActive: {
                type: String,
                computed: '_computeIsIntegrationActive(integration)'
            }
        };
    }

    _onSelectClosed(event) {
        event.stopPropagation();
    }

    getIntegrationKind() {
        return this.$.integrationKindSelect.selectedItem ?
            this.$.integrationKindSelect.selectedItem.value : null;
    }

    getIntegrationScheduleSync() {
        return this.$.integrationScheduleSyncSelect.selectedItem ?
            this.$.integrationScheduleSyncSelect.selectedItem.value : null;
    }

    getIntegrationForceSync() {
        if (!this.shadowRoot.getElementById('integrationForceSyncSelect')) {
            return null;
        }
        return this.shadowRoot.getElementById('integrationForceSyncSelect').selectedItem ?
            this.shadowRoot.getElementById('integrationForceSyncSelect').selectedItem.value : null;
    }

    setToggleChecked(checked) {
        this.$.toggleIntegrationActive.checked = checked;
    }

    _computeHasOwnUrl(integration) {
        if (integration.integration) {
            return integration.integration.alias === 4 || integration.integration.alias === 7 ||
                   integration.integration.alias === 8 || integration.integration.alias === 15 ;
        }

        if (integration) {
            return integration.alias === 4 || integration.alias === 7 ||
                   integration.alias === 8 || integration.alias === 15;
        }

        return false;
    }

    _computeRequireToken(integration) {
        if (integration.integration) {
            return integration.integration.alias === 8 || integration.integration.alias === 13;
        }

        if (integration) {
            return integration.alias === 8 || integration.alias === 13;
        }

        return false;
    }

    _computeRequiresClaims(integration) {
        if (integration && integration.integration) {
            return integration.integration.alias == 6;
        }

        if (integration) {
            return integration.alias == 6;
        }

        return false;
    }

    _computeRequiresITX(integration) {
        if (integration && integration.integration) {
            return integration.integration.alias == 15;
        }

        if (integration) {
            return integration.alias == 15;
        }

        return false;
    }

    _computeRequiresInstanceId(integration) {
        if (integration && integration.integration) {
            return [6, 10, 13].indexOf(integration.integration.alias) > -1;
        }

        if (integration) {
            return [6, 10, 13].indexOf(integration.alias) > -1;
        }

        return false;
    }

    _computeIsIntegrationActive(integration) {
        return integration && integration.active;
    }

    _computeDisableIntegrationTypeChange(formType) {
        return 'update' === formType;
    }

    _computePreselectedIntegrationType(integration, integrationKindList) {
        return (integration && integration.kind) ? integration.kind : integrationKindList[0].value;
    }

    _computeCanForceSync(computedKind) {
        return computedKind === 'ra';
    }

    _computeScheduleSyncInterval(integration) {
        return integration.hasOwnProperty('scheduleSyncInterval') && integration.scheduleSyncInterval !== '' ? integration.scheduleSyncInterval : 'daily';
    }

    getIntegrationActive() {
        return this.$.toggleIntegrationActive.checked ? '1' : '0';
    }
}
window.customElements.define(AppscoIntegrationForm.is, AppscoIntegrationForm);
