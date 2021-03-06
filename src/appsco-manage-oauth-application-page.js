import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './components/page/appsco-content.js';
import './components/page/appsco-manage-page-styles.js';
import './components/oauth-application/appsco-manage-oauth-application-components-page.js';
import './components/oauth-application/appsco-oauth-application-settings-page.js';
import './components/oauth-application/appsco-oauth-application-certificates-page.js';
import './components/oauth-application/appsco-oauth-application-info.js';
import './components/oauth-application/appsco-manage-oauth-application-page-actions.js';
import './components/oauth-application/appsco-remove-oauth-application.js';
import './components/oauth-application/appsco-add-oauth-application-certificate.js';
import './components/oauth-application/appsco-remove-oauth-application-certificate.js';
import './lib/mixins/appsco-page-mixin.js';
import './lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoManageOauthApplicationPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.PageMixin,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-manage-page-styles">
            :host div[resource] {
                height: calc(100% - 32px - 20px);
            }
            :host .application-icon {
                width: 64px;
                height: 64px;
                margin: 0 auto;
                display: block;
            }
            :host .application-title {
                margin-top: 30px;
                margin-bottom: 0;
                word-wrap: break-word;
            }
            :host .info {
                @apply --paper-font-body1;
                margin-top: 10px;
            }
            :host appsco-oauth-application-info {
                margin-top: 20px;
            }
        </style>

        <iron-ajax id="ironAjaxGetApplication" headers="[[ _headers ]]" on-error="_onApplicationError" on-response="_onApplicationResponse"></iron-ajax>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">

                <div class="resource-header">
                    <iron-image class="application-icon" src="[[ application.icon_url ]]" alt="[[ application.title ]]" sizing="cover"></iron-image>
                </div>

                <div class="resource-content">
                    <p class="application-title">[[ application.title ]]</p>

                    <appsco-oauth-application-info o-auth-application="[[ application ]]" display-copy-values-only=""></appsco-oauth-application-info>
                </div>
                
                <div class="resource-actions flex-horizontal">
                    <paper-button class="button danger-button flex" on-tap="_onRemoveApplication">
                        Remove
                    </paper-button>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <neon-animated-pages class="flex" selected="{{ _selected }}" attr-for-selected="name" on-neon-animation-finish="_onPageAnimationFinish">

                        <appsco-manage-oauth-application-components-page id="appscoManageApplicationComponentsPage" name="appsco-application-components-page" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" certificates-api="[[ _certificatesApi ]]" api-errors="[[ apiErrors ]]" on-manage-application-settings="_onManageApplicationSettings" on-manage-application-certificates="_onManageApplicationCertificates" on-manage-groups="_onManageGroups" on-list-loaded="_onPageLoaded" on-list-empty="_onPageLoaded">
                        </appsco-manage-oauth-application-components-page>

                        <appsco-oauth-application-settings-page name="appsco-application-settings-page" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-oauth-application-updated="_onApplicationUpdated" on-back="_onInnerPageClosed"></appsco-oauth-application-settings-page>

                        <appsco-oauth-application-certificates-page id="appscoOAuthApplicationCertificatesPage" name="appsco-application-certificates-page" application="[[ application ]]" authorization-token="[[ authorizationToken ]]" certificates-api="[[ _certificatesApi ]]" on-add-oauth-application-certificate="_onAddOAuthApplicationCertificateAction" on-remove-oauth-application-certificate="_onRemoveOAuthApplicationCertificateAction" api-errors="[[ apiErrors ]]" on-oauth-application-updated="_onApplicationUpdated" on-back="_onInnerPageClosed"></appsco-oauth-application-certificates-page>
                    </neon-animated-pages>
                </div>

            </div>
        </appsco-content>

        <appsco-add-oauth-application-certificate id="appscoAddOauthApplicationCertificate" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-oauth-application-certificate-added="_onOauthApplicationCertificateAdded">
        </appsco-add-oauth-application-certificate>

        <appsco-remove-oauth-application-certificate id="appscoRemoveCertificate" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-oauth-application-certificate-removed="_onOAuthApplicationCertificateRemoved">
        </appsco-remove-oauth-application-certificate>

        <appsco-remove-oauth-application id="appscoRemoveOAuthApplication" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]">
        </appsco-remove-oauth-application>
