import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/iron-collapse/iron-collapse.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender, beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoContent extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <custom-style>
            <style include="webkit-scrollbar-style">
                :host {
                    display: block;
                    position: relative;
                    height: 100%;
                    width: 100%;
                    overflow: hidden;
                }
                :host .flex-horizontal {
                @apply --layout-horizontal;
                    height: 100%;
                }
                :host .resource,
                :host .content,
                :host .info
                {
                    height: 100%;
                    overflow: hidden;
                    position: relative;
                    box-sizing: border-box;
                @apply --appsco-content-sections;
                }
                :host .resource {
                    width: var(--resource-width, 25%);
                    background-color: var(--resource-background-color, transparent);
                    color: var(--resource-color, #000);
                    border-right: 1px solid var(--divider-color);
                    display: none;
                }
                :host .content {
                    @apply --layout-flex;
                    background-color: var(--content-background-color, transparent);
                    color: var(--content-color, #000);
                    overflow-x: hidden;
                    overflow-y: auto;
                }
                :host .info {
                    width: var(--info-width, 25%);
                    background-color: var(--info-background-color, transparent);
                    color: var(--info-color, #000);

                    border-left: 1px solid var(--divider-color);
                    display: none;
                }
                :host([resource-active]) .resource, :host([info-active]) .info {
                    display: block;
                }
            </style>
        </custom-style>

        <div class="container flex-horizontal">
            <div id="resource" class="resource"><slot name="resource"></slot></div>
            <div id="content" class="content">
                <iron-collapse id="contentTop" content-top="">
                    <slot name="content-top" old-content-selector="[content-top]"></slot>
                </iron-collapse>

                <slot name="content"></slot>
            </div>
            <div id="info" class="info"><slot name="info"></slot></div>
        </div>
`;
    }

    static get is() { return 'appsco-content'; }

    static get properties() {
        return {
            /**
             * Indicates if resource section is shown or not.
             */
            resourceActive: {
                type: Boolean,
                value: false,
                observer: '_onResourceActiveChanged'
            },

            /**
             * Indicates if info section is shown or not.
             */
            infoActive: {
                type: Boolean,
                value: false,
                observer: '_onInfoActiveChanged'
            },

            /**
             * Indicates if content-top section is shown or not.
             */
            contentTopActive: {
                type: Boolean,
                value: false,
                observer: '_onContentTopActiveChanged'
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        afterNextRender(this, function () {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('neon-animation-finish', this._onAnimationFinish);
    }

    _onResourceActiveChanged(active) {
        beforeNextRender(this, function () {
            this.animationConfig = {
                'entry': {
                    name: 'slide-from-left-animation',
                    node: this.$.resource,
                    timing: {
                        duration: 200
                    }
                },
                'exit': {
                    name: 'slide-left-animation',
                    node: this.$.resource,
                    timing: {
                        duration: 100
                    }
                }
            };
        });

        active ? this.showSection('resource') : this.hideSection('resource');
    }

    _onInfoActiveChanged(active) {
        beforeNextRender(this, function () {
            this.animationConfig = {
                'entry': {
                    name: 'slide-from-right-animation',
                    node: this.shadowRoot.getElementById('info'),
                    timing: {
                        duration: 200
                    }
                },
                'exit': {
                    name: 'slide-right-animation',
                    node: this.shadowRoot.getElementById('info'),
                    timing: {
                        duration: 100
                    }
                }
            };
        });
        setTimeout(function() {
            active ? this.showSection('info') : this.hideSection('info');
        }.bind(this));
    }

    _onContentTopActiveChanged(active) {
        active ? this.showSection('content-top') : this.hideSection('content-top');
    }

    /**
     * Shows section - info or resource.
     *
     * @param section
     */
    showSection(section) {
        if (section === 'content-top' && this.contentTopActive) {
            afterNextRender(this, () => this.shadowRoot.getElementById('contentTop').show());
            return false;
        }

        if (section === 'info' && !this.infoActive) {
            this.infoActive = true;
        }
        else if (section === 'resource' && !this.resourceActive) {
            this.resourceActive = true;
        }

        this.shadowRoot.getElementById(section).style.display = 'inline-block';
        this.playAnimation('entry');
    }

    /**
     * Hides section - info or resource.
     *
     * @param section
     */
    hideSection(section) {
        if (section === 'content-top' && !this.contentTopActive) {
            afterNextRender(this, () => this.shadowRoot.getElementById('contentTop').hide());
            return false;
        }

        if (section === 'info' && this.infoActive) {
            this.infoActive = false;
        }
        else if (section === 'resource' && this.resourceActive) {
            this.resourceActive = false;
        }
        afterNextRender(this, () => this.playAnimation('exit'));
    }

    /**
     * Toggles section - info or resource.
     *
     * @param section
     */
    toggleSection(section) {
        if (section === 'info') {
            this.infoActive = !this.infoActive;
        }
        else if (section === 'resource') {
            this.resourceActive = !this.resourceActive;
        }
        else if (section === 'content-top') {
            this.contentTopActive = !this.contentTopActive;
        }
    }

    _onAnimationFinish() {
        if (!this.infoActive) {
            this.$.info.style.display = 'none';
        }

        if (!this.resourceActive) {
            this.$.resource.style.display = 'none';
        }
    }
}
window.customElements.define(AppscoContent.is, AppscoContent);
