import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-ajax/iron-ajax.js';
import './components/page/appsco-content.js';
import './components/page/appsco-manage-page-styles.js';
import './components/account/appsco-account-image.js';
import './components/contact/appsco-manage-contact-components-page.js';
import './components/contact/appsco-contact-applications-page.js';
import './components/contact/appsco-contact-groups-page.js';
import './account/appsco-account-log-page.js';
import './components/contact/appsco-manage-contact-page-actions.js';
import './components/contact/appsco-delete-contact.js';
import './components/contact/appsco-convert-contact.js';
import './components/application/company/appsco-application-assignee-revoke.js';
import './components/contact/appsco-contact-remove-group.js';
import './lib/mixins/appsco-headers-mixin.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoManageContactPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-manage-page-styles">
            :host {
                --paper-card-header-text: {
                    padding: 16px;
                    font-size: 24px;
                    font-weight: 400;
                    color: #414042;
                };
            }
            :host div[resource] {
                height: calc(100% - 32px - 20px);
            }
            appsco-account-image {
                --account-image: {
                    width: 96px;
                    height: 96px;
                    margin-left: auto;
                    margin-right: auto;
                };

                --account-initials-background-color: var(--body-background-color-darker);
                --account-initials-font-size: 24px;
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <iron-ajax id="ironAjaxGetContact" on-error="_onGetContactError" on-response="_onGetContactResponse" headers="[[ _headers ]]"></iron-ajax>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">

                <div class="resource-header">
                    <appsco-account-image account="[[ contact.account ]]"></appsco-account-image>
                </div>

                <div class="resource-content account-info">
                    <div class="account-name">[[ contact.display_name ]]</div>
                    <div class="account-email">[[ contact.email ]]</div>
                </div>

                <div class="resource-actions flex-horizontal">
                    <paper-button class="button secondary-button flex" on-tap="_onConvertContactToUserAction">
                        Convert to user
                    </paper-button>

                    <paper-button class="button danger-button flex" on-tap="_onDeleteContactAction">
                        Delete
                    </paper-button>
                </div>

            </div>

            <div content="" slot="content">

                <div class="content-container">
                    <neon-animated-pages class="flex" selected="{{ _selected }}" attr-for-selected="name">

                        <appsco-manage-contact-components-page id="appscoManageContactComponentsPage" name="appsco-contact-components-page" contact="[[ contact ]]" administrator="[[ administrator ]]" authorization-token="[[ authorizationToken ]]" log-api="[[ _logApi ]]" groups-api="[[ _groupsApi ]]" on-manage-applications="_onManageApplications" on-manage-activity-log="_onManageActivityLog" on-manage-groups="_onManageGroups" on-log-empty="_pageLoaded">
                        </appsco-manage-contact-components-page>

                        <appsco-contact-applications-page id="appscoContactApplicationsPage" name="appsco-contact-applications-page" contact="[[ contact ]]" authorization-token="[[ authorizationToken ]]" on-revoke-assignee="_onRevokeAssigneeAccess" on-back="_onResourceBack">
                        </appsco-contact-applications-page>

                        <appsco-account-log-page id="appscoAccountLogPage" name="appsco-account-log-page" account="[[ contact.account ]]" authorization-token="[[ authorizationToken ]]" log-api="[[ _logApi ]]" on-back="_onResourceBack">
                        </appsco-account-log-page>

                        <appsco-contact-groups-page id="appscoContactsGroup" name="appsco-contact-groups-page" authorization-token="[[ authorizationToken ]]" groups-api="[[ _groupsApi ]]" contact="[[ contact ]]" on-remove-from-group="_onRemoveContactFromGroup" on-back="_onResourceBack">
                        </appsco-contact-groups-page>

                    </neon-animated-pages>
                </div>
            </div>
        </appsco-content>

        <appsco-delete-contact id="appscoDeleteContact" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]">
        </appsco-delete-contact>

        <appsco-convert-contact id="appscoConvertContact" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]">
        </appsco-convert-contact>

        <appsco-application-assignee-revoke id="appscoApplicationAssigneeRevoke" authorization-token="[[ authorizationToken ]]">
        </appsco-application-assignee-revoke>

        <appsco-contact-remove-group id="appscoContactRemoveGroup" authorization-token="[[ authorizationToken ]]">
        </appsco-contact-remove-group>
