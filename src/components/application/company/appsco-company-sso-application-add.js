import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../../components/appsco-loader.js';
import '../../components/appsco-search.js';
import './appsco-company-application-add-settings.js';
import './appsco-company-application-sso-list.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanySSOApplicationAdd extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host neon-animated-pages > * {
                @apply --neon-animated-pages;
            }
            :host neon-animated-pages > .iron-selected {
                position: relative;
            }
            appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            appsco-search {
                margin-bottom: 10px;
            }
            :host .buttons {
                padding-right: 24px;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button.add-action {
                margin: 0 0 0 10px;
                display: none;
                @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
        </style>

        <paper-dialog id="addApplicationDialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>[[ _dialogTitle ]]</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <template is="dom-if" if="[[ _searchAction ]]">
                <appsco-search id="appscoSearch" label="Search SSO applications" float-label="" on-search="_onSearch" on-search-clear="_onSearchClear"></appsco-search>
            </template>

            <paper-dialog-scrollable>
                <neon-animated-pages class="flex" selected="{{ _selected }}" attr-for-selected="name" on-neon-animation-finish="_onPageAnimationFinish">

                    <appsco-company-application-sso-list id="appscoApplicationAddSearch" name="appsco-application-add-search" authorization-token="[[ authorizationToken ]]" applications-template-api="[[ applicationsTemplateApi ]]" selected-application="{{ _selectedApplication }}" on-application-select="_onApplicationSelect" on-add-custom-sso="_onAddItem">
                    </appsco-company-application-sso-list>

                    <appsco-company-application-add-settings id="appscoApplicationAddSettings" name="appsco-application-add-settings" application="[[ _selectedApplication ]]" authorization-token="[[ authorizationToken ]]" add-application-api="[[ addApplicationApi ]]" on-form-error="_onFormError" on-application-added="_onApplicationAdded">
                    </appsco-company-application-add-settings>

                </neon-animated-pages>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button id="addApplicationAction" class="add-action" on-tap="_onAddApplication">
                    Add
                </paper-button>
            </div>
        </paper-dialog>

        <iron-a11y-keys keys="enter" on-keys-pressed="_onEnter">
        </iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-company-sso-application-add'; }

    static get properties() {
        return {
            _selected: {
                type: String,
                value: 'appsco-application-add-search',
                notify: true
            },

            _selectedApplication: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            item: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _itemTemplate: {
                type: Object,
                computed: '_computeItemTemplate(item)'
            },

            applicationsTemplateApi: {
                type: String
            },

            addApplicationApi: {
                type: String
            },

            _dialogTitle: {
                type: String,
                value: 'Add application'
            },

            /**
             * Indicates weather search action should be displayed or not.
             * It depends on which page is currently displayed.
             */
            _searchAction: {
                type: Boolean,
                value: false,
                notify: true
            },

            /**
             * Indicates weather add action should be displayed or not.
             * It depends on which page is currently displayed.
             */
            _addAction: {
                type: Boolean,
                value: false
            },

            /**
             * Indicates if appsco loader should be displayed.
             */
            _loader: {
                type: Boolean,
                value: false
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready(){
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this.$.addApplicationAction,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this.$.addApplicationAction,
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
        this.addEventListener('_selected-changed', this._onSelectedChanged);
        this.addEventListener('_search-action-changed', this._onSearchActionChanged);
        this.addEventListener('neon-animation-finish', this._onAddActionAnimationFinish);
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _onFormError() {
        this._hideLoader();
    }

    _computeItemTemplate(item) {
        item.title = 'Application title';
        return item;
    }

    _onSearch(event) {
        this.$.appscoApplicationAddSearch.filterResourcesByTerm(event.detail.term);
    }

    _onSearchClear() {
        this._onSearch({
            detail: {
                term: ''
            }
        });
    }

    _setupAppscoSearch() {
        if (this.shadowRoot.getElementById('appscoSearch')) {
            this.shadowRoot.getElementById('appscoSearch').setup();
        }
    }

    _resetAppscoSearch() {
        if (this.shadowRoot.getElementById('appscoSearch')) {
            this.shadowRoot.getElementById('appscoSearch').reset();
        }
    }

    _onSearchActionChanged(event) {
        event.detail.value ? this._setupAppscoSearch() : this._resetAppscoSearch();
    }

    /**
     * Called after selected page has been changed.
     * According to selected page it shows / hides add application action (_addAction).
     *
     * @private
     */
    _onSelectedChanged() {
        if (this._selected !== 'appsco-application-add-search') {
            this._searchAction = false;
            this.$.addApplicationAction.style.display = 'block';
            this.playAnimation('entry');
            this._addAction = true;
        }
        else {
            this._searchAction = true;
            this._addAction = false;
            this.playAnimation('exit');
        }
    }

    /**
     * Called after add application action animation is finished.
     * It hides action if it shouldn't be visible.
     *
     * @private
     */
    _onAddActionAnimationFinish() {
        if (!this._addAction) {
            this.$.addApplicationAction.style.display = 'none';
        }
    }

    /**
     * Called after application has been selected from search list.
     * It shows appsco-application-add-settings page.
     *
     * @private
     */
    _onApplicationSelect() {
        this._selected = 'appsco-application-add-settings';
    }

    /**
     * Called after clicked on Add Custom Application action.
     * It sets selected application to Item resource.
     *
     * @private
     */
    _onAddItem() {
        this.set('_selectedApplication', this._itemTemplate);
        this._onApplicationSelect();
        this._dialogTitle = 'Add custom application';
    }

    /**
     * Called after dialog has been opened.
     *
     * @private
     */
    _onDialogOpened(event) {
        this._dialogTitle = 'Add application';
        this.$.appscoApplicationAddSearch.setup();
        this._setupAppscoSearch();
    }

    /**
     * Called after dialog has been closed.
     * It resets search and settings pages.
     * It sets selected page to appsco-application-add-search.
     *
     * @private
     */
    _onDialogClosed() {
        this._resetAppscoSearch();
        this._selectedApplication = {};
        this.$.appscoApplicationAddSearch.reset();
        this.$.appscoApplicationAddSettings.reset();
        this._selected = 'appsco-application-add-search';
        this._dialogTitle = 'Add application';
        this._hideLoader();
    }

    /**
     * Submits signup form on ENTER key using iron-a11y-keys component.
     *
     * @private
     */
    _onEnter() {
        this._onAddApplication();
    }

    /**
     * Called when user wants to save chosen application.
     * It calls addApplication method of appsco-application-add-settings page.
     *
     * @private
     */
    _onAddApplication() {
        this._showLoader();
        this.$.appscoApplicationAddSettings.addApplication();
    }

    /**
     * Called after application has been successfully added.
     * It closes the dialog.
     *
     * @private
     */
    _onApplicationAdded() {
        this._closeDialog();
    }

    _closeDialog() {
        this.$.addApplicationDialog.close();
        this.$.addApplicationAction.disabled = false;
    }

    setAction (action) {
        this.$.appscoApplicationAddSettings.setAction(action);
    }

    toggle() {
        this.$.addApplicationDialog.toggle();
    }

    _onPageAnimationFinish(event) {
        const fromPage = event.detail.fromPage,
            toPage = event.detail.toPage;

        if('appsco-application-add-settings' === fromPage.getAttribute('name') ||
            'appsco-application-add-search' === fromPage.getAttribute('name')) {
            fromPage.reset();
        }

        if('appsco-application-add-search' === toPage.getAttribute('name')) {
            toPage.setup();
        }
    }
}
window.customElements.define(AppscoCompanySSOApplicationAdd.is, AppscoCompanySSOApplicationAdd);
