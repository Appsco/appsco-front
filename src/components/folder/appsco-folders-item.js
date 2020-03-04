import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-ajax/iron-request.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import { AppscoDropHTMLElementBehavior } from '../components/appsco-drop-html-element-behavior.js';
import '../components/appsco-loader.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoFoldersItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior,
    AppscoDropHTMLElementBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                @apply --folder-item-host;
                --icon-action-border-radius: 16px;
            }
            :host .item, :host .folder-icon {
                transition: background 0.2s linear;
            }
            :host .item.dropover {
                background: var(--secondary-text-color);
            }
            :host .item-basic-info, :host .item-basic-info .info-label, :host .item-basic-info .info-value {
                width: 200px;
            }
            :host .item-basic-info {
                width: calc(100% - 32px - 5px);
                @apply --item-basic-info;
            }
            :host .item-basic-info .info-label, :host .item-basic-info .info-value {
                width: 100%;
            }
            :host .item-basic-info .info-label {
                @apply --item-info-label;
            }
            :host .item-basic-info .info-value {
                @apply --item-info-value;
            }
            :host .folder-icon {
                --iron-icon-height: 32px;
                --iron-icon-width: 32px;
                margin-right: 5px;
                @apply --layout-flex-none;
            }
            :host([tablet-screen]) {
                display: none;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="item" on-tap="_onItemAction" data-drop-to-zone="">
            <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

            <iron-icon icon="folder" class="folder-icon"></iron-icon>
            <div class="item-info item-basic-info">
                <span class="info-label item-title">[[ item.title ]] </span>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-folders-item'; }

    static get properties() {
        return {
            requestHeaders: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _loader: {
                type: Boolean,
                value: false
            }
        };
    }

    ready() {
        super.ready();

        afterNextRender(this, function() {
            this.initializeDropBehavior();
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('item-dropped', this._onItemDropped);
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _onItemDropped(event) {
        const item = event.detail.item;

        this._addResourceToFolder(item);
    }

    _getAddResourceToFolderApi(resource) {
        return (this.item.self && resource.alias) ? (this.item.self + '/resource/' + resource.alias) : null;
    }

    _addResourceToFolder(item) {
        const request = document.createElement('iron-request'),
            options = {
                url: this._getAddResourceToFolderApi(item),
                method: 'POST',
                handleAs: 'json',
                headers: this.requestHeaders
            };

        if (!options.url) {
            return false;
        }

        this._showLoader();

        request.send(options).then(function() {
            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('resource-moved-to-folder', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        resource: request.response,
                        folder: this.item,
                        sourceFolder: null
                    }
                }));

                this._hideLoader();
            }
        }.bind(this), function() {
            this.dispatchEvent(new CustomEvent('resource-moved-to-folder-failed', {
                bubbles: true,
                composed: true,
                detail: {
                    resource: request.response,
                    folder: this.item
                }
            }));

            this._hideLoader();
        }.bind(this));
    }
}
window.customElements.define(AppscoFoldersItem.is, AppscoFoldersItem);
