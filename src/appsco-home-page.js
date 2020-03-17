import '@polymer/polymer/polymer-legacy.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/application/appsco-applications.js';
import './components/application/appsco-application-info.js';
import './components/application/appsco-application-security.js';
import './components/application/appsco-application-subscribers.js';
import './components/application/appsco-application-details.js';
import './components/application/appsco-application-log.js';
import './components/folder/appsco-folders.js';
import './components/application/appsco-application-add.js';
import './application/appsco-dialog-application-add.js';
import './components/folder/appsco-add-folder.js';
import './components/folder/appsco-folders-remove.js';
import './components/folder/appsco-folders-rename.js';
import './components/folder/appsco-folders-application-add.js';
import './application/appsco-application-settings-dialog.js';
import './components/application/appsco-application-share.js';
import './components/application/appsco-application-revoke.js';
import './application/appsco-home-page-actions.js';
import './components/application/company/appsco-company-resource-settings-dialog.js';
import './lib/mixins/appsco-headers-mixin.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { AppscoDropHTMLElementBehavior } from './components/components/appsco-drop-html-element-behavior.js';
class AppscoHomePage extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppscoDropHTMLElementBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --appsco-application-item: {
                     color: var(--primary-text-color);
                 };

                --appsco-list-item-message: {
                    font-size: 14px;
                };
                --application-log-item: {
                     padding-bottom: 6px;
                 };

                --application-details-label: {
                    font-size: 12px;
                };
                --application-details-value: {
                    font-size: 14px;
                };

                --applications-container: {
                     margin-right: -30px;
                 };
            }
            :host .content-container .subtitle {
                margin-top: 0;
                margin-bottom: 10px;
                font-weight: normal;
                color: var(--secondary-text-color);
            }
            appsco-application-security {
                --security-score: {
                     width: 32px;
                     height: 32px;
                     font-size: 14px;
                 };
            }
            :host appsco-application-subscribers {
                height: 50px;
            }
            :host .info {
                margin-top: 20px;
                color: var(--primary-text-color);
            }
            :host .info p {
                margin: 0;
                font-size: 14px;
            }
            :host div[info] .info-details-section {
                margin-top: 6px;
                height: calc(100% - 48px - 35px - 6px);
            }
            .tab-content {
                @apply --paper-tabs-content-style;
            }
            :host .info-actions > .view-button {
                margin-right: 1px;
            }
            :host .info-actions > .share-button {
                @apply --secondary-button;
            }
            appsco-application-share {
                --appsco-application-share-button: {
                     border-radius: 0;
                     margin: 0;
                     padding: 6px 12px;
                     background-color: var(--app-secondary-color);
                     color: #ffffff;
                     font-size: 14px;
                     height: 34px;
                 };
            }
            appsco-application-details {
                --appsco-application-icons-color: var(--primary-text-color);
            }
            :host([laptop-screen]) {
                --appsco-application-item: {
                     width: 131px;
                 };

                --info-width: 290px;
            }
            :host([tablet-s1280-screen]) {
                --appsco-application-item: {
                     width: 141px;
                 };

                --info-width: 318px;
            }
            :host([tablet-s1024-screen]) {
                --appsco-application-item: {
                     width: 127px;
                 };

                --info-width: 290px;
            }
            :host([tablet-screen]) {
                --appsco-application-item: {
                     width: 140px;
                 };

                --info-width: 300px;
            }
            :host([mobile-screen]) {
                --applications-container: {
                     margin-right: -25px;
                     display: block;
                     @apply --layout-horizontal;
                     @apply --layout-around-justified;
                 };
            }
        </style>

        <iron-media-query query="(max-width: 1366px)" query-matches="{{ laptopScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 1280px)" query-matches="{{ tabletS1280Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 1024px)" query-matches="{{ tabletS1024Screen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent">

            <div content="" slot="content">

                <div class="content-container folders-container" hidden\$="[[ _foldersEmpty ]]">
                    <h4 class="subtitle">Folders</h4>
                    <appsco-folders
                        id="appscoFolders"
                        size="100"
                        type="folder"
                        load-more=""
                        authorization-token="[[ authorizationToken ]]"
                        list-api="[[ foldersApi ]]"
                        on-list-loaded="_onFoldersLoaded"
                        on-list-empty="_onFoldersEmptyLoaded"
                        on-open-rename-folder-dialog="_onOpenRenameFolderDialog"
                        on-open-remove-folder-dialog="_onOpenRemoveFolderDialog"
                        on-item="_onFolderAction">
                    </appsco-folders>
                </div>

                <div class="content-container resources-container">
                    <h4 class="subtitle" hidden\$="[[ _foldersEmpty ]]">Resources</h4>
                    <appsco-applications
                        id="appscoApplications"
                        size="100"
                        load-more=""
                        authorization-token="[[ authorizationToken ]]"
                        applications-api="[[ applicationsApi ]]"
                        account="[[ account ]]"
                        on-info="_onViewApplicationInfo"
                        on-edit="_onApplicationEdit"
                        on-application="_onApplication"
                        on-application-removed="_onApplicationRemoved"
                        on-open-move-to-folder-dialog="_onOpenMoveToFolderDialog"
                        on-edit-shared-application="_onEditSharedApplication"
                        on-loaded="_onApplicationsLoaded"
                        on-empty-load="_onApplicationsLoaded">
                    </appsco-applications>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">
                <div class="info-header flex-horizontal">
                    <appsco-application-info class="flex" application="[[ application ]]">
                    </appsco-application-info>

                    <template is="dom-if" if="[[ application.claims.password ]]">
                        <appsco-application-security application="[[ application ]]"></appsco-application-security>
                    </template>
                </div>

                <div class="info-content flex-vertical">
                    <template is="dom-if" if="[[ !_shared ]]">
                        <appsco-application-subscribers application="[[ application ]]" authorization-token="[[ authorizationToken ]]" preview="">
                        </appsco-application-subscribers>
                    </template>

                    <template is="dom-if" if="[[ _shared ]]">
                        <div class="info">
                            <template is="dom-if" if="[[ !application.application.company ]]">
                                Shared by [[ application.application.added_by.display_name ]]
                            </template>
                            <template is="dom-if" if="[[ application.application.company ]]">
                                Shared by [[ application.application.company.name ]]
                            </template>
                        </div>
                    </template>

                    <template is="dom-if" if="[[ !_shared ]]">
                        <paper-tabs id="paperTabs" selected="{{ _selectedTab }}">
                            <paper-tab name="details">Details</paper-tab>
                            <paper-tab name="log">Log</paper-tab>
                        </paper-tabs>

                        <neon-animated-pages selected="{{ _selectedTab }}" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="info-details-section">

                            <div name="details" class="tab-content details">
                                <appsco-application-details application="[[ application ]]">
                                </appsco-application-details>
                            </div>

                            <div name="log" class="tab-content log">
                                <appsco-application-log application="[[ application ]]" authorization-token="[[ authorizationToken ]]">
                                </appsco-application-log>
                            </div>

                        </neon-animated-pages>
                    </template>

                    <template is="dom-if" if="[[ _shared ]]">
                        <div name="details">
                            <appsco-application-details application="[[ application ]]">
                            </appsco-application-details>
                        </div>
                    </template>
                </div>

                <div class="info-actions flex-horizontal">
                    <template is="dom-if" if="[[ _editClaims ]]">
                        <paper-button class="button view-button flex" on-tap="_onApplicationEditCredentials">
                            Manage
                        </paper-button>

                    </template>

                    <template is="dom-if" if="[[ !_shared ]]">
                        <paper-button class="button secondary-button flex" on-tap="_onShareApplication">
                            Share
                        </paper-button>
                    </template>
                </div>

                <template is="dom-if" if="[[ application.permisions.revoke ]]">
                    <div class="info-actions flex-horizontal">
                        <paper-button class="button danger-button flex" on-tap="_onRevokeApplication">
                            Revoke
                        </paper-button>
                    </div>
                </template>

            </div>

        </appsco-content>

        <appsco-application-add
            id="appscoApplicationAdd"
            authorization-token="[[ authorizationToken ]]"
            applications-template-api="[[ applicationsTemplateApi ]]"
            dashboard-api="[[ dashboardApi ]]"
            item="[[ item ]]"
            on-application-added="_onApplicationAdded"
            on-application-settings-saved="_stopPropagation"
            disable-upgrade>
        </appsco-application-add>

        <appsco-dialog-application-add
            id="appscoDialogApplicationAdd"
            authorization-token="[[ authorizationToken ]]"
            dashboard-api="[[ dashboardApi ]]"
            on-application-added="_onApplicationAdded"
            on-application-settings-saved="_stopPropagation"
            disable-upgrade>
        </appsco-dialog-application-add>

        <appsco-folders-application-add
            id="appscoFoldersApplicationAdd"
            authorization-token="[[ authorizationToken ]]"
            folders-api="[[ foldersApi ]]"
            api-errors="[[ apiErrors ]]"
            disable-upgrade>
        </appsco-folders-application-add>

        <appsco-add-folder
            id="appscoAddFolder"
            authorization-token="[[ authorizationToken ]]"
            folders-api="[[ foldersApi ]]"
            api-errors="[[ apiErrors ]]"
            on-folder-added="_onFolderAdded"
            disable-upgrade>
        </appsco-add-folder>

        <appsco-folders-rename
            id="appscoFoldersRename"
            authorization-token="[[ authorizationToken ]]"
            folders-api="[[ foldersApi ]]"
            api-errors="[[ apiErrors ]]"
            on-folder-renamed="_onFolderRenamed"
            disable-upgrade>
        </appsco-folders-rename>

        <appsco-folders-remove
            id="appscoFoldersRemove"
            authorization-token="[[ authorizationToken ]]"
            folders-api="[[ foldersApi ]]"
            api-errors="[[ apiErrors ]]"
            on-folder-removed="_onFolderRemoved"
            disable-upgrade>
        </appsco-folders-remove>

        <appsco-application-settings-dialog
            id="appscoApplicationSettingsDialog"
            account="[[ account ]]"
            authorization-token="[[ authorizationToken ]]"
            application="[[ application ]]"
            on-application-settings-saved="_onApplicationCredentialsChanged"
            disable-upgrade>
        </appsco-application-settings-dialog>

        <appsco-application-share
            id="appscoApplicationShare"
            application="[[ application ]]"
            authorization-token="[[ authorizationToken ]]"
            accounts-api="[[ accountsApi ]]"
            disable-upgrade>
        </appsco-application-share>

        <appsco-application-revoke
            id="appscoApplicationRevoke"
            application="[[ application ]]"
            authorization-token="[[ authorizationToken ]]"
            on-application-instance-removed="_onApplicationInstanceRevoked"
            disable-upgrade>
        </appsco-application-revoke>

        <appsco-company-resource-settings-dialog
            id="appscoCompanyResourceSettingsDialog"
            account="[[ account ]]"
            authorization-token="[[ authorizationToken ]]"
            domain="[[ domain ]]"
            disable-upgrade>
        </appsco-company-resource-settings-dialog>