`;
    }

    static get is() { return 'appsco-manage-oauth-application-page'; }

    static get properties() {
        return {
            route: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            application: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            oauthApplicationsApi: {
                type: String
            },

            uploadOAuthApplicationIconApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _certificatesApi: {
                type: String,
                computed: '_computeCertificatesApi(application)'
            },

            _selected: {
                type: String,
                value: 'appsco-application-components-page',
                notify: true
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
            '_updateScreen(mediumScreen, tabletScreen, mobileScreen)',
            '_onOAuthApplicationsApiChanged(oauthApplicationsApi)'
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
            this._getApplication();
        });
    }

    /*on-remove-oauth-application="_onRemoveOAuthApplicationAction"
    on-add-oauth-application-certificate="_onAddOAuthApplicationCertificateAction"
    on-remove-oauth-application-certificate="_onRemoveOAuthApplicationCertificateAction"
    on-oauth-application-updated="_onOAuthApplicationUpdated"*/

    resetPage() {
        this._showApplicationComponentsPage();
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    setApplication(application) {
        this.set('application', application);
    }

    reloadCertificates() {
        this.$.appscoManageApplicationComponentsPage.reloadCertificates();
        this.$.appscoOAuthApplicationCertificatesPage.reloadCertificates();
    }

    _updateScreen(medium, tablet, mobile) {
        this.updateStyles();

        if (mobile) {
            this.$.appscoContent.hideSection('resource');
        }
        else if(!this.$.appscoContent.resourceActive) {
            this.$.appscoContent.showSection('resource');
        }
    }

    _computeCertificatesApi(application) {
        return application.self ? (application.self + '/certificates') : null;
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _getApplication() {
        if (!this.application.self && this.oauthApplicationsApi && this._headers) {
            this.$.ironAjaxGetApplication.url = this.oauthApplicationsApi + this.route.path;
            this.$.ironAjaxGetApplication.generateRequest();
        }
    }

    _showApplicationComponentsPage() {
        this._selected = 'appsco-application-components-page';
    }

    _onOAuthApplicationsApiChanged(api) {
        if (api) {
            this._getApplication();
        }
    }

    _onApplicationError() {
        this.dispatchEvent(new CustomEvent('page-error', { bubbles: true, composed: true }));
    }

    _onApplicationResponse(event) {
        this.set('application', event.detail.response);
    }

    _onManageApplicationSettings() {
        this._selected = 'appsco-application-settings-page';
    }

    _onManageApplicationCertificates() {
        this._selected = 'appsco-application-certificates-page';
    }

    _onApplicationUpdated(event) {
        this.set('application', event.detail.application);
        this._showApplicationComponentsPage();
    }

    _onInnerPageClosed() {
        this._showApplicationComponentsPage();
    }

    _onRemoveApplication() {
        const dialog = this.shadowRoot.getElementById('appscoRemoveOAuthApplication');
        dialog.setApplication(this.application);
        dialog.open();
    }

    _onPageAnimationFinish(event) {
        const toPage = event.detail.toPage;

        if('appsco-application-settings-page' === toPage.getAttribute('name')) {
            toPage.setPage();
        }
    }

    _onAddOAuthApplicationCertificateAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoAddOauthApplicationCertificate');
        dialog.setApplication(event.detail.application);
        dialog.open();
    }

    _onOauthApplicationCertificateAdded(event) {
        this.reloadCertificates();
        this._notify('Certificate for OAuth application ' + event.detail.application.title + ' has been successfully added.');
    }

    _onRemoveOAuthApplicationCertificateAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoRemoveCertificate');
        dialog.setCertificate(event.detail.certificate);
        dialog.open();
    }

    _onOAuthApplicationCertificateRemoved() {
        this.reloadCertificates();
        this._notify('OAuth application certificate has been successfully removed.');
    }
}
window.customElements.define(AppscoManageOauthApplicationPage.is, AppscoManageOauthApplicationPage);