`;
    }

    static get is() { return 'appsco-manage-contact-page'; }

    static get properties() {
        return {
            route: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            contact: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onContactChanged'
            },

            contactsApi: {
                type: String,
                observer: '_onContactsApiChanged'
            },

            _logApi: {
                type: String,
                computed: '_computeLogApi(contact)'
            },

            _groupsApi: {
                type: String,
                computed: '_computeGroupsApi(contact)'
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

            /**
             * Selected page.
             * It has value of component's 'name' attribute.
             */
            _selected: {
                type: String,
                value: 'appsco-contact-components-page',
                notify: true
            },

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
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
            this._getContact();
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    setContact(contact) {
        this.set('contact', contact);
    }

    resetPage() {
        this._showContactComponentsPage();
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _updateScreen(medium, tablet, mobile) {
        this.updateStyles();

        if (mobile) {
            this.$.appscoContent.hideSection('resource');
        }
        else if (!this.$.appscoContent.resourceActive) {
            this.$.appscoContent.showSection('resource');
        }
    }

    _computeLogApi(contact) {
        return contact.meta ? contact.meta.log : null;
    }

    _computeGroupsApi(contact) {
        return contact.meta ? contact.meta.groups + '?extended=1' : null;
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _onContactsApiChanged() {
        this._getContact();
    }

    _onContactChanged(contact) {
        if (contact.self) {
            this.$.appscoManageContactComponentsPage.load();
            this.$.appscoContactsGroup.loadGroups();
        }
    }

    _getContact() {
        if (!this.contact.self && this.contactsApi && this._headers) {
            var contactApi = this.contactsApi + this.route.path,
                getContactRequest = this.$.ironAjaxGetContact;

            if (getContactRequest.lastRequest) {
                getContactRequest.lastRequest.abort();
            }

            getContactRequest.url = contactApi;
            getContactRequest.generateRequest();
        }
    }

    _onGetContactResponse(event) {
        if (200 === event.detail.status && event.detail.response) {
            this.set('contact', event.detail.response);
        }

        this._onPageLoaded();
    }

    _onGetContactError(event) {

        if (!event.detail.request.aborted) {
            this.dispatchEvent(new CustomEvent('page-error', { bubbles: true, composed: true }));
        }
    }

    _onConvertContactToUserAction() {
        const dialog = this.shadowRoot.getElementById('appscoConvertContact');
        dialog.setContact(this.contact);
        dialog.toggle();
    }

    _onDeleteContactAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoDeleteContact');
        dialog.setContact(this.contact);
        dialog.toggle();
    }

    _onManageApplications() {
        this._selected = 'appsco-contact-applications-page';
    }

    _onManageActivityLog() {
        this._selected = 'appsco-account-log-page';
    }

    _onManageGroups() {
        this._selected = 'appsco-contact-groups-page';
    }

    _onResourceBack() {
        this._showContactComponentsPage();
    }

    _showContactComponentsPage() {
        this._selected = 'appsco-contact-components-page';
    }

    reloadApplications() {
        this.$.appscoContactApplicationsPage.reloadApplications();
        this.$.appscoManageContactComponentsPage.reloadApplications();
    }

    removeGroup(group) {
        this.$.appscoContactsGroup.removeGroup(group);
    }

    reload() {
        this.$.appscoManageContactComponentsPage.load();
    }

    _onRevokeAssigneeAccess(event) {
        const dialog = this.shadowRoot.getElementById('appscoApplicationAssigneeRevoke');
        dialog.setAssignee(event.detail.assignee);
        dialog.toggle();
    }

    _onRemoveContactFromGroup(event) {
        let appscoContactRemoveGroup = this.shadowRoot.getElementById('appscoContactRemoveGroup');
        appscoContactRemoveGroup.setGroup(event.detail.group);
        appscoContactRemoveGroup.setContact(event.detail.contact);
        appscoContactRemoveGroup.toggle();
    }
}
window.customElements.define(AppscoManageContactPage.is, AppscoManageContactPage);
