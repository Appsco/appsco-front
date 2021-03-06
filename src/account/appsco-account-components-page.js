import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../components/account/appsco-account-details.js';
import '../components/account/appsco-account-notifications.js';
import '../components/account/appsco-account-authorized-apps.js';
import '../components/account/appsco-account-log.js';
import '../components/page/appsco-layout-with-cards-styles.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountComponentsPage extends mixinBehaviors([
    NeonSharedElementAnimatableBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-layout-with-cards-styles">
            :host {
                --account-details-value: {
                     font-size: 14px;
                 };

                --iron-icon-height: 20px;
                --iron-icon-width: 20px;
                --iron-icon: {
                     margin-top: -3px;
                 };
            }
            appsco-account-details {
                --account-detail-container: {
                     margin: 4px 0;
                 };

                --account-details-label: {
                     font-size: 12px;
                     line-height: 16px;
                 };
                --account-details-value: {
                     font-size: 14px;
                     line-height: 22px;
                 };
            }
            .icon-enabled {
                --iron-icon-fill-color: var(--icon-success-color, #0f9d58);
            }
            .icon-disabled {
                --iron-icon-fill-color: var(--icon-danger-color, #db4437);
            }
            .info-2fa {
                  margin-top: 10px;
            }
            appsco-account-notifications {
                --appsco-account-notifications-container: {
                     padding-top: 4px;
                 };
                --appsco-account-notifications-paper-progress: {
                     top: 4px;
                 };
                --account-notifications-appsco-list-item: {
                     padding: 16px 6px 6px 6px;
                 };
                --account-notifications-appsco-list-item-first: {
                     border-top: none;
                 };
                --appsco-list-item-date: {
                     top: 2px;
                 };
            }
            appsco-account-authorized-apps {
                --account-authorized-apps-container: {
                     padding-top: 4px;
                 };
                --appsco-list-progress-bar: {
                     top: 4px;
                 };
                --paper-progress-container-color: var(--app-primary-color);
                --paper-progress-active-color: #ffffff;

                --account-authorized-app-first: {
                     border-top: none;
                 };
            }
            appsco-account-log {
                --appsco-account-log-container: {
                     padding-top: 4px;
                 };
                --appsco-list-progress-bar: {
                     top: 4px;
                 };
                --appsco-account-log-item: {
                     padding: 16px 6px 8px 6px;
                 };
                --appsco-account-log-item-first: {
                     border-top: none;
                 };
                --log-item-date: {
                     top: 2px;
                 };
            }
            .advanced-feature {
                opacity: 0;
                visibility: hidden;
                min-height: inherit;
                height: 0;
                overflow: hidden;
                transition: opacity 0.2s ease-out;

                --paper-card-header-text: {
                     padding-top: 8px;
                     padding-bottom: 8px;
                     padding-left: 16px;
                     padding-right: 16px;
                     font-size: 18px;
                     color: var(--success-color);
                     border-bottom: 1px solid var(--success-color);
                 };
            }
            :host .advanced-feature paper-button {
                color: var(--success-color);
            }
            :host([_advanced-settings]) .advanced-feature {
                opacity: 1;
                visibility: visible;
                height: auto;
                transition: opacity 0.3s ease-in;
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <iron-ajax auto="" id="twofaapi" url="[[ twoFaApi ]]" on-response="_on2FAResponse" headers="{{ _headers }}">
        </iron-ajax>

        <div class="cols-layout three-cols-layout">
            <div class="col">
                <paper-card heading="Settings" class="appsco-account-details">
                    <div class="card-content">
                        <appsco-account-details account="{{ account }}">
                        </appsco-account-details>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onAccountManageSettings">Manage</paper-button>
                    </div>
                </paper-card>

                <template is="dom-if" if="[[ !twoFaEnforced ]]">
                    <paper-card heading="Two Factor Authentication" class="appsco-account-2fa">
                        <div class="card-content">
                            <div class="status-2fa">

                                <template is="dom-if" if="[[ _twoFAEnabled ]]">
                                    <iron-icon icon="check" class="icon-enabled"></iron-icon> Enabled
                                </template>

                                <template is="dom-if" if="[[ !_twoFAEnabled ]]">
                                    <iron-icon icon="clear" class="icon-disabled"></iron-icon> Disabled
                                </template>
                            </div>

                            <div class="info-2fa">
                                Recovery codes can be used to access your account in the event you lose access to your device and cannot receive two-factor authentication codes.
                                Appsco Support cannot restore access to your accounts with two-factor authentication enabled for security reasons.
                                Saving your recovery codes in a safe place can keep you from being locked out of your account.
                            </div>
                        </div>

                        <div class="card-actions">
                            <template is="dom-if" if="[[ _twoFAEnabled ]]">
                                <paper-button on-tap="_on2FAManage">Manage</paper-button>
                            </template>

                            <template is="dom-if" if="[[ !_twoFAEnabled ]]">
                                <paper-button on-tap="_on2FAEnable">Enable</paper-button>
                            </template>
                        </div>
                    </paper-card>
                </template>
            </div>

            <div class="col">
                <paper-card heading="Notifications" class="appsco-account-notifications">
                    <div class="card-content">
                            <appsco-account-notifications id="appscoAccountNotifications" authorization-token="[[ authorizationToken ]]" notifications-api="[[ notificationsApi ]]" size="5">
                            </appsco-account-notifications>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onAccountNotifications">ALL</paper-button>
                    </div>
                </paper-card>

            <paper-card heading="Authorized applications" id="appscoAccountAuthorizedAppsCard" class="advanced-feature">
                <div class="card-content">
                    <appsco-account-authorized-apps id="appscoAccountAuthorizedApps" account="[[ account ]]" authorization-token="[[ authorizationToken ]]" authorized-apps-api="[[ authorizedAppsApi ]]" size="5" short-view="">
                    </appsco-account-authorized-apps>
                </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onManageAuthorizedApps">Manage</paper-button>
                    </div>
                </paper-card>
            </div>

            <div class="col">
                <paper-card heading="Activity log" class="appsco-account-log">
                    <div class="card-content">
                        <appsco-account-log id="appscoAccountLog" account="[[ account ]]" authorization-token="[[ authorizationToken ]]" log-api="[[ logApi ]]" size="5" short-view="">
                        </appsco-account-log>
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onAccountLog">ALL</paper-button>
                    </div>
                </paper-card>

                <paper-card heading="Import from LastPass" id="appscoImportFromLastPassCard" class="advanced-feature">
                    <div class="card-content">
                            Import records from LastPass to your Personal Dashboard
                    </div>

                    <div class="card-actions">
                        <paper-button on-tap="_onImportFromLastPassAction">Import</paper-button>
                    </div>
                </paper-card>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-account-components-page'; }

    static get properties() {
        return {
            account: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            notificationsApi: {
                type: String
            },

            authorizedAppsApi: {
                type: String
            },

            logApi: {
                type: String
            },

            twoFaEnforced: {
                type: Boolean,
                value: false
            },

            twoFaApi: {
                type: String
            },

            /**
             * Indicates if advanced settings should be available or not.
             */
            _advancedSettings: {
                type: Boolean,
                value: false,
                reflectToAttribute: true,
                observer: '_onAdvancedSettingsChange'
            },

            _twoFAEnabled: {
                type: Boolean,
                value: false
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

            animationConfig: {
                type: Object
            },

            sharedElements: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(tabletScreen, mediumScreen)'
        ];
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': [{
                name: 'cascaded-animation',
                animation: 'fade-in-animation',
                nodes: dom(this.root).querySelectorAll('paper-card'),
                nodeDelay: 50,
                timing: {
                    delay: 200,
                    duration: 100
                }
            }],
            'exit': [{
                name: 'hero-animation',
                id: 'hero',
                fromPage: this
            }, {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 500
                }
            }]
        };

        beforeNextRender(this, function() {
            if (this.tabletScreen || this.mediumScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._loadNotifications();
            this.loadLog();

            if (this._advancedSettings) {
                this.loadAuthorizedApps();
            }
        });
    }

    _updateScreen(tablet, medium) {
        this.updateStyles();
    }

    setSharedElement(target, callback) {
        if ('notifications' === target) {
            this.sharedElements = {
                'hero': this.$.appscoAccountNotifications
            };
        }
    }

    _setSharedElement(target) {

        while (target.tagName.toLowerCase() !== 'paper-card' && !target._templateInstance) {
            target = target.parentNode;
        }

        this.sharedElements = {
            'hero': target
        };
    }

    _loadNotifications() {
        this.$.appscoAccountNotifications.loadNotifications();
    }

    loadLog() {
        this.$.appscoAccountLog.loadLog();
    }

    load2FaApi() {
        this.$.twofaapi.generateRequest();
    }

    loadAuthorizedApps() {
        this.shadowRoot.getElementById('appscoAccountAuthorizedApps').loadAuthorizedApps();
    }

    toggleAdvancedSettings() {
        this.set('_advancedSettings', !this._advancedSettings);
    }

    showAdvancedSettings() {
        this.set('_advancedSettings', true);
    }

    hideAdvancedSettings() {
        this.set('_advancedSettings', false);
    }

    _onAdvancedSettingsChange() {
        if (this._advancedSettings) {
            this.loadAuthorizedApps();
        }
    }

    _on2FAResponse(event) {
        this._twoFAEnabled = event.detail.response.enabled;
    }

    _onAccountManageSettings(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('account-settings', { bubbles: true, composed: true }));
    }

    _onAllLog(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('all-log', { bubbles: true, composed: true }));
    }

    _on2FAEnable(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('2fa-enable', { bubbles: true, composed: true }));
    }

    _on2FAManage(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('2fa-manage', { bubbles: true, composed: true }));
    }

    _onAccountNotifications(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('all-notifications', { bubbles: true, composed: true }));
    }

    _onManageAuthorizedApps(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('manage-authorized-apps', { bubbles: true, composed: true }));
    }

    _onAccountLog(event) {
        this._setSharedElement(event.target);
        this.dispatchEvent(new CustomEvent('whole-log', { bubbles: true, composed: true }));
    }

    _onImportFromLastPassAction() {
        this.dispatchEvent(new CustomEvent('import-personal-resources', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoAccountComponentsPage.is, AppscoAccountComponentsPage);
