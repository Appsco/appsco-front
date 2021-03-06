import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/iron-icons/notification-icons.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import '@polymer/iron-ajax/iron-request.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import '../components/appsco-loader.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoIntegrationTemplateItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior,
    AppLocalizeBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                position: relative;
            }
            :host([_errored]) .item {
                background-color: rgba(219, 68, 55, 0.3);
            }
            :host .item {
                cursor: default;
                padding: 10px;
            }
            :host .icon-container {
                width: 24px;
                height: 24px;
                margin: 0;
                position: relative;
                @apply --layout-flex-none;
            }
            :host .template-icon {
                width: 24px;
                height: 24px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;

                --iron-icon-fill-color: var(--primary-text-color, #ffffff);
            }
            :host .item-info {
                padding: 0 10px;
            }
            :host appsco-loader {
                background-color: rgba(255, 255, 255, 0.3);
            }
        </style>

        <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

        <div class="item" on-tap="_onItemAction">

            <template is="dom-if" if="[[ selectable ]]">
                <div class="select-action" on-tap="_onSelectItemAction">

                    <div class="icon-container">
                        <iron-icon class="template-icon" icon="[[ _itemIcon ]]"></iron-icon>
                    </div>

                    <div class="icon-action">
                        <div class="iron-action-inner">
                            <iron-icon icon="icons:check"></iron-icon>
                        </div>
                    </div>
                </div>
            </template>

            <template is="dom-if" if="[[ !selectable ]]">
                <div class="icon-container">
                    <iron-icon class="template-icon" icon="[[ _itemIcon ]]"></iron-icon>
                </div>
            </template>

            <div class="item-info item-basic-info">
                <span class="info-label item-title">
                    {{ localize(_templateTitle) }}
                </span>
                <span class="info-value">
                    {{ localize(_templateDescription, 'integration', integration.integration.title) }}
                </span>
            </div>

            <div class="actions">
                <paper-button on-tap="_onAddItemAction">Add</paper-button>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-integration-template-item'; }

    static get properties() {
        return {
            integration: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            language: {
                type: String,
                value: 'en'
            },

            _itemIcon: {
                type: String,
                computed: '_computeItemIcon(item)'
            },

            _templateTitle: {
                type: String,
                computed: '_computeTemplateTitle(item, integration)'
            },

            _templateDescription: {
                type: String,
                computed: '_computeTemplateDescription(item, integration)'
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errored: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen)'
        ];
    }

    static get importMeta() {
        return import.meta;
    }

    ready() {
        super.ready();

        beforeNextRender(this, function() {
            this.loadResources(this.resolveUrl('./data/integration-template-descriptions.json'));
        });
    }

    _computeItemIcon(item) {
        let icon = '',
            groupSync = (-1 < item.source_pso.split('\\').pop().toLowerCase().indexOf('group'));

        switch (item.source_event) {
            case 'from_lookup':
                icon = 'notification:sync';
                break;

            case 'from_added':
                icon = groupSync ?
                    'social:group-add' :
                    'social:person-add';
                break;

            case 'from_modified':
                icon = 'editor:mode-edit';
                break;

            case 'from_deleted':
                icon = groupSync ?
                    'social:social:people-outline' :
                    'social:person-outline';
                break;

            default:
                icon = 'icons:compare-arrows';
        }

        return icon;
    }

    _computeTemplateTitle(item, integration) {
        return (integration && integration.integration) ?
            (((-1 !== integration.integration.title.toLowerCase().indexOf('azure')) ?
                'azure' :
                integration.integration.title.toLowerCase().replace(' ', '_')) + '_' +
                integration.kind + '_' +
                item.source_event + '_' +
                (('ra' === integration.kind) ?
                    item.target_pso.split('\\').pop() :
                    item.source_pso.split('\\').pop()) + '_title') :
            '';
    }

    _computeTemplateDescription(item, integration) {
        return (integration && integration.integration) ?
            (((-1 !== integration.integration.title.toLowerCase().indexOf('azure')) ?
                'azure' :
                integration.integration.title.toLowerCase().replace(' ', '_')) + '_' +
                integration.kind + '_' +
                item.source_event + '_' +
                (('ra' === integration.kind) ?
                    item.target_pso.split('\\').pop() :
                    item.source_pso.split('\\').pop()) + '_description') :
            '';
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _showError() {
        this._errored = true;
    }

    _hideError() {
        this._errored = false;
    }

    _createIntegrationRecipe(template) {
        return new Promise(function(resolve, reject) {
            const request = document.createElement('iron-request'),
                options = {
                    url: template.meta.create_recipe,
                    method: 'POST',
                    handleAs: 'json',
                    headers: this._headers,
                    body: 'integration_recipe[name]=' + encodeURIComponent(
                        this.localize(this._templateTitle) ?
                            this.localize(this._templateTitle) :
                            (this.integration.name + ' rule')) +
                        '&integration_recipe[fromMethod]=' + encodeURIComponent(template.source_event) +
                        '&integration_recipe[fromPSO]=' + encodeURIComponent(template.source_pso) +
                        '&integration_recipe[toMethod]=' + encodeURIComponent(template.target_action) +
                        '&integration_recipe[toPSO]=' + encodeURIComponent(template.target_pso)
                };

            request.send(options).then(function() {
                if (200 === request.status) {
                    resolve(request.response);
                }

            }.bind(this), function() {
                reject();
            }.bind(this));
        }.bind(this));
    }

    _registerIntegrationWatcher(template) {
        return new Promise(function(resolve, reject) {
            const request = document.createElement('iron-request'),
                options = {
                    url: template.meta.activate_watcher,
                    method: 'POST',
                    handleAs: 'json',
                    headers: this._headers,
                    body: 'webhook=' + encodeURIComponent(template.meta.web_hook_self)
                };

            request.send(options).then(function() {
                if (200 === request.status) {
                    resolve(request.response);
                }
            }.bind(this), function() {
                reject();
            }.bind(this));
        }.bind(this));
    }

    _onAddItemAction(event) {
        const item = this.item;

        event.stopPropagation();

        if (!item.is_existing && item.meta && item.meta.create_recipe) {
            this._showLoader();

            this._createIntegrationRecipe(item).then(function(response) {
                this.item.is_existing = true;
                this.dispatchEvent(new CustomEvent('integration-rule-added', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        integration: this.integration,
                        rule: response
                    }
                }));

                if (item.is_webhook_required && item.meta &&
                    item.meta.web_hook_self && item.meta.activate_watcher) {
                    this._registerIntegrationWatcher(item).then(function(response) {
                        this.dispatchEvent(new CustomEvent('integration-webhook-registered', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                integration: this.integration,
                                watcher: response
                            }
                        }));

                        this._hideItem();
                        this._hideError();
                        this._hideLoader();
                    }.bind(this), function() {
                        this._showError();
                        this._hideLoader();
                    }.bind(this));
                }
                else {
                    this._hideItem();
                    this._hideError();
                    this._hideLoader();
                }
            }.bind(this), function() {
                this._showError();
                this._hideLoader();
            }.bind(this));
        }
        else if (item.is_existing && !item.is_webhook_enabled &&
            item.is_webhook_required && item.meta &&
            item.meta.web_hook_self && item.meta.activate_watcher) {
            this._showLoader();
            this._registerIntegrationWatcher(item).then(function(response) {
                this.dispatchEvent(new CustomEvent('integration-webhook-registered', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        integration: this.integration,
                        watcher: response
                    }
                }));

                this._hideItem();
                this._hideError();
                this._hideLoader();
            }.bind(this), function() {
                this._showError();
                this._hideLoader();
            }.bind(this));
        }
    }
}
window.customElements.define(AppscoIntegrationTemplateItem.is, AppscoIntegrationTemplateItem);
