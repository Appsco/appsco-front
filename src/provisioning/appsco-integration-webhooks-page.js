import '@polymer/polymer/polymer-legacy.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../components/integration/appsco-integration-webhooks.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoIntegrationWebhooksPage extends mixinBehaviors([
    NeonSharedElementAnimatableBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                     border-bottom: 1px solid var(--divider-color);
                 };

                --item-background-color: var(--body-background-color);
                --webhook-icon-background-color: var(--body-background-color-darker);

                --appsco-list-progress-bar: {
                    display: none;
                };
            }
            :host paper-card {
                @apply --full-page-paper-card;

                --paper-card-header-text: {
                    padding-bottom: 16px;
                    padding-top: 16px;
                    padding-left: 16px;
                    padding-right: 16px;
                };
            }
            :host paper-button {
                @apply --primary-button;
                display: inline-block;
                min-width: 100px;
            }
            .page-close-action {
                @apply --page-close-action;
            }
            :host appsco-integration-rules {
                margin-top: 20px;
                display: block;
            }
            :host .pull-right {
                float: right;
                margin-right: 15px;
            }
        </style>

        <paper-card heading="Integration web hooks" id="card">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onClosePageAction">

            </paper-icon-button>

            <div class="card-content">
                <appsco-integration-webhooks id="appscoIntegrationWebhooks" integration="[[ integration ]]" list-api="[[ _integrationWebhooksApi ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" type="integration-webhook" size="1000" on-register-item="_onRegisterIntegrationWebhookAction" on-unregister-item="_onUnregisterIntegrationWebhookAction">
                </appsco-integration-webhooks>
            </div>

        </paper-card>
`;
    }

    static get is() { return 'appsco-integration-webhooks-page'; }

    static get properties() {
        return {
            integration: {
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

            _integrationWebhooksApi: {
                type: String,
                computed: '_computeIntegrationWebhooksApi(integration)'
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
                toPage: this,
                timing: {
                    duration: 300
                }
            }, {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 500
                }
            }],
            'exit': {
                name: 'slide-right-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };

        this.sharedElements = {
            'hero': this.$.card
        };
    }

    addIntegrationWatcher(watcher) {
        this.$.appscoIntegrationWebhooks.addIntegrationWatcher(watcher);
    }

    removeIntegrationWatcher(watcher) {
        this.$.appscoIntegrationWebhooks.removeIntegrationWatcher(watcher);
    }

    reloadWebhooksList() {
        this.$.appscoIntegrationWebhooks.reloadWebhooksList();
    }

    _computeIntegrationWebhooksApi(integration) {
        return integration.meta ? integration.meta.webHooks : null;
    }

    _onRegisterIntegrationWebhookAction(event) {
        this.dispatchEvent(new CustomEvent('register-integration-webhook', {
            bubbles: true,
            composed: true,
            detail: {
                integration: this.integration,
                webhook: event.detail.item
            }
        }));
    }

    _onUnregisterIntegrationWebhookAction(event) {
        this.dispatchEvent(new CustomEvent('unregister-integration-webhook', {
            bubbles: true,
            composed: true,
            detail: {
                integration: this.integration,
                webhook: event.detail.item
            }
        }));
    }

    _onClosePageAction() {
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }
}
window.customElements.define(AppscoIntegrationWebhooksPage.is, AppscoIntegrationWebhooksPage);