`;
    }

    static get is() { return 'appsco-home-page'; }

    static get properties() {
        return {
            application: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            foldersApi: {
                type: String
            },

            dashboardApi: {
                type: String
            },

            applicationsTemplateApi: {
                type: String
            },

            iconsApi: {
                type: String
            },

            personalItemsApi: {
                type: String
            },

            sharedWithMeItemsApi: {
                type: String
            },

            accountsApi: {
                type: String
            },

            domain: {
                type: String
            },

            item: {
                type: Object
            },

            pageConfig: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onPageConfigChanged'
            },

            _foldersEmpty: {
                type: Boolean,
                value: true
            },

            _shared: {
                type: Boolean,
                computed: '_computeApplicationShared(application)'
            },

            _editClaims: {
                type: Boolean,
                computed: '_computeEditClaims(application)'
            },

            _infoShown: {
                type: Boolean,
                value: false
            },

            _selectedTab: {
                type: Number
            },

            authorizationToken: {
                type: String,
                value: ''
            },

            applicationsApi: {
                type: String
            },

            _applications: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _selectedApplicationsGroup: {
                type: Number,
                value: 0
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletS1024Screen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletS1280Screen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            laptopScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                computed: '_computePageLoaded(_applicationsLoaded, _foldersLoaded)',
                observer: '_pageLoadedChanged'
            },

            _applicationsLoaded: {
                type: Boolean,
                value: false
            },

            _foldersLoaded: {
                type: Boolean,
                value: false
            },

            apiErrors: {
                type: Object
            }
        }
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen, tabletS1024Screen, tabletS1280Screen, laptopScreen)'
        ];
    }

    ready() {
        super.ready();

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
            if (this.mobileScreen || this.tabletScreen || this.tabletS1024Screen || this.tabletS1280Screen || this.laptopScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('search', this._onSearchApplications.bind(this));
        this.toolbar.addEventListener('add-item-action', this._onAddItemAction.bind(this));
        this.toolbar.addEventListener('filter-items', this._onFilterItemsAction.bind(this));
        this.toolbar.addEventListener('add-new-folder', this._onAddNewFolderAction.bind(this));
        this.toolbar.addEventListener('search-clear', this._onSearchApplicationsClear.bind(this));
    }

    _onSearchApplications(event) {
        this._showProgressBar();
        this.filterApplicationsByTerm(event.detail.term);
    }

    _onAddItemAction(event) {
        if ('catalogue-application' === event.detail.action) {
            const dialog = this.shadowRoot.getElementById('appscoApplicationAdd');
            dialog.removeAttribute('disable-upgrade');

            setTimeout(function() {
                dialog.toggle();
            }, 0);
            return;
        }

        const applicationTemplate = event.detail.applicationTemplate,
            request = document.createElement('iron-request'),
            options = {
                url: this.domain + applicationTemplate,
                method: 'GET',
                handleAs: 'json',
                headers: this._headers
            };

        request.send(options).then(function() {
            if (200 === request.status) {
                const dialog = this.shadowRoot.getElementById('appscoDialogApplicationAdd');
                dialog.removeAttribute('disable-upgrade');

                setTimeout(function() {
                    dialog.setApplicationTemplate(request.response.application);
                    dialog.toggle();
                }.bind(this), 0);
            }

        }.bind(this));
    }

    _onFilterItemsAction(event) {
        const id = parseInt(event.detail.id);
        if (id !== this._selectedApplicationsGroup) {
            const resourcesApi = this._getApiByDetailId(id);

            this._selectedApplicationsGroup = id;
            this._showProgressBar();

            this.filterApplicationsByStatus(resourcesApi);
        }
    }

    _onSearchApplicationsClear() {
        this.filterApplicationsByTerm('');
    }

    _onAddNewFolderAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoAddFolder');
        dialog.removeAttribute('disable-upgrade');

        setTimeout(function(){
            dialog.setOnPersonal();
            dialog.open();
        }, 0);
    }

    _stopPropagation(e) {
        e.stopPropagation();
    }

    _onFolderAdded(event) {
        const folder = event.detail.folder;

        this.addFolder(folder);
        this._notify('Dashboard folder ' + folder.title + ' has been successfully created.');
    }

    _getApiByDetailId(id) {
        if (0 === id) {
            return this.iconsApi;
        }
        if (1 === id) {
            return this.personalItemsApi;
        }
        if (2 === id) {
            return this.sharedWithMeItemsApi;
        }

        return this.applicationsApi;
    }

    _updateScreen(mobile, tablet, tabletS1024Screen, tabletS1280Screen, laptop) {
        this.updateStyles();
    }

    _computeApplicationShared(application) {
        return application && !application.owner;
    }

    _computeEditClaims(application) {
        return application.permisions && application.permisions.edit_claims;
    }

    _onFoldersLoaded() {
        this._foldersLoaded = true;
        this._showFolders();
    }

    _onFoldersEmptyLoaded() {
        this._foldersLoaded = true;
    }

    _onApplicationsLoaded() {
        this._applicationsLoaded = true;
    }

    _computePageLoaded(applicationsLoaded, foldersLoaded) {
        return applicationsLoaded && foldersLoaded;
    }

    _pageLoadedChanged(pageLoaded) {
        if (pageLoaded) {
            this.dispatchEvent(new CustomEvent('page-loaded', {bubbles: true, composed: true}));
            this._initializeResourcesDragBehavior();
        }
    }

    initializePage() {
        this.setDefaultApplication();
    }

    resetPage() {
        this.$.appscoApplications.reset();
        this.$.appscoApplications.reloadApplications();
        this.$.appscoFolders.resetAllItems();
        this._hideInfo();
    }

    _showInfo() {
        this.$.appscoContent.showSection('info');
        this._infoShown = true;
        this._selectedTab = 0;
    }

    _hideInfo() {
        this.$.appscoContent.hideSection('info');
        this._infoShown = false;
    }

    toggleInfo() {
        this.$.appscoContent.toggleSection('info');
        this._infoShown = !this._infoShown;

        if (this._infoShown) {
            this._selectedTab = 0;
        }
    }

    _onViewApplicationInfo(event) {
        this.set('application', event.detail.application);

        if (!this._infoShown) {
            this._showInfo();
        }
    }

    _onApplicationEdit(event) {
        this.set('application', event.detail.application);
        this.dispatchEvent(new CustomEvent('edit-application', {
            bubbles: true,
            composed: true,
            detail: {
                application: event.detail.application
            }
        }));
    }

    _onApplicationInfoEdit() {
        this.dispatchEvent(new CustomEvent('info-edit-application', {
            bubbles: true,
            composed: true,
            detail: {
                application: this.application
            }
        }));
    }

    _onApplicationEditCredentials() {
        const dialog = this.shadowRoot.getElementById('appscoApplicationSettingsDialog');
        dialog.removeAttribute('disable-upgrade');

        setTimeout(function() {
            dialog.setApplication(this.application);
            dialog.toggle();
        }, 0);
    }

    _onApplication(event) {
        if(['unpw', 'item', 'none', 'saml', 'saml_dropbox', 'saml_office_365', 'open_id'].indexOf(event.detail.application.auth_type) > -1) {
            window.open(event.detail.application.meta.plugin_go, "_blank");
        } else {
            this._onViewApplicationInfo(event);
        }
    }

    _onShareApplication(event) {
        const dialog = this.shadowRoot.getElementById('appscoApplicationShare');
        dialog.removeAttribute('disable-upgrade');

        setTimeout(function() {
            dialog.toggle();
        }, 0);
    }

    _onRevokeApplication() {
        const dialog = this.shadowRoot.getElementById('appscoApplicationRevoke');
        dialog.removeAttribute('disable-upgrade');

        setTimeout(function() {
            dialog.applicationInstance = this.application;
            dialog.open();
        }, 0);
    }

    _onPageConfigChanged(newValue) {
        newValue = newValue[this.getAttribute('name')];

        if (!newValue) {
            return false;
        }

        const appscoApplicationsComponent = this.$.appscoApplications;

        if (newValue.display_style) {
            appscoApplicationsComponent.setDisplayStyle(newValue.display_style);
        }

        if (newValue.sort_field && 'undefined' !== typeof newValue.sort_ascending) {
            appscoApplicationsComponent.setSort({
                orderBy: newValue.sort_field,
                ascending: newValue.sort_ascending
            });
        }
    }

    reloadApplications() {
        this._applicationsLoaded = false;
        this.$.appscoApplications.reloadApplications();
    }

    setApplication(application) {
        this.$.appscoApplications.modifyApplications([application]);
    }

    addApplications(applications) {
        this.$.appscoApplications.addApplications(applications);
    }

    removeApplications(applications) {
        this.$.appscoApplications.removeApplications(applications);
    }

    _onApplicationRemoved() {
        this.setDefaultApplication();
    }

    setDefaultApplication() {
        this.set('application', this.$.appscoApplications.getFirstApplication());
    }

    filterApplicationsByTerm(term) {
        this.$.appscoApplications.filterByTerm(term);
    }

    filterApplicationsByStatus(api) {
        this.$.appscoApplications.filterByStatus(api);
    }

    addFolder(folder) {
        this._showFolders();
        this.$.appscoFolders.addItems([folder]);
    }

    removeFolder() {
        this.$.appscoFolders.reloadItems();

        if (this.$.appscoFolders.getCurrentCount() > 0) {
            this._showFolders();
        } else {
            this._hideFolders();
        }
    }

    renameFolder() {
        this._showFolders();
        this.$.appscoFolders.reloadItems();
    }

    _showFolders() {
        this._foldersEmpty = false;
    }

    _hideFolders() {
        this._foldersEmpty = true;
    }

    _initializeResourcesDragBehavior() {
        this.$.appscoApplications.initializeResourcesDragBehavior();
    }

    _onFolderAction(event) {
        this.dispatchEvent(new CustomEvent('folder-tapped', {
            bubbles: true,
            composed: true,
            detail: {
                folder: event.detail.item,
                personal: true
            }
        }));
    }

    _onApplicationAdded(event) {
        const application = event.detail.application,
            applications = [application],
            message = application.title + ' was successfully saved.';

        this.application = application;
        this.addApplications(applications);
        this._notify(message);
    }

    _onApplicationCredentialsChanged(event) {
        const application = event.detail.application,
            message = 'You successfully changed ' + application.title + ' credentials.';

        this._notify(message);
    }

    _onApplicationInstanceRevoked(event) {
        this.removeApplications([event.detail.applicationInstance]);
        this.setDefaultApplication();
        this._notify('You have successfully revoked access to ' + event.detail.applicationInstance.application.title + '.');
    }

    _onOpenMoveToFolderDialog(event) {
        const applicationIcon = event.detail.applicationIcon,
            currentFolder = event.detail.currentFolder;

        const dialog = this.shadowRoot.getElementById('appscoFoldersApplicationAdd');
        dialog.removeAttribute('disable-upgrade');

        setTimeout(function() {
            dialog.setApplicationIcon(applicationIcon);
            dialog.setCurrentFolder(currentFolder);
            dialog.setCompany(null);
            dialog.toggle();
        }, 0);
    }

    _onOpenRenameFolderDialog(event) {
        const folderItem = event.detail.folderItem,
            dialog = this.shadowRoot.getElementById('appscoFoldersRename');

        dialog.removeAttribute('disable-upgrade');

        setTimeout(function() {
            dialog.setFolderItem(folderItem);
            dialog.setCompany(null);
            dialog.toggle();
        }, 0);
    }

    _onOpenRemoveFolderDialog(event) {
        const folderItem = event.detail.folderItem,
            dialog = this.shadowRoot.getElementById('appscoFoldersRemove');
        dialog.removeAttribute('disable-upgrade');

        setTimeout(function() {
            dialog.setFolderItem(folderItem);
            dialog.setCompany(null);
            dialog.toggle();
        }, 0);
    }

    _onFolderRenamed(event) {
        const folder = event.detail.folder;

        this.renameFolder(folder);
        this._notify('Dashboard folder ' + folder.title + ' has been renamed.');
        this._hideProgressBar();
    }

    _onFolderRemoved(event) {
        const folder = event.detail.folder;

        this.removeFolder(folder);
        this._notify('Dashboard folder ' + folder.title + ' has been removed.');
        this._hideProgressBar();
    }

    _onEditSharedApplication(event) {
        const dialog = this.shadowRoot.getElementById('appscoCompanyResourceSettingsDialog');
        dialog.removeAttribute('disable-upgrade');

        setTimeout(function() {
            dialog.setApplication(event.detail.application);
            dialog.toggle();
        }, 0);
    }
}
window.customElements.define(AppscoHomePage.is, AppscoHomePage);
