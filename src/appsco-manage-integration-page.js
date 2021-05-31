import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './components/page/appsco-content.js';
import './components/page/appsco-manage-page-styles.js';
import './components/account/appsco-account-image.js';
import './provisioning/appsco-manage-integration-components-page.js';
import './provisioning/appsco-integration-settings-page.js';
import './provisioning/appsco-integration-rules-page.js';
import './provisioning/appsco-integration-webhooks-page.js';
import './components/integration/appsco-integration-templates.js';
import './provisioning/appsco-manage-integration-page-actions.js';
import './components/integration/appsco-remove-integration.js';
import './components/integration/appsco-register-integration-webhook.js';
import './components/integration/appsco-unregister-integration-webhook.js';
import './components/integration/appsco-add-integration-rule.js';
import './components/integration/appsco-edit-integration-rule.js';
import './components/integration/appsco-run-integration-rule.js';
import './components/integration/appsco-remove-integration-rule.js';
import './lib/mixins/appsco-headers-mixin.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoManageIntegrationPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-manage-page-styles">
            :host {
                --paper-dropdown-menu-icon: {
                    color: var(--primary-text-color);
                    width: 22px;
                    height: 22px;
                };
            }
            :host div[resource] {
                height: calc(100% - 32px - 20px);
            }
            :host div[resource] > .resource-content {
                padding-top: 30px;
            }
            .integration-image {
                width: 96px;
                height: 96px;
                margin-left: auto;
                margin-right: auto;
                border-radius: 50%;
                position: relative;
                background-color: var(--body-background-color-darker);
            }
            .integration-image iron-image {
                width: 48px;
                height: 48px;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
            }
            :host div.help-title {
                padding-top: 4px;
                font-size: 18px;
                color: var(--primary-text-color);
                margin-top: 10px;
            }
            :host .info {
                @apply --info-message;
            }
            :host .kind-info {
                font-size: 12px;
            }
            :host div.tutorial.info a,
            :host div.tutorial.info a:hover {
                color: var(--primary-text-color);
                text-decoration: none;
                font-size: 14px;
            }
            :host div.config-file.info,
            :host div.config-file.info {
                color: var(--primary-text-color);
                text-decoration: none;
                font-size: 14px;
                cursor: pointer;
            }
            :host div.service-application.info a,
            :host div.service-application.info a:hover {
                color: var(--primary-text-color);
                text-decoration: none;
                font-size: 14px;
            }
            appsco-account-image {
                position: absolute;
                bottom: -22px;
                left: 10px;
                box-sizing: border-box;

                --account-image: {
                    width: 42px;
                    height: 42px;
                    border: 4px solid var(--body-background-color);
                };
            }
            :host .info-content {
                height: calc(100% - 50px - 10px);
                margin-top: 0;
            }
            appsco-integration-templates {
                margin-top: 20px;

                --appsco-list-item: {
                    @apply --shadow-none;
                    height: auto;
                    padding-top: 10px;
                    padding-bottom: 26px;
                    background-color: transparent;
                    border-top: 1px solid var(--divider-color);
                };
                --appsco-list-item-activated: {
                    @apply --shadow-none;
                };
                --item-actions: {
                    right: 0;
                    bottom: 3px;
                };
                --item-info-label: {
                    font-size: 14px;
                    white-space: unset !important;
                };
                --item-info-value: {
                    white-space: unset !important;
                };
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <iron-ajax id="ironAjaxGetIntegration" on-error="_onIntegrationError" on-response="_onIntegrationResponse" headers="[[ _headers ]]">
        </iron-ajax>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">

                <div class="resource-header">
                    <div class="integration-image">
                        <iron-image src\$="[[ integration.integration.image ]]" alt="Integration image" class="sized" sizing="contain" preload="" fade="">
                        </iron-image>
                    </div>

                    <template is="dom-if" if="[[ integration.authorized_by ]]">
                        <appsco-account-image account="[[ integration.authorized_by ]]"></appsco-account-image>
                    </template>
                </div>

                <div class="resource-content">
                    <p>[[ integration.name ]]</p>

                    <template is="dom-if" if="[[ _isIntegrationRA ]]">
                        <div class="kind-info">
                            <strong>[[ integration.integration.title ]]</strong> is integrated with <strong>AppsCo</strong> in such a way that data is moved
                            from <strong>[[ integration.integration.title ]]</strong> to <strong>AppsCo</strong> either through sync or through the use of events.
                        </div>
                    </template>

                    <template is="dom-if" if="[[ _isIntegrationPST ]]">
                        <div class="kind-info">
                            <strong>AppsCo</strong> is integrated with <strong>[[ integration.integration.title ]]</strong> in such a way that data is moved from
                            <strong>AppsCo</strong> to <strong>[[ integration.integration.title ]]</strong>.
                        </div>
                    </template>

                    <template is="dom-if" if="[[ integration.authorized_by ]]">
                        <div class="info">
                            Authorized by: [[ integration.authorized_by.display_name ]] ([[ integration.authorized_by.email ]])
                        </div>

                        <div class="info">
                            Authorized on: [[ _authorizedDate ]].
                        </div>
                    </template>

                    <template is="dom-if" if="[[ integration.tutorialUrl.length ]]">
                        <div class="info tutorial">
                            <div class="help-title">Need help?</div>
                                <a href="[[ integration.tutorialUrl ]]" target="_blank" rel="noopener noreferrer">
                                    If you need help please visit our knowledgebase.
                                </a>
                        </div>
                    </template>

                    <template is="dom-if" if="[[ _hasDownloadableConfig ]]">
                        <div class="help-title">AppsCo reader service</div>
                        <div class="info config-file" on-tap="_downloadConfig">
                            Download preconfigured configuration file.
                        </div>
                        <template is="dom-if" if="[[ integration.meta.download_tool ]]">
                            <div class="info service-application">
                                <a href="[[ integration.meta.download_tool ]]" target="_blank">
                                    Download service application.
                                </a>
                            </div>
                        </template>
                    </template>

                    <template is="dom-if" if="[[ integration.secret ]]">
                        <div class="info secret">
                            Copy integration secret key to clipboard <appsco-copy value="[[ integration.secret ]]"></appsco-copy>
                        </div>
                    </template>

                </div>

                <div class="resource-actions flex-horizontal">
                    <paper-button class="button secondary-button flex" on-tap="_onReauthorizeIntegration">
                        Reauthorize
                    </paper-button>

                    <paper-button class="button danger-button flex" on-tap="_onRemoveIntegration">
                        Remove
                    </paper-button>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <neon-animated-pages class="flex" selected="{{ _selected }}" attr-for-selected="name">

                        <appsco-manage-integration-components-page id="appscoManageIntegrationComponentsPage" name="appsco-manage-integration-components-page" integration="[[ integration ]]" authorization-token="[[ authorizationToken ]]" webhook-api="[[ _webhookApi ]]" on-manage-integration-settings="_onManageIntegrationSettings" on-manage-integration-rules="_onManageIntegrationRules" on-manage-integration-webhooks="_onManageIntegrationWebhooks">
                        </appsco-manage-integration-components-page>

                        <appsco-integration-settings-page name="appsco-integration-settings-page" integration="[[ integration ]]" integration-api="[[ integrationApi ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-back="_onResourceBack" on-integration-settings-changed="_onIntegrationSettingsChanged">
                        </appsco-integration-settings-page>

                        <appsco-integration-rules-page id="appscoIntegrationRulesPage" name="appsco-integration-rules-page" integration="[[ integration ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-add-integration-rule="_onAddIntegrationRuleAction" on-edit-integration-rule="_onEditIntegrationRuleAction" on-run-integration-rule="_onRunIntegrationRuleAction" on-remove-integration-rule="_onRemoveIntegrationRuleAction" on-back="_onResourceBack">
                        </appsco-integration-rules-page>

                        <appsco-integration-webhooks-page id="appscoIntegrationWebhooksPage" name="appsco-integration-webhooks-page" integration="[[ integration ]]" authorization-token="[[ authorizationToken ]]" on-register-integration-webhook="_onRegisterIntegrationWebhook" on-unregister-integration-webhook="_onUnregisterIntegrationWebhook" api-errors="[[ apiErrors ]]" on-back="_onResourceBack">
                        </appsco-integration-webhooks-page>

                    </neon-animated-pages>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">
                <div class="info-header flex-horizontal">
                    <span class="info-title">Integration templates</span>
                </div>

                <div class="info-content flex-vertical">
                    <p class="info">Add one of the predefined integration templates to complete the quick setup.</p>

                    <appsco-integration-templates id="appscoIntegrationTemplates" integration="[[ integration ]]" list-api="[[ _integrationTemplatesApi ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" type="integration-template" size="1000" on-integration-rule-added="_onIntegrationRuleAdded" on-list-loaded="_evaluateInfoSectionActive" on-list-empty="_evaluateInfoSectionActive">
                    </appsco-integration-templates>
                </div>
            </div>
        </appsco-content>

        <appsco-remove-integration
            id="appscoRemoveIntegration"
            authorization-token="[[ authorizationToken ]]"
            api-errors="[[ apiErrors ]]">
        </appsco-remove-integration>

        <appsco-register-integration-webhook
            id="appscoRegisterIntegrationWebhook"
            authorization-token="[[ authorizationToken ]]"
            api-errors="[[ apiErrors ]]"
            on-integration-webhook-registered="_onIntegrationWebhookRegistered">
        </appsco-register-integration-webhook>

        <appsco-unregister-integration-webhook
            id="appscoUnegisterIntegrationWebhook"
            authorization-token="[[ authorizationToken ]]"
            api-errors="[[ apiErrors ]]"
            on-integration-webhook-unregistered="_onIntegrationWebhookUnregistered">
        </appsco-unregister-integration-webhook>

        <appsco-add-integration-rule
            id="appscoAddIntegrationRule"
            authorization-token="[[ authorizationToken ]]"            
            api-errors="[[ apiErrors ]]"
            on-integration-rule-added="_onIntegrationRuleAdded">
        </appsco-add-integration-rule>

        <appsco-edit-integration-rule
            id="appscoEditIntegrationRule"
            authorization-token="[[ authorizationToken ]]"
            api-errors="[[ apiErrors ]]"
            on-integration-rule-edited="_onIntegrationRuleEdited">
        </appsco-edit-integration-rule>

        <appsco-run-integration-rule
            id="appscoRunIntegrationRule"
            authorization-token="[[ authorizationToken ]]"
            api-errors="[[ apiErrors ]]"
            on-integration-rule-run="_onIntegrationRuleRun">
        </appsco-run-integration-rule>

        <appsco-remove-integration-rule
            id="appscoRemoveIntegrationRule"
            authorization-token="[[ authorizationToken ]]"
            api-errors="[[ apiErrors ]]"
            on-integration-rule-removed="_onIntegrationRuleRemoved">
        </appsco-remove-integration-rule>
`;
    }

    static get is() { return 'appsco-manage-integration-page'; }

    static get properties() {
        return {
            route: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            integration: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _selected: {
                type: String,
                value: 'appsco-manage-integration-components-page',
                notify: true
            },

            integrationApi: {
                type: String,
                observer: '_onIntegrationApiChanged'
            },

            _webhookApi: {
                type: String,
                computed: '_computeWebhookApi(integration)'
            },

            _integrationTemplatesApi: {
                type: String,
                computed: '_computeIntegrationTemplatesApi(integration)'
            },

            _isIntegrationRA: {
                type: Boolean,
                computed: '_computeIsIntegrationRA(integration)'
            },

            _isIntegrationPST: {
                type: Boolean,
                computed: '_computeIsIntegrationPST(integration)'
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _hasDownloadableConfig: {
                type: Boolean,
                computed: '_computeHasDownloadableConfig(integration)'
            },

            _authorizedDate: {
                type: String,
                computed: '_computeAuthorizedDate(integration)'
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

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
            },

            _infoSectionActive: {
                type: Boolean,
                observer: '_infoActiveChanged'
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
            this._getIntegration();
        });
    }

    _computeAuthorizedDate(integration) {
        return (integration && integration.authorized_at) ? this._dateFormat(integration.authorized_at.date) : '';
    }

    /**
     * Formats date and returns formatted date as string.
     *
     * @param {String} value
     * @returns {string}
     * @private
     */
    _dateFormat(value) {
        if (value) {
            const options = {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric'
            };

            return (new Date(value)).toLocaleDateString('en', options);
        }
    }

    setIntegration(integration) {
        this.set('integration', integration);
    }

    addIntegrationRule(rule) {
        this.$.appscoIntegrationRulesPage.addIntegrationRule(rule);
    }

    modifyIntegrationRule(rule) {
        this.$.appscoIntegrationRulesPage.modifyIntegrationRule(rule);
    }

    removeIntegrationRule(rule) {
        this.$.appscoIntegrationRulesPage.removeIntegrationRule(rule);
    }

    addIntegrationWatcher(watcher) {
        this.$.appscoIntegrationWebhooksPage.addIntegrationWatcher(watcher);
    }

    removeIntegrationWatcher(watcher) {
        this.$.appscoIntegrationWebhooksPage.removeIntegrationWatcher(watcher);
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    resetPage() {
        this._showComponentsPage();
    }

    _hideInfoSection() {
        this._infoSectionActive = false;
    }

    _evaluateInfoSectionActive() {
        const appscoIntegrationTemplatesComponent = this.shadowRoot.getElementById('appscoIntegrationTemplates');

        this._infoSectionActive = (appscoIntegrationTemplatesComponent &&
            (0 < appscoIntegrationTemplatesComponent.getCurrentCount()) &&
            appscoIntegrationTemplatesComponent.getAvailableTemplatesExist());
    }

    _showIntegrationSettingsPage() {
        this._hideInfoSection();
        this._selected = 'appsco-integration-settings-page';
    }

    _showIntegrationRulesPage() {
        this._hideInfoSection();
        this._selected = 'appsco-integration-rules-page';
    }

    _showIntegrationWebhooksPage() {
        this._hideInfoSection();
        this._selected = 'appsco-integration-webhooks-page';
    }

    _showComponentsPage() {
        this._selected = 'appsco-manage-integration-components-page';
        this._evaluateInfoSectionActive();
    }

    _updateScreen(medium, tablet, mobile) {
        this.updateStyles();

        if (mobile) {
            this.$.appscoContent.hideSection('resource');
        }
        else if(!this.$.appscoContent.resourceActive) {
            this.$.appscoContent.showSection('resource');
        }
    }

    _getIntegration() {
        if (!this.integration.self && this.integrationApi && this._headers) {
            if (!this.route.path) {
                this.dispatchEvent(new CustomEvent('page-error', { bubbles: true, composed: true }));
            }
            this.$.ironAjaxGetIntegration.url = this.integrationApi + '/active' + this.route.path;
            this.$.ironAjaxGetIntegration.generateRequest();
        }
    }


    _infoActiveChanged(infoActive) {
        if (undefined === infoActive) {
            return;
        }

        if (infoActive) {
            this.shadowRoot.getElementById('appscoContent').showSection('info');
            return;
        }

        this.shadowRoot.getElementById('appscoContent').hideSection('info');
    }

    _onIntegrationApiChanged() {
        this._getIntegration();
    }

    _onIntegrationResponse(event) {
        if (200 === event.detail.status && event.detail.response && event.detail.response.integration_active) {
            this.set('integration', event.detail.response.integration_active);
        }
        this._onPageLoaded();
    }

    _onIntegrationError(event) {
        if (!event.detail.request.aborted) {
            this.dispatchEvent(new CustomEvent('page-error', { bubbles: true, composed: true }));
        }
    }

    _onIntegrationSettingsChanged(event) {
        this.set('integration', {});
        this.set('integration', event.detail.integration);
        this._showComponentsPage();
        this._hideProgressBar();
    }

    _computeWebhookApi(integration) {
        return integration && integration.meta && integration.meta.webHooks ? integration.meta.webHooks : null;
    }

    _computeIntegrationTemplatesApi(integration) {
        return (integration && integration.meta && integration.meta.templates) ? integration.meta.templates : null;
    }

    _computeIsIntegrationRA(integration) {
        return integration && integration.integration && integration.kind === 'ra';
    }

    _computeIsIntegrationPST(integration) {
        return integration && integration.integration && integration.kind === 'pst';
    }

    _onResourceBack() {
        this._showComponentsPage();
    }

    _onRemoveIntegration(event) {
        const dialog = this.shadowRoot.getElementById('appscoRemoveIntegration');
        dialog.setIntegration(this.integration);
        dialog.open();
    }

    _onReauthorizeIntegration() {
        const request = document.createElement('iron-request'),
            options = {
                url: this.integration.integration.self + '?reauthorize_integration=' + this.integration.alias,
                method: 'POST',
                body: {
                    "activate_integration[name]": this.integration.name,
                    "activate_integration[kind]": this.integration.kind,
                    "activate_integration[scheduleSyncInterval]": this.integration.scheduleSyncInterval
                },
                handleAs: 'text',
                headers: this._headers
            };

        request.send(options).then(function() {
            if (200 === request.status) {
                const response = JSON.parse(request.response);
                if (response.authorization_url) {
                    window.location.href = response.authorization_url;
                }
            }
        }.bind(this), function() {
            this.dispatchEvent(new CustomEvent('page-error', { bubbles: true, composed: true }));
        }.bind(this));
    }

    _onManageIntegrationSettings() {
        this._showIntegrationSettingsPage();
    }

    _onManageIntegrationRules() {
        this._showIntegrationRulesPage();
    }

    _onManageIntegrationWebhooks() {
        this._showIntegrationWebhooksPage();
    }

    _computeHasDownloadableConfig(integration) {
        return integration
            && integration.integration
            && (integration.integration.alias === 3 || integration.integration.alias === 11) ;
    }

    _downloadConfig() {
        const request = document.createElement('iron-request'),
            options = {
                url: this.integration.meta.config,
                method: 'GET',
                handleAs: 'text',
                headers: this._headers
            };

        request.send(options).then(function() {
            window.location = 'data:application/octet-stream;charset=utf-16le;base64,' + request.response;
        }.bind(this));
    }

    _onIntegrationRequested(event) {
        if (event.detail.authorizationUrl) {
            window.location.href = event.detail.authorizationUrl;
        }
    }

    _onRegisterIntegrationWebhook(event) {
        const dialog = this.shadowRoot.getElementById('appscoRegisterIntegrationWebhook');

        dialog.setIntegration(event.detail.integration);
        dialog.setIntegrationWebhook(event.detail.webhook);
        dialog.open();
    }

    _onIntegrationWebhookRegistered(event) {
        this.addIntegrationWatcher(event.detail.watcher);
        this._notify('Web hook for ' + event.detail.integration.name + ' has been registered.');
    }

    _onUnregisterIntegrationWebhook(event) {
        const dialog = this.shadowRoot.getElementById('appscoUnegisterIntegrationWebhook');

        dialog.setIntegration(event.detail.integration);
        dialog.setIntegrationWebhook(event.detail.webhook);
        dialog.open();
    }

    _onIntegrationWebhookUnregistered(event) {
        this.removeIntegrationWatcher(event.detail.watcher);
        this._notify('Web hook for ' + event.detail.integration.name + ' has been unregistered.');
    }

    _onAddIntegrationRuleAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoAddIntegrationRule');
        dialog.setIntegration(event.detail.integration);
        dialog.open();
    }

    _onIntegrationRuleAdded(event) {
        this.addIntegrationRule(event.detail.rule);
        this._notify('Rule for ' + event.detail.integration.name + ' has been successfully added.');
    }

    _onEditIntegrationRuleAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoEditIntegrationRule');
        dialog.setIntegration(event.detail.integration);
        dialog.setIntegrationRule(event.detail.rule);
        dialog.open();
    }

    _onIntegrationRuleEdited(event) {
        this.modifyIntegrationRule(event.detail.rule);
        this._notify('Rule for ' + event.detail.integration.name + ' has been successfully modified.');
    }
    _onRunIntegrationRuleAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoRunIntegrationRule');
        dialog.setIntegration(event.detail.integration);
        dialog.setIntegrationRule(event.detail.rule);
        dialog.open();
    }

    _onIntegrationRuleRun(event) {
        this._notify('Rule for ' + event.detail.integration.name + ' has been applied.');
    }

    _onRemoveIntegrationRuleAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoRemoveIntegrationRule');
        dialog.setIntegration(event.detail.integration);
        dialog.setIntegrationRule(event.detail.rule);
        dialog.open();
    }

    _onIntegrationRuleRemoved(event) {
        this.removeIntegrationRule(event.detail.rule);
        this._notify('Rule for ' + event.detail.integration.name + ' has been removed.');
    }
}
window.customElements.define(AppscoManageIntegrationPage.is, AppscoManageIntegrationPage);
