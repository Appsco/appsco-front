import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../page/appsco-page-global.js';
import './appsco-contacts-actions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoContactsPageActions extends mixinBehaviors([NeonAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                --paper-input-container-color: var(--secondary-text-color);
                --paper-input-container-input-color: var(--primary-text-color);
                --paper-input-container-focus-color: var(--primary-text-color);
                --paper-input-container: {
                    padding: 0;
                };
                --paper-dropdown-menu: {
                    width: 130px;
                };
                --contacts-actions-paper-dropdown-menu-button: {
                    background-color: var(--body-background-color);
                    border-radius: var(--border-radius-base);
                };
                --contacts-actions-paper-dropdown-menu-input: {
                    color: var(--primary-text-color);
                    font-size: 14px;
                    line-height: 1.5;
                };
                --paper-dropdown-menu-icon: {
                    color: var(--primary-text-color);
                    width: 22px;
                    height: 22px;
                };
            }
            :host .page-actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                height: 100%;
            }
            :host .page-actions * {
                height: 100%;
            }
            :host appsco-contacts-actions {
                @apply --layout-flex;
            }
        </style>

        <div class="page-actions">
            <appsco-contacts-actions id="appscoContactsActions" on-search-icon="_onSearchIcon" on-close-search="_closeSearch"></appsco-contacts-actions>

            <appsco-page-global id="appscoPageGlobal" info="" filters=""></appsco-page-global>
        </div>
`;
    }

    static get is() { return 'appsco-contacts-page-actions'; }

    static get properties() {
        return {
            _searchActive: {
                type: Boolean,
                value: false
            },

            _displayActions: {
                type: Boolean,
                value: false
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    delay: 200,
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
    }

    _showSearch() {
        this.shadowRoot.getElementById('appscoContactsActions').focusSearch();

        this.updateStyles({
            '--input-search-max-width': '100%',
            '--paper-input-search-container-tablet': 'width: 100%;'
        });
    }

    _closeSearch() {
        this._searchActive = false;

        this.updateStyles({'--input-search-max-width': '22px'});

        // Wait for animation to finish.
        setTimeout(function() {
            this.updateStyles({'--paper-input-search-container-tablet': 'width: auto'});
        }.bind(this), 200);

        this.updateStyles();
    }

    _onSearchIcon() {
        this._searchActive = !this._searchActive;
        this._searchActive ? this._showSearch() : this._closeSearch();
    }

    showBulkActions() {
        this.shadowRoot.getElementById('appscoContactsActions').showBulkActions();
    }

    hideBulkActions() {
        this.shadowRoot.getElementById('appscoContactsActions').hideBulkActions();
    }

    showBulkSelectAll() {
        this.shadowRoot.getElementById('appscoContactsActions').showBulkSelectAll();
    }

    hideBulkSelectAll() {
        this.shadowRoot.getElementById('appscoContactsActions').hideBulkSelectAll();
    }

    setupPage() {}

    resetPage() {
        this.shadowRoot.getElementById('appscoContactsActions').reset();
    }

    resetPageActions() {
        this.shadowRoot.getElementById('appscoContactsActions').resetActions();
    }
}
window.customElements.define(AppscoContactsPageActions.is, AppscoContactsPageActions);
