import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '../components/appsco-search.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoContactsActions extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                margin-right: -10px;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                @apply --appsco-contacts-actions;

                --paper-dropdown-menu-button: {
                    display: block;
                    padding: 0 0 0 8px;
                    @apply --contacts-actions-paper-dropdown-menu-button;
                };
            }
            paper-icon-button {
                color: var(--account-action-icon-color);
                --paper-icon-button-ink-color: var(--account-action-icon-color);
            }
            appsco-search {
                max-width: 200px;
            }
            :host .action {
                margin-right: 10px;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --application-action;
            }
            :host .bulk-action {
                display: none;
            }
            :host .flex-none {
                @apply --layout-flex-none;
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
            :host paper-tooltip {
                top: 100% !important;
                font-weight: 500;
                min-width: 100px;
                text-align: center;
                @apply --action-tooltip;
            }
            paper-dropdown-menu {
                --paper-input-container-underline: {
                    display: none;
                };
                --paper-input-container-underline-focus: {
                    display: none;
                };
                --paper-dropdown-menu-ripple: {
                    display: none;
                };
                --paper-input-container-input: {
                    vertical-align: middle;
                    cursor: pointer;
                    @apply --contacts-actions-paper-dropdown-menu-input;
                };
            }
            :host paper-listbox {
                @apply --paper-listbox;
                overflow: hidden;
            }
            :host paper-item:hover {
                @apply --paper-item-hover;
            }
            :host .bulk-action[hidden] {
                display: none !important;
            }
        </style>

        <div class="action action-search flex-none">

            <appsco-search id="appscoSearch" label="Search contacts"></appsco-search>
        </div>

        <div class="action flex-none">
            <paper-dropdown-menu horizontal-align="right" no-label-float="" on-iron-activate="_onActivePageSelected">
                <paper-listbox id="pagesListbox" class="dropdown-content" selected="0" slot="dropdown-content">

                    <template is="dom-repeat" items="[[ _pages ]]">
                        <paper-item value\$="[[ item.value ]]" name\$="[[ item.name ]]">[[ item.name ]]</paper-item>
                    </template>
                </paper-listbox>
            </paper-dropdown-menu>
        </div>

        <div class="action bulk-action flex-none">
            <paper-icon-button id="addToGroupAction" icon="social:group-add" alt="Add to group" on-tap="_onAddToGroupAction"></paper-icon-button>
            <paper-tooltip for="addToGroupAction" position="bottom">Add to group</paper-tooltip>
        </div>

        <div class="action bulk-action flex-none">
            <paper-icon-button id="deleteContactAction" icon="icons:delete" alt="Delete contact" on-tap="_onDeleteContactsAction"></paper-icon-button>
            <paper-tooltip for="deleteContactAction" position="bottom">Delete contacts</paper-tooltip>
        </div>

        <div class="action bulk-select-all flex-none">
            <paper-icon-button id="selectAllAction" icon="icons:done-all" alt="Select all" on-tap="_onSelectAllAction"></paper-icon-button>
            <paper-tooltip for="selectAllAction" position="bottom">Select all</paper-tooltip>
        </div>

        <div class="action flex-none">
            <paper-icon-button id="addContactAction" icon="social:person-add" alt="Add contact" on-tap="_onAddContactAction"></paper-icon-button>
            <paper-tooltip for="addContactAction" position="bottom">Add contact</paper-tooltip>
        </div>

        <div class="action flex-none">
            <paper-icon-button id="importContactsAction" icon="icons:folder-shared" alt="Import contacts" on-tap="_onImportContactsAction"></paper-icon-button>
            <paper-tooltip for="importContactsAction" position="bottom">Import contacts</paper-tooltip>
        </div>

        <div class="action flex-none">
            <paper-icon-button id="sendNotificationAction" icon="social:notifications" alt="Send notification" on-tap="_onSendNotificationAction"></paper-icon-button>
            <paper-tooltip for="sendNotificationAction" position="bottom">Send notification</paper-tooltip>
        </div>
`;
    }

    static get is() { return 'appsco-contacts-actions'; }

    static get properties() {
        return {
            /**
             * Indicates if bulk actions are visible or not.
             * Used to show / hide bulk actions.
             */
            _bulkActions: {
                type: Boolean,
                value: false,
                observer: '_onBulkActionsChanged'
            },

            _bulkSelectAll: {
                type: Boolean,
                value: true,
                observer: '_onBulkSelectAllChanged'
            },

            _pages: {
                type: Array,
                value: function () {
                    return [
                        {
                            name: 'Contacts',
                            value: 0
                        },
                        {
                            name: 'Invitations',
                            value: 1
                        }];
                }
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
                name: 'cascaded-animation',
                animation: 'fade-in-animation',
                nodes: [],
                nodeDelay: 50,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'cascaded-animation',
                animation: 'fade-out-animation',
                nodes: [],
                nodeDelay: 0,
                timing: {
                    duration: 200
                }
            }
        };

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('neon-animation-finish', this._onNeonAnimationFinish);
    }

    showBulkActions() {
        this._bulkActions = true;
    }

    hideBulkActions() {
        this._bulkActions = false;
    }

    /**
     * Sets focus on search input field.
     */
    focusSearch() {
        this.$.appscoSearch.setup();
    }

    reset() {
        this.resetActions();
        this.shadowRoot.getElementById('pagesListbox').selected = 0;
    }

    resetActions() {
        this.$.appscoSearch.reset();
        this.hideBulkActions();
    }

    _onAddContactAction() {
        this.dispatchEvent(new CustomEvent('add-contact', { bubbles: true, composed: true }));
    }

    _onImportContactsAction() {
        this.dispatchEvent(new CustomEvent('import-contacts', { bubbles: true, composed: true }));
    }

    _onDeleteContactsAction() {
        this.dispatchEvent(new CustomEvent('delete-contacts', { bubbles: true, composed: true }));
    }

    _onAddToGroupAction() {
        this.dispatchEvent(new CustomEvent('add-groups-to-contacts', { bubbles: true, composed: true }));
    }

    _onSelectAllAction() {
        this.dispatchEvent(new CustomEvent('select-all-contacts', { bubbles: true, composed: true }));
    }

    _onSendNotificationAction() {
        this.dispatchEvent(new CustomEvent('send-notification', { bubbles: true, composed: true }));
    }

    _onActivePageSelected(event) {
        this.dispatchEvent(new CustomEvent('page-selected', {
            bubbles: true,
            composed: true,
            detail: {
                page: event.detail.item.getAttribute('name')
            }
        }));
    }

    _onBulkActionsChanged() {
        const bulkActions = dom(this.root).querySelectorAll('.bulk-action');

        if (this.animationConfig) {
            this.animationConfig.entry.nodes = bulkActions;
            this.animationConfig.exit.nodes = bulkActions;
        }

        if (this._bulkActions) {
            const length = bulkActions.length;

            for (let i = 0; i < length; i++) {
                bulkActions[i].style.display = 'flex';
            }

            this.playAnimation('entry');
        }
        else {
            this.playAnimation('exit');
        }
    }

    showBulkSelectAll() {
        this._bulkSelectAll = true;
    }

    hideBulkSelectAll() {
        this._bulkSelectAll = false;
    }

    _onBulkSelectAllChanged () {
        const bulkSelectAll = dom(this.root).querySelectorAll('.bulk-select-all');
        if (this._bulkSelectAll) {
            bulkSelectAll[0].style.display = 'block';
        }else {
            bulkSelectAll[0].style.display = 'none';
        }
    }

    _onNeonAnimationFinish() {
        if (!this._bulkActions) {
            const bulkActions = dom(this.root).querySelectorAll('.bulk-action'),
                length = bulkActions.length;

            for (let i = 0; i < length; i++) {
                bulkActions[i].style.display = 'none';
            }
        }
    }
}
window.customElements.define(AppscoContactsActions.is, AppscoContactsActions);
