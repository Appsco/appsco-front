import '@polymer/polymer/polymer-legacy.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import './lib/mixins/appsco-headers-mixin.js';
import './appsco-app-header.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { AppscoBehaviourExportReport } from './components/components/appsco-behavior-export-report.js';

class AppscoApp extends mixinBehaviors([
    AppscoBehaviourExportReport,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        
        ${this.headerTemplate}
        
        <app-drawer-layout fullbleed="" force-narrow="">

             <!--Drawer content -->
            <app-drawer slot="drawer" id="appDrawer">
                ${this.menuTemplate}
            </app-drawer>

            <!-- Main content -->
            <app-header-layout has-scrolling-region="">

                <app-header slot="header">
                    <app-toolbar class="flex-horizontal">
                        <paper-icon-button id="menuBurger" icon="menu" drawer-toggle=""></paper-icon-button>
                        <div class="page-title" condense-title="">[[ _pageName ]]</div>

                        <neon-animated-pages id="animatedActions" class="actions flex flex-end" selected="[[page]]" attr-for-selected="name" on-neon-animation-finish="_onPageActionsAnimationFinish">
                            ${this.toolbarsTemplate}                            
                        </neon-animated-pages>
                    </app-toolbar>
                </app-header>

                <paper-progress id="pageProgress" indeterminate=""></paper-progress>

                <neon-animated-pages class="pages" selected="[[page]]" attr-for-selected="name" fallback-selection="404" role="main" on-neon-animation-finish="_onPageAnimationFinish">
                    ${this.pagesTemplate}
                </neon-animated-pages>
            </app-header-layout>
        </app-drawer-layout>

        <appsco-company-notice id="appscoCompanyNotice" disable-upgrade></appsco-company-notice>

        <appsco-role-save-client-data account="[[ account ]]" save-api="[[ api.saveClientDataApi ]]" authorization-token="[[ authorizationToken ]]" delay="1000">
        </appsco-role-save-client-data>

        <!--endRegion Shared-->

        <iron-ajax id="getPageConfigRequest" url="[[ api.pageConfigApi ]]" on-response="_onGetPageConfig" headers="[[ _headers ]]"></iron-ajax>

        <iron-ajax id="getCompaniesAccountIsContactIn" url="[[ api.companiesAccountIsContactInApi ]]" on-response="_onGetCompaniesAccountIsContactInApiResponse" headers="[[ _headers ]]"></iron-ajax>

        <iron-ajax id="getIsUserLoggedIn" url="[[ api.isUserLoggedInApi ]]" headers="[[ _headers ]]" handle-as="json" on-response="_onGetIsUserLoggedInResponse" on-error="_onIsUserLoggedInError"></iron-ajax>

        <iron-ajax id="checkNewNotifications" url="[[ api.checkNewNotifications ]]" headers="[[ _headers ]]" handle-as="json" on-response="_onCheckNewNotificationsResponse"></iron-ajax>

        <iron-ajax id="notificationsSeen" method="PUT" url="[[ api.notificationsSeen ]]" headers="[[ _headers ]]" handle-as="json"></iron-ajax>

        <iron-ajax id="getDashboardsLink" url="[[ api.dashboards ]]?extended=1" on-response="_onDashboardsResponse" headers="[[ _headers ]]"></iron-ajax>
`;
    }

    static get headerTemplate() {
        return html `        <style include="appsco-app-header"></style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <appsco-api 
            id="api" 
            domain="[[ domain ]]" 
            index="" name="{{ api }}">
        </appsco-api>
        <appsco-api-errors language="[[ language ]]" name="{{ _apiErrors }}"></appsco-api-errors>

        <iron-ajax id="getAccountRequest" url="[[ api.me ]]" on-response="_onGetAccountResponse" on-error="_onGetAccountError" headers="[[ _headers ]]">
        </iron-ajax>

        <template is="dom-if" if="[[ !link.self ]]">
            <iron-ajax auto="" url="[[ api.link ]]" on-response="_onLinkResponse" headers="[[ _headers ]]">
            </iron-ajax>
        </template>

        <template is="dom-if" if="[[ !item.self ]]">
            <iron-ajax auto="" url="[[ api.item ]]" on-response="_onItemResponse" headers="[[ _headers ]]">
            </iron-ajax>
        </template>

        <app-location route="{{route}}"></app-location>
        <app-route route="{{route}}" pattern="[[_prefixPath]]/:page" data="{{routeData}}" tail="{{subroute}}"></app-route>

        <paper-toast id="toast" text="[[ _toastMessage ]]" on-iron-overlay-closed="_onToastMessageClosed">

            <template is="dom-if" if="[[ _toastPersistence ]]">
                <paper-icon-button icon="icons:close" class="toast-close-action" on-tap="_onCloseToastAction"></paper-icon-button>
            </template>
        </paper-toast>

        <appsco-header
            id="appscoHeader"
            account="[[ account ]]"
            brand-logo="[[ _brandLogo ]]"
            brand-logo-clickable="[[ _brandLogoClickable ]]"
            brand-logo-width="38"
            brand-logo-height="32"
            brand-title="[[ _brandTitle ]]"
            authorization-token="[[ authorizationToken ]]"
            notifications-api="[[ api.notifications ]]"
            logout-api="[[ api.logout ]]"
            register-business-url="[[ api.registerBusinessURL ]]"
            notifications-size="5"
            product-business="[[ _companiesAccountHasPermissionTo ]]"
            product-partner="[[ account.partner ]]"
            domain="{{ domain }}"
            tutorial-action-available="[[ _tutorialsPageVisible ]]"
            is-on-personal-page="[[ _personalPage ]]" 
            on-brand-action="_onBrandAction"
            on-appsco-product-changed="_onAppscoProductChangeAction"
            on-account-chat="_onAccountChat"
            on-account-settings="_onAccountSettingsAction"
            on-all-notifications="_onAllNotifications"
            on-account-logout="_onAccountLogout"
            on-get-started="_onGetStarted">            
        </appsco-header>

        <appsco-tutorial 
            id="appscoTutorial" 
            tutorials-api="[[ api.tutorialsApi ]]" 
            authorization-token="[[ authorizationToken ]]" 
            tutorials="{{ _tutorials }}" 
            directory-page-loaded="[[ _directoryPageLoaded ]]" 
            resources-page-loaded="[[ _resourcesPageLoaded ]]" 
            company-domains-loaded="[[ _companyDomainsLoaded ]]" 
            resource-share-accounts-loaded="[[ shareResourceDialogAccountsLoaded ]]" 
            current-page="[[ page ]]" 
            tutorial-response="[[ tutorialResponse ]]"
            on-tutorial-progress-changed="onTutorialProgressChanged">
        </appsco-tutorial>`;
    }

    static get menuTemplate() {
        return html`                
            <iron-selector selected="[[ page ]]" attr-for-selected="name" class="drawer-list" role="navigation" on-iron-select="_onMenuItemSelected" id="menuContainer">
                <template is="dom-if" if="[[ !_companyPage ]]">
                    <a name="home" href="#">
                        <iron-icon icon="icons:home"></iron-icon> <span class="menu-text">Home</span>
                    </a>
                </template>

                <template is="dom-if" if="[[ _companyPage ]]">
                    <template is="dom-if" if="[[ _companyUser ]]">
                        <template is="dom-if" if="[[ _tutorialsPageVisible ]]">
                            <a name="get-started" href="#">
                                <iron-icon icon="icons:help"></iron-icon>
                                <span class="menu-text">Get started - [[ _progress ]]%
                                </span>
                            </a>
                        </template>
                        <a name="company-home" href="#">
                            <iron-icon icon="icons:apps"></iron-icon> <span class="menu-text">Dashboard</span>
                        </a>
                        <template is="dom-if" if="[[ _companyAdmin ]]">
                            <div class="section">
                                <span class="menu-text">Administration</span>
                            </div>
                            <a name="resources" href="#">
                                <iron-icon icon="icons:list"></iron-icon> <span class="menu-text" id="menuCompanyResourcesText">Resources</span>
                            </a>
                            <a name="directory" href="#">
                                <iron-icon icon="icons:social:person"></iron-icon> <span class="menu-text" id="menuCompanyDirectoryText">Directory</span>
                            </a>
                            <a name="contacts" href="#">
                                <iron-icon icon="icons:perm-contact-calendar"></iron-icon> <span class="menu-text">Contacts</span>
                            </a>
                            <a name="groups" href="#">
                                <iron-icon icon="icons:supervisor-account"></iron-icon> <span class="menu-text">Groups</span>
                            </a>
                            <template is="dom-if" if="[[ _isCompanyPackagePremium ]]">
                                <a name="provisioning" href="#">
                                    <iron-icon icon="icons:compare-arrows"></iron-icon> <span class="menu-text" id="menuProvisioningText">Provisioning</span>
                                </a>
                                <a name="licences" href="#">
                                    <iron-icon icon="icons:assignment"></iron-icon> <span class="menu-text">Licences</span>
                                </a>
                            </template>
                            <div class="section">
                                <span class="menu-text">Management</span>
                            </div>
                            <a name="provisioning-log" href="#">
                                <iron-icon icon="icons:compare-arrows"></iron-icon> <span class="menu-text">Provisioning Log</span>
                            </a>
                            <a name="audit-log" href="#">
                                <iron-icon icon="icons:reorder"></iron-icon> <span class="menu-text">Audit</span>
                            </a>
                            <template is="dom-if" if="[[ _isCompanyPackagePremium ]]">
                                <a name="access-on-boarding" href="#">
                                    <iron-icon icon="icons:accessibility"></iron-icon> <span class="menu-text">Access Tasks</span>
                                </a>
                            </template>
                            <a name="statistics" href="#">
                                <iron-icon icon="icons:donut-large"></iron-icon> <span class="menu-text">Statistics</span>
                            </a>
                            <template is="dom-if" if="[[ _isCompanyPackagePremium ]]">
                                <a name="reports" href="#">
                                    <iron-icon icon="icons:description"></iron-icon>
                                    <span class="menu-text">Reports</span>
                                </a>
                            </template>
                            <template is="dom-if" if="[[ _accessBilling ]]">
                                <a name="billing" href="#">
                                    <iron-icon icon="icons:payment"></iron-icon> <span class="menu-text">Billing</span>
                                </a>
                            </template>
                            <a name="company" href="#" id="menuCompanySettings">
                                <iron-icon icon="icons:settings"></iron-icon> <span class="menu-text" id="menuCompanySettingsText">Settings</span>
                            </a>

                            <template is="dom-if" if="[[ currentCompany.company.is_partner ]]">
                                <div class="section">
                                    <span class="menu-text">Partner</span>
                                </div>
                                <a name="customers" href="#">
                                    <iron-icon icon="icons:social:domain"></iron-icon> <span class="menu-text">Customers</span>
                                </a>
                                <a name="customer-billing" href="#">
                                    <iron-icon icon="icons:payment"></iron-icon> <span class="menu-text">Customer Billing</span>
                                </a>
                                <a name="billing-report" href="#">
                                    <iron-icon icon="icons:description"></iron-icon><span class="menu-text">Billing Report</span>
                                </a>

                            </template>
                            <template is="dom-if" if="[[ _isCompanyPackagePremium ]]">
                                <div class="section">
                                    <span class="menu-text">Advanced</span>
                                </div>
                                <a name="oauth-applications" href="#">
                                    <iron-icon icon="device:widgets"></iron-icon> <span class="menu-text">OAuth applications</span>
                                </a>
                                <a name="policies" href="#">
                                    <iron-icon icon="icons:verified-user"></iron-icon> <span class="menu-text">Policies</span>
                                </a>
                            </template>
                        </template>

                        <template is="dom-if" if="[[ _resourceAdmin ]]">
                            <div class="section">
                                <span class="menu-text">Administration</span>
                            </div>
                            <a name="resources" href="#">
                                <iron-icon icon="icons:list"></iron-icon> <span class="menu-text">Resources</span>
                            </a>
                        </template>
                    </template>
                    <template is="dom-if" if="[[ _companyContact ]]">
                        <a name="contact-home" href="#">
                            <iron-icon icon="icons:apps"></iron-icon> <span class="menu-text">Dashboard</span>
                        </a>
                    </template>
                </template>
            </iron-selector>`;
    }

    static get toolbarsTemplate() {
        return html`
            <appsco-home-page-actions id="appscoHomePageActions" name="home" account="[[ account ]]" authorization-token="[[ authorizationToken ]]" page-config-api="[[ api.pageConfigApi ]]" page-config="[[ _pageConfig ]]" page="[[ page ]]" api-errors="[[ _apiErrors ]]">
            </appsco-home-page-actions>

            <appsco-groups-page-actions id="appscoGroupsPageActions" name="groups" authorization-token="[[ authorizationToken ]]">
            </appsco-groups-page-actions>

            <appsco-resource-page-actions id="appscoApplicationPageActions" name="resource" on-back="_showHomePage">
            </appsco-resource-page-actions>

            <appsco-account-page-actions id="appscoAccountPageActions" name="account" on-back="_onBackFromAccountAction">
            </appsco-account-page-actions>

            <appsco-company-account-page-actions id="appscoCompanyAccountPageActions" name="company-account" on-back="_onBackFromAccountAction">
            </appsco-company-account-page-actions>

            <appsco-upgrade-page-actions
                name="upgrade"
                authorization-token="[[ authorizationToken ]]"
                on-toggle-pricing="_onUpgradeTogglePricing">
            </appsco-upgrade-page-actions>

            <appsco-company-home-page-actions id="appscoCompanyHomePageActions" name="company-home" authorization-token="[[ authorizationToken ]]" page-config-api="[[ api.pageConfigApi ]]" page-config="[[ _pageConfig ]]" page="[[ page ]]" api-errors="[[ _apiErrors ]]">
            </appsco-company-home-page-actions>

            <appsco-contact-home-page-actions id="appscoContactHomePageActions" name="contact-home" authorization-token="[[ authorizationToken ]]" page-config-api="[[ api.pageConfigApi ]]" page-config="[[ _pageConfig ]]" page="[[ page ]]" api-errors="[[ _apiErrors ]]">
            </appsco-contact-home-page-actions>

            <appsco-resources-page-actions id="appscoResourcesPageActions" name="resources" authorization-token="[[ authorizationToken ]]" filter-api="[[ api.dashboards ]]?extended=1" page-config-api="[[ api.pageConfigApi ]]" page-config="[[ _pageConfig ]]" page="[[ page ]]" api-errors="[[ _apiErrors ]]" resource-admin="[[ _resourceAdmin ]]">
            </appsco-resources-page-actions>

            <appsco-manage-resource-page-actions
                id="appscoManageApplicationPageActions"
                name="manage-resource"
                advanced-actions\$="[[ !_resourceAdmin ]] "
                on-back="_showCompanyResourcesPage">
            </appsco-manage-resource-page-actions>

            <appsco-directory-page-actions id="appscoDirectoryPageActions" name="directory" on-manage-domains="_onManageDomains" authorization-token="[[ authorizationToken ]]">
            </appsco-directory-page-actions>

            <appsco-manage-account-page-actions
                id="appscoManageAccountPageActions"
                name="manage-account"
                advanced-actions=""
                on-back="_showCompanyDirectoryPage">
            </appsco-manage-account-page-actions>

            <appsco-licences-page-actions id="appscoLicencesPageActions" name="licences">
            </appsco-licences-page-actions>

            <appsco-contacts-page-actions id="appscoContactsPageActions" name="contacts">
            </appsco-contacts-page-actions>

            <appsco-manage-contact-page-actions id="appscoManageContactPageActions" name="manage-contact" on-back="_showContactsPage">
            </appsco-manage-contact-page-actions>

            <appsco-manage-customer-page-actions id="appscoManageCustomerPageActions" name="manage-customer" on-back="_showCustomersPage">
            </appsco-manage-customer-page-actions>

            <appsco-manage-group-page-actions id="appscoManageGroupPageActions" name="manage-group" on-back="_showGroupsPage">
            </appsco-manage-group-page-actions>

            <appsco-manage-integration-page-actions name="manage-integration" on-back="_showCompanyProvisioningPage">
            </appsco-manage-integration-page-actions>

            <appsco-customers-page-actions id="appscoCustomersPageActions" name="customers">
            </appsco-customers-page-actions>

            <appsco-provisioning-log-page-actions id="appscoProvisioningLogPageActions" name="provisioning-log">
            </appsco-provisioning-log-page-actions>
            
            <appsco-audit-log-page-actions id="appscoAuditLogPageActions" name="audit-log">
            </appsco-audit-log-page-actions>

            <appsco-access-on-boarding-page-actions id="appscoAccessOnBoardingPageActions" name="access-on-boarding">
            </appsco-access-on-boarding-page-actions>

            <appsco-billing-page-actions id="appscoBillingPageActions" name="billing">
            </appsco-billing-page-actions>

            <appsco-company-page-actions id="appscoCompanyPageActions" name="company">
            </appsco-company-page-actions>

            <appsco-reports-page-actions id="appscoReportsPageActions" name="reports">
            </appsco-reports-page-actions>

            <appsco-access-report-page-actions id="appscoAccessReportPageActions" name="access-report" on-back="_showReportsPage">
            </appsco-access-report-page-actions>

            <appsco-compliance-report-page-actions id="appscoComplianceReportPageActions" name="compliance-report" on-back="_showReportsPage">
            </appsco-compliance-report-page-actions>

            <appsco-billing-report-page-actions
                id="appscoBillingReportPageActions"
                name="billing-report">
            </appsco-billing-report-page-actions>

            <appsco-provisioning-page-actions id="appscoProvisioningPageActions" name="provisioning">
            </appsco-provisioning-page-actions>

            <appsco-oauth-applications-page-actions id="appscoOAuthApplicationsPageActions" name="oauth-applications">
            </appsco-oauth-applications-page-actions>

            <appsco-manage-oauth-application-page-actions id="appscoManageOAuthApplicationPageActions" name="manage-oauth-application" on-back="_showOAuthApplicationsPage">
            </appsco-manage-oauth-application-page-actions>

            <appsco-dashboard-folder-page-actions id="appscoDashboardFolderPageActions" name="dashboard-folder" on-back="_backFromFolderPage">
            </appsco-dashboard-folder-page-actions>

            <appsco-policies-page-actions id="appscoPoliciesPageActions" name="policies">
            </appsco-policies-page-actions>

            <appsco-policy-report-page-actions id="appscoPolicyReportPageActions" name="policies-report" on-back="_showReportsPage">
            </appsco-policy-report-page-actions>

            <appsco-additional-options-page-actions id="appscoAdditionalOptionsPageActions" name="additional-options" on-back="_showCompanyResourcesPage">
            </appsco-additional-options-page-actions>
        `;
    }

    static get pagesTemplate() {
        return html`
            <appsco-home-page name="home" page=""
                id="appscoHomePage"
                application="{{ application }}"
                account="[[ account ]]"
                application-log="[[ application.meta.log ]]"
                authorization-token="[[ authorizationToken ]]"
                applications-api="[[ _applicationsApi ]]"
                folders-api="[[ api.foldersApi ]]"
                dashboard-api="[[ _addAppApi ]]"
                page-config="[[ _pageConfig ]]"
                api-errors="[[ _apiErrors ]]"
                accounts-api="[[ api.accounts ]]"
                domain="[[ domain ]]"
                item="[[ _copyObject(item) ]]"
                toolbar="[[ \$.appscoHomePageActions ]]"
                applications-template-api="[[ api.applicationTemplates ]]"
                icons-api="[[ api.icons ]]"
                personal-items-api="[[ api.personalItems ]]"
                shared-with-me-items-api="[[ api.sharedWithMeItems ]]"
                company-icons-without-folder-api="[[ _companyIconsWithoutFolderApi ]]"
                labels="[[ _applicationLabels ]]"
                on-loaded="_onLoadedPage"
                on-folder-tapped="_onFolderTapped"
                on-application-shared="_onApplicationShared"
                on-application-settings-saved="_onApplicationSettingsSaved"
                on-application-settings-no-changes="_onApplicationSettingsNoChanges"
                on-applications-removed="_onApplicationsRemovedFromHomePage">
            </appsco-home-page>

            <appsco-resource-page name="resource" page=""
                id="appscoApplicationPage"
                route="[[ subroute ]]"
                company="[[ _companyPage ]]"
                application="{{ application }}"
                applications-api="[[ _applicationsApi ]]"
                icons-api="[[ api.icons ]]"
                application-log="[[ application.meta.log ]]"
                authorization-token="[[ authorizationToken ]]"
                accounts-api="[[ api.accounts ]]"
                account="{{ account }}"
                toolbar="[[ \$.appscoApplicationPageActions ]]"
                on-application-shared="_onApplicationShared"
                on-application-removed="_onApplicationRemoved"
                on-subscription-revoked="_onSubscriptionRevoked"
                on-application-settings-saved="_onApplicationSettingsSaved"
                on-application-settings-no-changes="_onApplicationSettingsNoChanges"
                on-autologin-changed="_onAutologinChanged"
                on-resource-image-changed="_onResourceImageChanged"
                on-page-error="_onError"
                on-image-upload-error="_onImageUploadError">
            </appsco-resource-page>

            <appsco-account-page name="account" page="" id="appscoAccountPage" account="{{ account }}" authorization-token="[[ authorizationToken ]]" notifications-api="[[ api.notifications ]]" authorized-apps-api="[[ api.authorizedApps ]]" log-api="[[ api.accountLog ]]" two-fa-api="[[ api.twoFA ]]" two-fa-qr-api="[[ api.twoFAQr ]]" two-fa-codes-api="[[ api.twoFACodes ]]" settings-api="[[ api.me ]]" image-settings-api="[[ api.profileImage ]]" change-password-api="[[ api.changePassword ]]" application-template-api="[[ api.applicationTemplates ]]" api-errors="[[ _apiErrors ]]" remove-account-api="[[ api.removeAccount ]]" logout-api="[[ api.logout ]]" account-managed="[[ _accountManaged ]]" toolbar="[[ \$.appscoAccountPageActions ]]" on-twofa-disabled="_onTwoFaDisabled" on-application-revoked="_onAuthorizedApplicationRevoked" on-import-finished="_onImportPersonalResourcesFinished" on-settings-saved="_onAccountSettingsSaved" on-password-changed="_onAccountPasswordChanged" on-image-upload-error="_onImageUploadError">
            </appsco-account-page>

            <appsco-company-account-page name="company-account" page="" company-page="" id="appscoCompanyAccountPage" account="{{ account }}" authorization-token="[[ authorizationToken ]]" notifications-api="[[ api.notifications ]]" authorized-apps-api="[[ api.authorizedApps ]]" log-api="[[ api.accountLog ]]" two-fa-enforced="[[ currentCompany.company.enforced_2fa ]]" two-fa-api="[[ api.twoFA ]]" two-fa-qr-api="[[ api.twoFAQr ]]" two-fa-codes-api="[[ api.twoFACodes ]]" settings-api="[[ api.me ]]" image-settings-api="[[ api.profileImage ]]" change-password-api="[[ api.changePassword ]]" application-template-api="[[ api.applicationTemplates ]]" api-errors="[[ _apiErrors ]]" toolbar="[[ \$.appscoCompanyAccountPageActions ]]" on-import-finished="_onImportPersonalResourcesFinished" on-twofa-disabled="_onTwoFaDisabled" on-application-revoked="_onAuthorizedApplicationRevoked" on-settings-saved="_onAccountSettingsSaved" on-password-changed="_onAccountPasswordChanged" on-image-upload-error="_onImageUploadError">
            </appsco-company-account-page>

            <appsco-trybusiness-page name="trybusiness" page=""
                id="appscoUpgradePage"
                authorization-token="[[ authorizationToken ]]"
                company-upgrade-api="[[ api.upgradeToBusiness ]]"
                on-upgraded="_upgradedToBusiness"
                on-upgrade-failed="_onUpgradeToCompanyFailed">
            </appsco-trybusiness-page>

            <appsco-company-home-page name="company-home" page="" company-page=""
                id="appscoCompanyHomePage"
                authorization-token="[[ authorizationToken ]]"
                applications-api="[[ _companyIconsWithoutFolderApi ]]"
                folders-api="[[ api.foldersApi ]]"
                company-folders-api="[[ _companyFoldersApi ]]"
                netscaler-api="[[ _companyNetscalerFeatureApi ]]"
                accounts-api="[[ api.accounts ]]"
                account="[[ account ]]"
                domain="[[ domain ]]"
                api-errors="[[ _apiErrors ]]"
                page-config="[[ _pageConfig ]]"
                company="{{ currentCompany.company }}"
                toolbar="[[ \$.appscoCompanyHomePageActions ]]"
                on-loaded="_onLoadedPage"
                on-folder-tapped="_onFolderTapped"
                on-application-shared="_onApplicationShared"
                on-application-settings-saved="_onApplicationSettingsSaved">
            </appsco-company-home-page>

            <appsco-contact-home-page name="contact-home" page="" company-page="" id="appscoContactHomePage" authorization-token="[[ authorizationToken ]]" applications-api="[[ _contactIconsApi ]]" page-config="[[ _pageConfig ]]" account="[[ account ]]" toolbar="[[ \$.appscoContactHomePageActions ]]" on-loaded="_onLoadedPage" on-application-shared="_onApplicationShared">
            </appsco-contact-home-page>

             <appsco-resources-page name="resources" page="" company-page=""
                 id="appscoResourcesPage"
                 resource="{{ _companyApplication }}"
                 account="[[ account ]]"
                 application-log="[[ _companyApplication.meta.log ]]"
                 authorization-token="[[ authorizationToken ]]"
                 company-resources-api="[[ _companyApplicationsApi ]]"
                 company-applications-api="[[ _companyApplicationsApi ]]"
                 company-roles-api="[[ _companyRolesApi ]]"
                 company-contacts-api="[[ _companyContactsApi ]]"
                 company-import-resources-api="[[ _companyImportResourcesApi ]]"
                 groups-api="[[ _companyGroupsApi ]]"
                 company-api="[[ _companyApi ]]"
                 applications-template-api="[[ api.applicationTemplates ]]"
                 item="[[ _copyObject(item) ]]"
                 link="[[ _copyObject(link) ]]"
                 domain="[[ domain ]]"
                 api-errors="[[ _apiErrors ]]"
                 resource-admin="[[ _resourceAdmin ]]"
                 page-config="[[ _pageConfig ]]"
                 get-company-idp-config-list-api="[[ _getCompanyIdpConfigListApi ]]"
                 toolbar="[[ \$.appscoResourcesPageActions ]]"
                 on-applications-removed="_onApplicationsRemoved"
                 on-resources-shared="_onResourcesShared"
                 on-import-finished="_onImportCompanyResourcesFinished"
                 on-application-settings-saved="_onApplicationSettingsSaved"
                 on-list-loaded="_onLoadedPage"
                 on-observable-list-empty="_onObservableListEmpty"
                 on-observable-list-filled="_onObservableListFilled"
                 on-page-loaded="_onResourcesPageLoaded"
                 on-load-forbidden="_onResourcesLoadForbidden"
                 on-edit-additional-options="_onEditAdditionalOptionsAction"
                 on-share-items-loaded-changed="onShareResourceDialogAccountsLoadedChanged">
             </appsco-resources-page>

            <appsco-manage-resource-page name="manage-resource" page="" company-page=""
                id="appscoManageApplicationPage"
                route="[[ subroute ]]"
                application="{{ _companyApplication }}"
                company-api="[[ _companyApi ]]"
                company-idp-saml-metadata-api="[[ _companySamlMetadataApi ]]"
                company-contacts-api="[[ _companyContactsApi ]]"
                company-roles-api="[[ _companyRolesApi ]]"
                company-groups-api="[[ _companyGroupsApi ]]"
                domain="[[ domain ]]"
                application-log="[[ _companyApplication.meta.log ]]"
                authorization-token="[[ authorizationToken ]]"
                accounts-api="[[ api.accounts ]]"
                account="{{ account }}"
                api-errors="[[ _apiErrors ]]"
                resource-admin="[[ _resourceAdmin ]]"
                toolbar="[[ \$.appscoManageApplicationPageActions ]]"
                on-applications-removed="_onApplicationsRemoved"
                on-resources-shared="_onResourcesShared"
                on-access-revoked="_onAssigneeAccessRevoked"
                on-application-removed-from-group="_onApplicationRemovedFromGroup"
                on-resource-admin-added="_onResourceAdminAdded"
                on-resource-admin-revoked="_onResourceAdminRevoked"
                on-claims-changed="_onAssigneeClaimsChanged"
                on-application-settings-saved="_onApplicationSettingsSaved"
                on-page-error="_onError"
                on-resource-image-changed="_onResourceImageChanged"
                on-image-upload-error="_onImageUploadError">
            </appsco-manage-resource-page>

            <appsco-directory-page
                name="directory"
                page=""
                company-page=""
                id="appscoDirectoryPage"
                role="{{ _role }}"
                authorization-token="[[ authorizationToken ]]"
                company-invitations-api="[[ _companyInvitationsApi ]]"
                company-directory-roles-api="[[ _companyRolesApi ]]"
                company-directory-summary-api="[[ _companyDirectorySummaryApi ]]"
                company-orgunits-api="[[ _companyOrgunitsApi ]]"
                company-subscription-api="[[ _companySubscriptionApi ]]"
                domains-api="[[ _companyDomainsApi ]]"
                groups-api="[[ _companyGroupsApi ]]"
                company-notifications-api="[[ _companyNotificationsApi ]]"
                company-contacts-api="[[ _companyContactsApi ]]"
                company-import-accounts-api="[[ _companyImportAccountsApi ]]"
                company-api="[[ _companyApi ]]"
                api-errors="[[ _apiErrors ]]"
                domain="[[ domain ]]"
                toolbar="[[ \$.appscoDirectoryPageActions ]]"
                on-added-to-orgunit="_onAccountsAddedToOrgunit"
                on-accounts-removed="_onAccountsRemoved"
                on-import-finished="_onAccountImportFinished"
                on-orgunit-added="_onOrgunitChanged"
                on-orgunit-modified="_onOrgunitChanged"
                on-orgunit-removed="_onOrgunitChanged"
                on-edit-account="_onEditAccount"
                on-info-edit-account="_onEditAccount"
                on-group-added="_onGroupAdded"
                on-observable-list-empty="_onObservableListEmpty"
                on-observable-list-filled="_onObservableListFilled"
                on-company-subscription-loaded="_onSubscriptionLoaded"
                on-page-loaded="_onDirectoryPageLoaded">
            </appsco-directory-page>

            <template is="dom-if" if="[[ _isCompanyPackagePremium ]]">
                <appsco-licences-page name="licences" page="" company-page=""
                    id="appscoLicencesPage"
                    authorization-token="[[ authorizationToken ]]"
                    company-licences-api="[[ _companyLicencesApi ]]"                                  
                    company-licence-categories-api="[[ _companyLicenceCategoriesApi ]]"
                    company-licences-export-api="[[ _companyLicencesExportApi ]]"
                    company-licences-import-api="[[ _companyLicencesImportApi ]]"
                    customers-api="[[ _companyCustomersApi ]]"
                    api-errors="[[ _apiErrors ]]"                                  
                    toolbar="[[ \$.appscoLicencesPageActions ]]"
                    on-observable-list-empty="_onObservableListEmpty"
                    on-observable-list-filled="_onObservableListFilled">
                </appsco-licences-page>
            </template>
            
            <appsco-contacts-page name="contacts" page="" company-page="" id="appscoContactsPage" authorization-token="[[ authorizationToken ]]" groups-api="[[ _companyGroupsApi ]]" company-invitations-api="[[ _companyInvitationsApi ]]" company-contacts-api="[[ _companyContactsApi ]]" company-api="[[ _companyApi ]]" company-roles-api="[[ _companyRolesApi ]]" company-notifications-api="[[ _companyNotificationsApi ]]" api-errors="[[ _apiErrors ]]" import-contacts-api="[[ _companyImportContactsApi ]]" domain="[[ domain ]]" toolbar="[[ \$.appscoContactsPageActions ]]" on-edit-contact="_onEditContactAction" on-observable-list-empty="_onObservableListEmpty" on-observable-list-filled="_onObservableListFilled">
            </appsco-contacts-page>

            <appsco-customers-page name="customers" page="" company-page=""
                id="appscoCustomersPage"
                customers-api="[[ _companyCustomersApi ]]"
                customers-export-api="[[ _companyCustomersExportApi ]]"
                customers-import-api="[[ _importCustomersApi ]]"
                customers-import-resource-api="[[ _importCustomerResourcesApi ]]"
                convert-to-customer-api="[[ _companyConvertToCustomerApi ]]"
                company-roles-api="[[ _companyRolesApi ]]"
                check-if-customer-exists-api="[[ _checkIfCustomerExistsApi ]]"
                authorization-token="[[ authorizationToken ]]"
                add-partner-admin-to-customer-api="[[ _addPartnerAdminToCustomerApi ]]"
                domain="[[ domain ]]"
                api-errors="[[ _apiErrors ]]"
                toolbar="[[ \$.appscoCustomersPageActions ]]"
                on-import-finished="_onCustomersImportFinished"
                on-partner-admins-added="_onPartnerAdminsAdded"
                on-edit-customer="_onEditCustomerAction"
                on-customer-added="_onCustomerAdded"
                on-customers-removed="_onRemovedCustomers"
                on-observable-list-empty="_onObservableListEmpty"
                on-observable-list-filled="_onObservableListFilled">
            </appsco-customers-page>

            <appsco-groups-page name="groups" page="" company-page=""
                id="appscoGroupsPage"
                group="{{ _group }}"
                authorization-token="[[ authorizationToken ]]"
                groups-api="[[ _companyGroupsApi ]]"
                company-api="[[ _companyApi ]]"
                company-notifications-api="[[ _companyNotificationsApi ]]"
                api-errors="[[ _apiErrors ]]"
                toolbar="[[ \$.appscoGroupsPageActions ]]"
                on-group-added="_onGroupAdded"
                on-groups-removed="_onRemovedGroups"
                on-group-renamed="_onGroupRenamed"
                on-edit-item="_onEditCompanyGroupAction"
                on-info-edit-group="_onEditCompanyGroupAction">
            </appsco-groups-page>

            <appsco-manage-account-page name="manage-account" page="" company-page="" id="appscoManageAccountPage" route="[[ subroute ]]" role="{{ _role }}" administrator="[[ account ]]" authorization-token="[[ authorizationToken ]]" company-api="[[ _companyApi ]]" notifications-api="[[ api.notifications ]]" log-api="[[ api.accountLog ]]" two-fa-api="[[ api.twoFA ]]" two-fa-enforced="[[ currentCompany.company.enforced_2fa ]]" settings-api="[[ api.me ]]" image-settings-api="[[ api.profileImage ]]" change-password-api="[[ api.changePassword ]]" company-orgunits-api="[[ _companyOrgunitsApi ]]" company-applications-api="[[ _companyApplicationsApi ]]" api-errors="[[ _apiErrors ]]" toolbar="[[ \$.appscoManageAccountPageActions ]]" on-settings-saved="_onAccountSettingsSaved" on-password-changed="_onCompanyAccountPasswordChanged" on-access-revoked="_onAssigneeAccessRevoked" on-claims-changed="_onAssigneeClaimsChanged" on-added-to-orgunit="_onAccountsAddedToOrgunit" on-account-removed-from-orgunit="_onAccountRemovedFromOrgunit" on-account-removed-from-group="_onAccountRemovedFromGroup" on-resource-admin-revoked="_onResourceAdminRevoked" on-account-role-changed="_onAccountRoleChanged" on-page-error="_onError" on-image-upload-error="_onImageUploadError">
            </appsco-manage-account-page>

            <appsco-manage-contact-page name="manage-contact" page="" company-page="" id="appscoManageContactPage" route="[[ subroute ]]" authorization-token="[[ authorizationToken ]]" contacts-api="[[ _companyContactsApi ]]" toolbar="[[ \$.appscoManageContactPageActions ]]" on-contact-deleted="_onContactDeleted" on-contact-converted="_onContactConverted" on-page-error="_onError" on-access-revoked="_onAssigneeAccessRevoked" on-contact-removed-from-group="_onContactRemovedFromGroup">
            </appsco-manage-contact-page>

            <appsco-manage-customer-page name="manage-customer" page="" company-page="" id="appscoManageCustomerPage" route="[[ subroute ]]" authorization-token="[[ authorizationToken ]]" customers-api="[[ _companyCustomersApi ]]" current-company="[[ currentCompany.company ]]" company-roles-api="[[ _companyRolesApi ]]" add-partner-admin-to-customer-api="[[ _addPartnerAdminToCustomerApi ]]" toolbar="[[ \$.appscoManageCustomerPageActions ]]" api-errors="[[ _apiErrors ]]" on-page-error="_onError" on-partner-admins-added="_onPartnerAdminsAdded" on-customer-removed="_onCustomerRemoved">
            </appsco-manage-customer-page>

             <appsco-manage-group-page name="manage-group" page="" company-page=""
                 id="appscoManageGroupPage"
                 route="[[ subroute ]]"
                 group="{{ _group }}"
                 authorization-token="[[ authorizationToken ]]"
                 group-api="[[ _companyGroupApi ]]"
                 company-applications-api="[[ _companyApplicationsApi ]]"
                 company-roles-api="[[ _companyRolesApi ]]"
                 company-contacts-api="[[ _companyContactsApi ]]"
                 image-settings-api="[[ _companyGroupSettingApi ]]"
                 api-errors="[[ _apiErrors ]]"
                 toolbar="[[ \$.appscoManageGroupPageActions ]]"
                 on-page-error="_onError"
                 on-group-removed="_onGroupRemoved"
                 on-resource-removed-from-group="_onResourceRemovedFromGroup"
                 on-resources-added-to-group="_onResourcesAddedToGroup">
             </appsco-manage-group-page>

            <template is="dom-if" if="[[ _isCompanyPackagePremium ]]">
                <appsco-provisioning-page name="provisioning" page="" company-page="" id="appscoProvisioningPage" active-integrations-api="[[ _getActiveIntegrationsApi ]]" available-integrations-api="[[ _getAvailableIntegrationsApi ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ _apiErrors ]]" toolbar="[[ \$.appscoProvisioningPageActions ]]" on-edit-integration="_onEditIntegrationAction" on-active-integration="_onIntegrationSetup">
                </appsco-provisioning-page>
            </template>

            <appsco-manage-integration-page name="manage-integration" page="" company-page="" id="appscoManageIntegrationPage" route="[[ subroute ]]" integration="[[ _selectedIntegration ]]" integration-api="[[ _companyIntegrationApi ]]" api-errors="[[ _apiErrors ]]" authorization-token="[[ authorizationToken ]]" on-page-error="_onError" on-integration-removed="_onIntegrationRemoved" on-integration-settings-changed="_onIntegrationSettingsChanged">
            </appsco-manage-integration-page>
            
            <appsco-provisioning-integration-authorization-success-page name="provisioning-integration-authorization-success" page="" company-page="" id="appscoProvisioningIntegrationSuccessPage" on-provisioning="_showCompanyProvisioningPage">
            </appsco-provisioning-integration-authorization-success-page>

            <appsco-provisioning-integration-authorization-failed-page name="provisioning-integration-authorization-failed" page="" company-page="" id="appscoProvisioningIntegrationFailedPage" on-provisioning="_showCompanyProvisioningPage">
            </appsco-provisioning-integration-authorization-failed-page>

             <appsco-provisioning-log-page name="provisioning-log" page="" company-page=""
                                    id="appscoProvisioningLogPage"
                                    authorization-token="[[ authorizationToken ]]"
                                    audit-log-api="[[ _companyProvisioningLogApi ]]"
                                    company-api="[[ _companyApi ]]"
                                    toolbar="[[ \$.appscoProvisioningLogPageActions ]]">
             </appsco-provisioning-log-page>
             
            <appsco-audit-log-page name="audit-log" page="" company-page="" 
                id="appscoAuditLogPage" 
                authorization-token="[[ authorizationToken ]]" 
                audit-log-api="[[ _companyAuditLogApi ]]" 
                company-api="[[ _companyApi ]]"
                toolbar="[[ \$.appscoAuditLogPageActions ]]">
            </appsco-audit-log-page>

            <appsco-access-on-boarding-page name="access-on-boarding" page="" company-page="" id="appscoAccessOnBoardingPage" authorization-token="[[ authorizationToken ]]" groups-api="[[ _companyGroupsApi ]]" access-on-boarding-users-api="[[ _accessOnBoardingUsersApi ]]" export-access-on-boarding-api="[[ _exportAccessAccessOnBoardingApi ]]" api-errors="[[ _apiErrors ]]" toolbar="[[ \$.appscoAccessOnBoardingPageActions ]]">
            </appsco-access-on-boarding-page>

             <appsco-get-started-page name="get-started" page="" company-page=""
                 id="appscoGetStartedPage"
                 account="[[ account ]]"
                 authorization-token="[[ authorizationToken ]]"
                 tutorials="[[ _tutorials ]]"
                 on-tutorial-start="_onTutorialStart">
             </appsco-get-started-page>

            <template is="dom-if" if="[[ _isCompanyPackagePremium ]]">
                <appsco-oauth-applications-page name="oauth-applications" page="" company-page="" id="appscoOAuthApplicationsPage" authorization-token="[[ authorizationToken ]]" o-auth-applications-api="[[ _companyOAuthApplicationsApi ]]" current-company="[[ currentCompany.company ]]" toolbar="[[ \$.appscoOAuthApplicationsPageActions ]]" on-edit-oauth-application="_onEditOAuthApplicationAction" on-oauth-application-removed="_onOAuthApplicationRemoved">
                </appsco-oauth-applications-page>
            </template>
            
            <appsco-statistics-page name="statistics" page="" company-page="" id="appscoStatisticsPage" company-api="[[ _companyApi ]]" authorization-token="[[ authorizationToken ]]">
            </appsco-statistics-page>

            <template is="dom-if" if="[[ _isCompanyPackagePremium ]]">
                <appsco-reports-page name="reports" page="" company-page="" id="appscoReportsPage" get-access-report-api="[[ _getAccessReportApi ]]" get-policies-api="[[ _companyPoliciesApi ]]" authorization-token="[[ authorizationToken ]]" api-errors="[[ _apiErrors ]]" toolbar="[[ \$.appscoReportsPageActions ]]" on-open-access-report="_showAccessReportPage" on-open-compliance-report="_showComplianceReportPage" on-open-policies-report="_showPoliciesReportPage">
                </appsco-reports-page>
    
                <appsco-access-report-page name="access-report" page="" company-page="" id="appscoAccessReportPage" authorization-token="[[ authorizationToken ]]" groups-api="[[ _companyGroupsApi ]]" roles-api="[[ _companyRolesApi ]]" contacts-api="[[ _companyContactsApi ]]" export-access-report-api="[[ _exportAccessReportApi ]]" api-errors="[[ _apiErrors ]]" toolbar="[[ \$.appscoAccessReportPageActions ]]">
                </appsco-access-report-page>
    
                <appsco-compliance-report-page name="compliance-report" page="" company-page="" id="appscoComplianceReportPage" authorization-token="[[ authorizationToken ]]" groups-api="[[ _companyGroupsApi ]]" roles-api="[[ _companyRolesApi ]]" contacts-api="[[ _companyContactsApi ]]" export-compliance-report-api="[[ _exportComplianceReportApi ]]" api-errors="[[ _apiErrors ]]" toolbar="[[ \$.appscoComplianceReportPageActions ]]">
                </appsco-compliance-report-page>
            </template>
            
            <appsco-billing-page name="billing" page="" company-page="" id="appscoBillingPage" company-api="[[ _companyApi ]]" account="[[ account ]]" authorization-token="[[ authorizationToken ]]" toolbar="[[ \$.appscoBillingPageActions ]]" current-company="[[ currentCompany.company ]]" on-credit-card-added="_onCreditCardAdded" on-subscription-canceled="_onSubscriptionCanceled" on-subscription-changed="_onSubscriptionChanged" on-subscription-updated="_onSubscriptionUpdated">
            </appsco-billing-page>

            <appsco-company-page name="company" page="" company-page="" id="appscoCompanyPage" company="{{ currentCompany.company }}" account="[[ account ]]" authorization-token="[[ authorizationToken ]]" transfer-token-api="[[ _getTransferTokenApi ]]" partners-api-url="[[ api.partners ]]" send-transfer-token-api="[[ _sendTransferTokenApi ]]" save-ip-white-list-api="[[ _saveIPWhiteListApi ]]" brand-logo="[[ _brandLogo ]]" api-errors="[[ _apiErrors ]]" toolbar="[[ \$.appscoCompanyPageActions ]]" on-domain-added="_onDomainAdded" on-domain-removed="_onDomainRemoved" on-image-upload-error="_onImageUploadError" on-company-settings-changed="_onCompanySettingsChanged" on-company-ip-whitelist-changed="_onCompanyIPWhiteListChanged" on-company-brand-settings-changed="_onCompanyBrandSettingsChanged" on-company-branded-login-changed="_onCompanyBrandedLoginChanged" on-company-logo-changed="_onCompanyLogoChanged" on-company-dashboard-logo-changed="_onCompanyDashboardLogoChanged" on-domain-verified="_onDomainVerified" on-company-domains-loaded="_onCompanyDomainsLoadFinished" on-empty-company-domains-loaded="_onCompanyDomainsLoadFinished">
            </appsco-company-page>

            <template is="dom-if" if="[[ _isCompanyPackagePremium ]]">
                <appsco-manage-oauth-application-page name="manage-oauth-application" page="" company-page="" id="appscoManageOAuthApplicationPage" route="[[ subroute ]]" authorization-token="[[ authorizationToken ]]" oauth-applications-api="[[ _companyOAuthApplicationsApi ]]" api-errors="[[ _apiErrors ]]" toolbar="[[ \$.appscoManageOAuthApplicationPageActions ]]" on-page-error="_onError" on-resource-image-changed="_onResourceImageChanged" on-image-upload-error="_onImageUploadError" on-oauth-application-removed="_onOAuthApplicationRemoved" on-oauth-application-updated="_onOAuthApplicationUpdated">
                </appsco-manage-oauth-application-page>
            </template>
            
            <appsco-customer-billing-page name="customer-billing" page="" company-page="" id="appscoCustomerBillingPage" company-api="[[ _companyApi ]]" account="[[ account ]]" current-company="[[ currentCompany.company ]]" authorization-token="[[ authorizationToken ]]" on-credit-card-added="_onCreditCardAdded" on-subscription-canceled="_onSubscriptionCanceled" on-subscription-changed="_onSubscriptionChanged" on-subscription-updated="_onSubscriptionUpdated">
            </appsco-customer-billing-page>

            <appsco-billing-report-page name="billing-report" page="" company-page=""
                id="appscoBillingReportPage"
                billing-report-api="[[ _billingReportApi ]]"
                customers-api="[[ _companyCustomersApi ]]"
                authorization-token="[[ authorizationToken ]]">
            </appsco-billing-report-page>

            <appsco-dashboard-folder-page name="dashboard-folder" page="" company-page="" id="appscoDashboardFolderPage" route="[[ subroute ]]" folder="{{ _activeFolder }}" is-on-personal="[[ _personalFolderPage ]]" authorization-token="[[ authorizationToken ]]" folders-api="[[ api.foldersApi ]]" company-folders-api="[[ _companyFoldersApi ]]" company="[[ currentCompany ]]" netscaler-api="[[ _companyNetscalerFeatureApi ]]" account="[[ account ]]" domain="[[ domain ]]" accounts-api="[[ api.accounts ]]" api-errors="[[ _apiErrors ]]" page-config="[[ _pageConfig ]]" toolbar="[[ \$.appscoDashboardFolderPageActions ]]" on-loaded="_onLoadedPage" on-application-shared="_onApplicationShared" on-application-instance-removed="_onApplicationInstanceRevoked" on-show-page="_onShowPage"  on-application-settings-saved="_onApplicationSettingsSaved">
            </appsco-dashboard-folder-page>

            <appsco-saml-authn-request-invalid-page name="saml-authn-request-invalid" page="" company-page=""
                id="appscoSamlAuthnRequestInvalidPage"
                on-back-to-dashboard="_showCompanyHomePage">
            </appsco-saml-authn-request-invalid-page>

            <template is="dom-if" if="[[ _isCompanyPackagePremium ]]">
                <appsco-policies-page name="policies" page="" company-page="" id="appscoPoliciesPage" authorization-token="[[ authorizationToken ]]" company-policies-api="[[ _companyPoliciesApi ]]" api-errors="[[ _apiErrors ]]" toolbar="[[ \$.appscoPoliciesPageActions ]]" on-observable-list-empty="_onObservableListEmpty" on-observable-list-filled="_onObservableListFilled">
                </appsco-policies-page>
                    
                <appsco-policies-report-page name="policies-report" page="" company-page="" id="appscoPoliciesReportPage" authorization-token="[[ authorizationToken ]]" policies-api="[[ _companyPoliciesApi ]]" roles-api="[[ _companyRolesApi ]]" policies-report-api="[[ _getPoliciesReportApi ]]" export-compliance-report-api="[[ _exportComplianceReportApi ]]" api-errors="[[ _apiErrors ]]" toolbar="[[ \$.appscoPolicyReportPageActions ]]">
                </appsco-policies-report-page>
            </template>
            
            <appsco-additional-options-page name="additional-options" page="" company-page="" id="appscoAdditionalOptionsPage" authorization-token="[[ authorizationToken ]]" get-company-idp-config-list-api="[[ _getCompanyIdpConfigListApi ]]" company="[[ currentCompany.company ]]" api-errors="[[ _apiErrors ]]" link="[[ _copyObject(link) ]]" company-applications-api="[[ _companyApplicationsApi ]]" toolbar="[[ \$.appscoAdditionalOptionsPageActions ]]">
            </appsco-additional-options-page>

            <appsco-logout-page name="logout" page="" logout-api="[[ api.logout ]]"></appsco-logout-page>

            <appsco-not-found-page name="404" page="" on-back-to-home-page="_onBackToHomePageAction"></appsco-not-found-page>`;
    }

    static get is() { return 'appsco-app'; }

    static get properties() {
        return {
            _progress: {
                type: String,
                value: "0"
            },

            _companyPage: {
                type: Boolean,
                computed: '_computeCompany(page, _companyPageResolved)'
            },

            page: {
                type: String,
                observer: '_pageChanged'
            },

            _prefixPath: {
                type: String,
                computed: '_computePrefixPath(domain)'
            },

            domain: {
                type: String
            },

            language: {
                value: 'en',
                type: String
            },

            _pageName: {
                type: String,
                computed: '_computePageName(page)'
            },

            api: {
                type: Object
            },

            _apiErrors: {
                type: Object,
                value: function() {
                    return {
                        getError: ()=>{}
                    };
                }
            },

            account: {
                type: Object,
                value: function() {
                    return {};
                },
                observer: '_onAccountChanged'
            },

            _accountManaged: {
                type: Boolean,
                computed: '_computeAccountManagedState(account, currentCompany)'
            },

            _role: {
                type: Object,
                value: function() {
                    return {};
                }
            },

            _group: {
                type: Object,
                value: function() {
                    return {};
                }
            },

            link: {
                type: Object,
                value: function() {
                    return {};
                }
            },

            item: {
                type: Object,
                value: function() {
                    return {};
                }
            },

            dashboards: {
                type: Array,
                observer: '_onDashboardsChange'
            },

            contactCompanies: {
                type: Array,
                computed: '_computeContactCompanies(contactCompaniesResponse)',
            },

            contactCompaniesResponse: {
                type: Array
            },

            /**
             * Selected application.
             */
            application: {
                type: Object,
                value: function() {
                    return {};
                }
            },

            currentCompany: {
                type: Object,
                value: function() {
                    return {};
                },
                observer: '_onCurrentCompanyChanged'
            },

            _defaultCompany: {
                type: String,
                computed: '_computeDefaultCompany(account)'
            },

            _companiesAccountHasPermissionTo: {
                type: Array,
                computed: '_computeCompaniesAccountHasPermissionTo(account.companies, contactCompanies)',
                observer: '_onCompaniesAccountHasPermissionToChanged'
            },

            _applicationLabels: {
                type: Array,
                computed: '_computeApplicationLabels(_companiesAccountHasPermissionTo, api.personalItemsWithoutFolder)'
            },

            /**
             * Selected company application.
             */
            _companyApplication: {
                type: Object,
                value: function() {
                    return {};
                }
            },

            /**
             * Selected integration for provisioning settings
             */
            _selectedIntegration: {
                type: Object,
                value: function() { return {}; }
            },

            cookieSecure: {
                type: String,
                value: ''
            },

            _addAppApi: {
                type: String
            },

            _applicationsApi: {
                type: String
            },

            _companyAdmin: {
                type: Boolean,
                computed: '_computeCompanyAdmin(currentCompany)'
            },

            _resourceAdmin: {
                type: Boolean,
                value: false
            },

            _companyContact: {
                type: Boolean,
                computed: '_computeCompanyContact(currentCompany)'
            },

            _billingReportApi: {
                type: String
            },

            _companyApi: {
                type: String
            },

            _companyIconsApi: {
                type: String
            },

            _companyNetscalerFeatureApi: {
                type: String
            },

            _companyApplicationsApi: {
                type: String
            },

            _companyImportResourcesApi: {
                type: String,
                computed: '_computeCompanyImportResourcesApi(_companyApplicationsApi)'
            },

            _companyInvitationsApi: {
                type: String
            },

            _companyRolesApi: {
                type: String
            },

            _companyDirectorySummaryApi: {
                type: String
            },

            _companyImportAccountsApi: {
                type: String
            },

            _companyLicencesApi: {
                type: String
            },

            _companyLicenceCategoriesApi: {
                type: String
            },

            _companyContactsApi: {
                type: String
            },

            _companyImportContactsApi: {
                type: String,
                computed: '_computeCompanyImportContactsApi(_companyContactsApi)'
            },

            _companyCustomersExportApi: {
                type: String,
                computed: '_computeCompanyExportCustomersApi(_companyCustomersApi)'
            },

            _companyOrgunitsApi: {
                type: String
            },

            _companySubscriptionApi: {
                type: String
            },

            _companyDomainsApi: {
                type: String
            },

            _companyGroupsApi: {
                type: String
            },

            _companyGroupApi: {
                type: String
            },

            _companySamlMetadataApi: {
                type: String
            },

            _companyAuditLogApi: {
                type: String
            },

            _companyProvisioningLogApi: {
                type: String
            },

            _companyCustomersApi: {
                type: String
            },

            _companyConvertToCustomerApi: {
                type: String
            },

            _companyIntegrationApi: {
                type: String
            },

            _addPartnerAdminToCustomerApi: {
                type: String,
                computed: '_computeAddPartnerAdminToCustomerApi(_companyCustomersApi)'
            },

            _importCustomerResourcesApi: {
                type: String,
                computed: '_computeCustomerResourcesImportApi(_companyCustomersApi)'
            },

            _partnerApi: {
                type: String
            },

            _importCustomersApi: {
                type: String,
                computed: '_computeImportCustomersApi(_companyCustomersApi)'
            },

            _checkIfCustomerExistsApi: {
                type: String,
                computed: '_computeCheckIfCustomerExistsApi(_partnerApi)'
            },

            _getAccessReportApi: {
                type: String
            },

            _getComplianceReportApi: {
                type: String
            },

            _getPoliciesReportApi: {
                type: String
            },

            _exportAccessReportApi: {
                type: String,
                computed: '_computeExportAccessReportApi(_getAccessReportApi)'
            },

            _exportComplianceReportApi: {
                type: String,
                computed: '_computeExportComplianceReportApi(_getComplianceReportApi)'
            },

            _exportPoliciesReportApi: {
                type: String,
                computed: '_computeExportPoliciesReportApi(_getPoliciesReportApi)'
            },

            _exportBillingReportApi: {
                type: String,
                computed: '_computeExportBillingReportApi(_billingReportApi)'
            },

            _getTransferTokenApi: {
                type: String
            },

            _sendTransferTokenApi: {
                type: String
            },

            _saveIPWhiteListApi: {
                type: String
            },

            _getAvailableIntegrationsApi: {
                type: String
            },

            _getActiveIntegrationsApi: {
                type: String
            },

            _companyOAuthApplicationsApi: {
                type: String
            },

            _companyFoldersApi: {
                type: String
            },

            _companyIconsWithoutFolderApi: {
                type: String,
                computed: '_computeCompanyIconsWithoutFolderApi(_companyFoldersApi)'
            },

            _companyPoliciesApi: {
                type: String
            },

            _accessOnBoardingUsersApi: {
                type: String
            },

            _exportAccessAccessOnBoardingApi: {
                type: String,
                computed: '_computeExportAccessAccessOnBoardingApi(_accessOnBoardingUsersApi)'
            },

            _getCompanyIdpConfigListApi: {
                type: String
            },

            _toastMessage: {
                type: String,
                value: ''
            },

            _toastPersistence: {
                type: Boolean,
                value: false
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

            _companyUser: {
                type: Boolean,
                computed: "_computeCompanyUser(currentCompany)"
            },

            _brandLogo: {
                type: String,
                computed: '_computeBrandLogo(currentCompany, _companyPage)'
            },

            _brandTitle: {
                type: String,
                computed: '_computeBrandTitle(currentCompany, _companyPage)'
            },

            _contactIconsApi: {
                type: String,
                computed: '_computeContactIconsApi(domain, currentCompany)'
            },

            _accessBilling: {
                type: Boolean,
                computed: "_computeAccessBilling(currentCompany)"
            },

            _isCompanyPackagePremium: {
                type: Boolean,
                computed: "_computeIsCompanyPackagePremium(currentCompany)"
            },

            _personalFolderPage: {
                type: Boolean,
                computed: '_computePersonaFolderPage(_activeFolder)'
            },

            _activeFolder: {
                type: Object,
                observer: '_activeFolderChanged'
            },

            _companyPageResolved: {
                type: Boolean,
                computed: '_computeCompanyPageResolved(page, _personalFolderPage)'
            },

            _tutorials: {
                type: Object,
                value: function(){ return {}; }
            },

            _tutorialsPageVisible: {
                type: Boolean,
                computed: "_computeTutorialsPageVisible(_tutorials, _companyAdmin)"
            },

            _directoryPageLoaded: {
                type: Boolean,
                value: false
            },

            _resourcesPageLoaded : {
                type: Boolean,
                value: false
            },

            shareResourceDialogAccountsLoaded: {
                type: Boolean,
                value: false
            },

            _companyDomainsLoaded: {
                type: Boolean,
                value: false
            },

            pageConfigResponse: {
                type: Object
            },

            _pageConfig: {
                type: Object,
                value: function() {
                    return {
                        home: {
                            display_style: 'grid',
                            hide_resource_section: true
                        },
                        'company-home': {
                            display_style: 'grid'
                        },
                        'contact-home': {
                            display_style: 'grid'
                        },
                        resources: {
                            display_style: 'list'
                        }
                    };
                }
            },

            tutorialResponse: {
                type: Object
            },

            _personalPage: {
                type: Boolean,
                computed: '_computeIsPersonalPage(page, _companyPageResolved)'
            }
        }
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen)',
            '_routePageChanged(routeData.page)',
            '_changeTheme(_companyPage, currentCompany.company)',
            '_redirectToCompany(page, currentCompany, account, _companyPageResolved)',
            '_setupCompanyAccountPage(page, account)',
            '_handlePagePermission(currentCompany, page)',
            '_processPageConfigResponse(pageConfigResponse)'
        ];
    }

    ready() {
        super.ready();

        beforeNextRender(this, function() {
            this._addListeners();

            if(!this.account.self) {
                this._getLoggedAccount();
            }
        });

        setTimeout(function() {
            this._getIsUserLoggedIn();
            this._checkNewNotifications();
        }.bind(this), 2000);
    }

    _addListeners() {
        this.addEventListener('show-page-progress-bar', this._showProgressBar.bind(this), { passive: true });
        this.addEventListener('hide-page-progress-bar', this._hideProgressBar.bind(this), { passive: true });
        this.addEventListener('notify', this._onNotify.bind(this), { passive: true });
        this.addEventListener('notify-about-error', this._onNotify.bind(this), { passive: true });
        this.addEventListener('page-global-info', this._onInfoAction.bind(this), { passive: true });
        this.addEventListener('page-global-filters', this._onFiltersAction.bind(this), { passive: true });
        this.addEventListener('page-global-toggle-additional-options', this._onToggleAdditionalOptionsAction.bind(this), { passive: true });
        this.addEventListener('page-loaded', this._onPageLoaded.bind(this), { passive: true });
        this.addEventListener('filter-done', this._onPageLoaded.bind(this), { passive: true });
        this.addEventListener('reload-account-log', this._onReloadAccountLog.bind(this), { passive: true });
        this.addEventListener('edit-application', this._onEditApplication.bind(this), { passive: true });
        this.addEventListener('info-edit-application', this._onInfoEditApplication.bind(this), { passive: true });
        this.addEventListener('edit-resource', this._onEditCompanyResource.bind(this), { passive: true });
        this.addEventListener('info-edit-resource', this._onInfoEditCompanyResource.bind(this), { passive: true });
        this.addEventListener('reload-applications', this._onReloadApplications.bind(this), { passive: true });
        this.addEventListener('reload-accounts', this._onReloadAccounts.bind(this), { passive: true });
        this.addEventListener('application-settings-saved', this._onApplicationUpdated.bind(this), { passive: true });
        this.addEventListener('copied-application-attribute', this._onCopiedApplicationAttribute.bind(this), { passive: true });
        this.addEventListener('twofa-enabled', this._onTwoFaEnabled.bind(this), { passive: true });
        this.addEventListener('token-generated', this._onTokenGenerated.bind(this), { passive: true });

        // export
        this.addEventListener('export-access-report', this._onExportAccessReportAction.bind(this), { passive: true });
        this.addEventListener('export-compliance-report', this._onExportComplianceReportAction.bind(this), { passive: true });
        this.addEventListener('export-policies-report', this._onExportPoliciesReportAction.bind(this), { passive: true });
        this.addEventListener('export-billing-report', this._onExportBillingReportAction.bind(this), { passive: true });

        // success
        this.addEventListener('export-company-log-finished', this._onExportReportFinished.bind(this), { passive: true });
        this.addEventListener('export-access-report-finished', this._onExportReportFinished.bind(this), { passive: true });
        this.addEventListener('export-compliance-report-finished', this._onExportReportFinished.bind(this), { passive: true });
        this.addEventListener('export-policies-report-finished', this._onExportReportFinished.bind(this), { passive: true });
        this.addEventListener('export-billing-report-finished', this._onExportReportFinished.bind(this), { passive: true });

        // fails
        this.addEventListener('export-access-report-failed', this._onExportReportFailed.bind(this), { passive: true });
        this.addEventListener('export-compliance-report-failed', this._onExportReportFailed.bind(this), { passive: true });
        this.addEventListener('export-policies-report-failed', this._onExportReportFailed.bind(this), { passive: true });
        this.addEventListener('export-billing-report-failed', this._onExportReportFailed.bind(this), { passive: true });

        this.addEventListener('user-session-expired', this._onUserSessionExpired.bind(this), { passive: true });

        this.addEventListener('notifications-seen', this._onNotificationsSeen.bind(this), { passive: true });
        this.addEventListener('resource-moved-to-folder', this._onResourceMovedToFolder.bind(this), { passive: true });
        this.addEventListener('resource-removed-from-folder', this._onResourceRemovedFromFolder.bind(this), { passive: true });
        this.addEventListener('reload-access-of-boarding', this._onReloadAccessOnBoarding.bind(this), { passive: true });
        this.addEventListener('groups-added-to-resources', this._onGroupsAddedToResources.bind(this), { passive: true });
        this.addEventListener('page-settings-changed', this._onPageSettingsChanged.bind(this), { passive: true });
    }

    _updateScreen(mobile, tablet) {
        this.updateStyles();
    }

    _onObservableListEmpty() {
        this._hideBulkSelectAll();
    }

    _onObservableListFilled() {
        this._showBulkSelectAll();
    }

    _computePrefixPath(domain) {
        if(window.location.href.includes('localhost')) {
            return '';
        }

        if (domain.includes('/app.php')) {
            return '/app.php';
        }

        if (domain.includes('/app_dev.php')) {
            return '/app_dev.php';
        }

        return '';
    }

    onShareResourceDialogAccountsLoadedChanged(event) {
        this.shareResourceDialogAccountsLoaded = event.detail.loaded;
        if (event.detail.loaded) {
            this._hideProgressBar();
        }
    }

    _onAccountChanged() {
        if (this.account && this.account.self) {
            setTimeout(function () {
                if (!this.dashboards) {
                    this.shadowRoot.getElementById('getDashboardsLink').generateRequest();
                }
                if (undefined === this.contactCompaniesResponse) {
                    this.shadowRoot.getElementById('getCompaniesAccountIsContactIn').generateRequest();
                }
                if (undefined === this.pageConfigResponse) {
                    this.shadowRoot.getElementById('getPageConfigRequest').generateRequest();
                }
            }.bind(this), 0);
        }
    }

    _onCurrentCompanyChanged(company, oldCompany) {
        if (company && company.company && company.company.self) {
            this._setResourceAdmin(company);

            setTimeout(function() {
                if (
                    this.account && this.account.profile_options
                    && (this.account.profile_options.default_company_page === 'resources')
                    && (this.page === 'company-home')
                ) {
                    this.page = 'resources';
                }
            }.bind(this), 100);
            for (const key in company.company) {
                this._storeValue('company', company.company.alias);

                this._setCompanyApi(company);
                if ('dashboard-folder' !== this.page) {
                    this._setProduct(this._companyPage);
                }

                if (oldCompany && oldCompany.company && oldCompany.company.self
                    && company.company.personal_dashboards_allowed !== oldCompany.company.personal_dashboards_allowed) {
                    this._getLoggedAccount();
                }
                return false;
            }
        }
        else {
            this._setProduct(false);
        }
    }

    _computeDefaultCompany(account) {
        let defaultCompany = '';

        if (account.default_company) {
            let defaultCompanyRedirect = {};
            try {
                defaultCompanyRedirect = JSON.parse(this._getStoredValue('default_company_redirected'));
            } catch (Error) {}
            if (!defaultCompanyRedirect
                || !defaultCompanyRedirect.accountId
                || !defaultCompanyRedirect.login_date
                || defaultCompanyRedirect.login_date != this.account.last_login.date
                || defaultCompanyRedirect.accountId != this.account.id
            ) {
                this._storeValue('default_company_redirected', JSON.stringify({
                    accountId: account.id,
                    login_date: account.last_login.date
                }));
                defaultCompany = account.default_company.alias;
            }
        }

        return defaultCompany;
    }

    _redirectToCompany(page, currentCompany, account, companyPageResolved) {
        if (account.self && currentCompany.company && page && companyPageResolved && !this._personalFolderPage) {
            this._checkPersonalDashboardPermission(page, account);
            this._redirectToDefaultCompany(page);
        }
    }

    _computeCompanyPageResolved(page, personalFolderPage) {
        return 'dashboard-folder' === page ?
            undefined !== personalFolderPage :
            true
        ;
    }

    _redirectToDefaultCompany(page) {
        if (this._defaultCompany !== '') {
            this._setProduct(true);

            if (this._isPersonalPage(page)) {
                this._showCompanyHomePage();
            }

            this.set('account', JSON.parse(JSON.stringify(this.account)));
        }
    }

    _computeCompanyUser(currentCompany) {
        return currentCompany && !currentCompany.company_contact;
    }

    _computeCompanyAdmin(company) {
        return company.company_admin;
    }

    _setResourceAdmin(currentCompany, callback) {
        const request = document.createElement('iron-request'),
            options = {
                url: this.api.getUserPrivilegesApi,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers,
                body: 'company=' + encodeURIComponent(currentCompany.company.self)
            };

        request.send(options).then(function() {
            this._resourceAdmin = ((200 === request.status) ?
                (request.response.scopes['COMPANY_APPLICATION_LIST'] && !this._companyAdmin) :
                false);
            if (callback) {
                callback();
            }
        }.bind(this));
    }

    _computeCompanyContact(company) {
        return company.company_contact;
    }

    _computeCompaniesAccountHasPermissionTo(accountCompanies, companiesAccountIsContactIn) {
        if (undefined === accountCompanies || undefined === companiesAccountIsContactIn) {
            return undefined;
        }
        return companiesAccountIsContactIn.length > 0 ?
            accountCompanies.concat(companiesAccountIsContactIn) :
            accountCompanies
        ;
    }

    _computeApplicationLabels(companies, personalApplicationsApi) {
        if (undefined === companies || undefined === personalApplicationsApi) {
            return undefined;
        }
        const labels = [
            { name: 'My items', applicationsApi: personalApplicationsApi, company: null }
        ];

        companies.forEach(company => labels.push(this._createLabelFromCompany(company)));

        return labels;
    }

    _createLabelFromCompany(company) {
        return {
            name: 'Shared by ' + company.company.name,
            applicationsApi: company.company.self + '/dashboard-groups/no-personal-dashboard-icons',
            companyIconsWithoutFolderApi: company.company.self + '/dashboard-groups/icons',
            groupsApi: company.company.self + '/groups',
            company: company.company
        };
    }

    _computeAccessBilling(currentCompany) {
        return currentCompany.company && !currentCompany.company.subscription_paid_externally;
    }

    _computeIsCompanyPackagePremium(company) {
        return company.company && company.company.package && 'premium' === company.company.package;
    }

    _computeTutorialsPageVisible(tutorials, _companyAdmin) {
        for (const idx in tutorials) {
            return (tutorials.hasOwnProperty(idx) && _companyAdmin);
        }

        return false;
    }

    _setProduct(company) {
        const appscoHeader = this.$.appscoHeader;

        company ? appscoHeader.setProduct('appsco-business-product' + this.currentCompany.company.alias) : appscoHeader.setProduct('appsco-product');
    }

    _handlePagePermission(company, page) {
        for (const key in company) {
            if (page === 'customers' && !this.currentCompany.company.is_partner) {
                this._showCompanyHomePage();
                return false;
            }
        }
    }

    /**
     * Routing START
     */
    _routePageChanged(page) {
        this._brandLogoClickable = !('home' === page || 'company-home' === page);
        this.page = page || 'home';
    }

    _pageChanged(page, oldPage) {
        if (undefined !== oldPage) {
            this._setProgressBar(page);
            this._closeToastMessage();
            afterNextRender(this, () => this.$.appDrawer.close());
        }

        // Load page import on demand. Show 404 page if fails
        import(`./appsco-${page}-page.js`).then(null, this._showPage404.bind(this));

        const currentElement = this.getCurrentAppscoPageElement();
        if (currentElement !== undefined && currentElement !== null && typeof currentElement.pageSelected === 'function') {
            currentElement.pageSelected();
        }
    }

    _computePageName(page) {
        switch (page) {
            case 'manage-resource':
                return 'Manage Resource';
            case 'manage-account':
                return 'Manage Account';
            case 'manage-contact':
                return 'Manage Contact';
            case 'manage-customer':
                return 'Manage Customer';
            case 'manage-group':
                return 'Manage Group';
            case 'manage-integration':
                return 'Manage Integration';
            case 'company-home':
            case 'dashboard-folder':
                return 'Dashboard';
            case 'contact-home':
                return 'Dashboard';
            case 'access-report':
                return 'Access report';
            case 'compliance-report':
                return 'Compliance report';
            case 'company':
                return 'Company Settings';
            case 'provisioning-settings':
                return 'Provisioning > Setup';
            case 'provisioning-integration-authorization-success':
                return 'Provisioning > Authorization success';
            case 'provisioning-integration-authorization-failed':
                return 'Provisioning > Authorization failed';
            case 'provisioning-log':
                return 'Provisioning Log';
            case 'audit-log':
                return 'Audit Log';
            case 'access-on-boarding':
                return 'Access Tasks';
            case 'oauth-applications':
                return 'oAuth';
            case 'trybusiness':
                return 'Try Appsco Business';
            case 'company-account':
                return 'Account';
            case 'manage-oauth-application':
                return 'Manage OAuth Application';
            case 'customer-billing':
                return 'Customer Billing';
            case 'billing-report':
                return 'Billing Report';
            case 'saml-authn-request-invalid':
                return 'Authentication Failed';
            case 'policies-report':
                return 'Policies Report';
            case 'get-started':
                return 'Get started';
            case 'additional-options':
                return 'Additional Options';
            default:
                return page;
        }
    }

    _onMenuItemSelected(event) {
        this._showPage(event.detail.item.name);
    }

    _onShowPage(event) {
        this._showPage(event.detail.page);
    }

    _showPage(name) {
        this.set('routeData.page', name);
    }

    _showManagePage(path) {
        this.set('route.path', this._prefixPath + '/' + path);
    }

    _showHomePage() {
        this._showPage('home');
    }

    _showAccountPage() {
        this._showPage('account');
    }

    _showCompanyAccountPage() {
        this._showPage('company-account');
    }

    _showCompanyHomePage() {
        this._showPage('company-home');
    }

    _backFromFolderPage() {
        if (this._personalFolderPage) {
            this._showHomePage();
        } else {
            this._showCompanyHomePage();
        }
    }

    _showCompanyPage() {
        this._showPage('company');
    }

    _showCompanyResourcesPage() {
        this._showPage('resources');
    }

    _showCompanyDirectoryPage() {
        this._showPage('directory');
    }

    _showContactsPage() {
        this._showPage('contacts');
    }

    _showCustomersPage() {
        this._showPage('customers');
    }

    _showGroupsPage() {
        this._showPage('groups');
    }

    _showCompanyProvisioningPage() {
        this._showPage('provisioning');
    }

    _showLogoutPage() {
        this._showPage('logout');
    }

    _showGetStartedPage() {
        this._showPage('get-started');
    }

    _showContactHomePage() {
        this._showPage('contact-home');
    }

    _showReportsPage() {
        this._showPage('reports');
    }

    _showAccessReportPage() {
        this._showPage('access-report');
    }

    _showComplianceReportPage() {
        this._showPage('compliance-report');
    }

    _showPoliciesReportPage() {
        this._showPage('policies-report');
    }

    _showOAuthApplicationsPage() {
        this._showPage('oauth-applications');
    }

    _showAdditionalOptionsPage() {
        this._showPage('additional-options');
    }

    _showPage404() {
        this.page = '404';
        this._pageName = 'Not Found';
    }
    /**
     * Routing END
     */

    /**
     * Ajax START
     */
    _setCompanyApi(company) {
        const companyApi = company.company.self,
            partnerApi = companyApi.replace('companies', 'partners');

        this._companyApi = companyApi;
        this._companyIconsApi = company.icons;
        this._companyApplicationsApi = companyApi + '/applications';
        this._companyNetscalerFeatureApi = companyApi+'/feature/netscaler/sso/resourcelist';
        this._partnerApi = partnerApi;

        if (company.company_admin) {
            this._companyRolesApi = companyApi + '/directory/roles';
            this._companyDirectorySummaryApi = companyApi + '/directory/summary';
            this._companyNotificationsApi = companyApi + '/notification';
            this._companyInvitationsApi = companyApi + '/invitation';
            this._companyImportAccountsApi = companyApi + '/directory/roles/import';
            this._companyLicencesApi = companyApi + '/licences';
            this._companyLicencesExportApi = this._companyLicencesApi + '/export';
            this._companyLicencesImportApi = this._companyLicencesApi + '/import';
            this._companyLicenceCategoriesApi = companyApi + '/licence-categories';
            this._companyContactsApi = companyApi + '/contacts';
            this._companyOrgunitsApi = companyApi + '/org-units?extended=1';
            this._companySubscriptionApi = companyApi + '/billing/subscriptions';
            this._companyDomainsApi = companyApi + '/domains';
            this._companyGroupsApi = companyApi + '/groups';
            this._companyGroupApi = companyApi + '/group';
            this._companySamlMetadataApi = companyApi + '/idp/saml/metadata';
            this._companyAuditLogApi = companyApi + '/log';
            this._companyProvisioningLogApi = companyApi + '/provisioning-log';
            this._companyCustomersApi = partnerApi + '/customers';
            this._companyConvertToCustomerApi = partnerApi + '/customers/convert';
            this._companyIntegrationApi = companyApi + '/integrations';
            this._getAccessReportApi = companyApi + '/reports/application-access';
            this._getComplianceReportApi = companyApi + '/reports/application-compliance';
            this._getPoliciesReportApi = companyApi + '/reports/policy-breach';
            this._getTransferTokenApi = companyApi + '/transfer-token';
            this._sendTransferTokenApi = companyApi + '/send_token';
            this._saveIPWhiteListApi = companyApi + '/ip-white-list';
            this._getAvailableIntegrationsApi = companyApi + '/integrations/available';
            this._getActiveIntegrationsApi = companyApi + '/integrations/active';
            this._companyOAuthApplicationsApi = companyApi + '/oauth/applications';
            this._billingReportApi = companyApi + '/reports/billing-report';
            this._accessOnBoardingUsersApi = companyApi + '/reports/access-on-boarding';
            this._getCompanyIdpConfigListApi = companyApi + '/settings/idps';
        }

        this._companyFoldersApi = companyApi + '/dashboard-groups';
        this._companyPoliciesApi = companyApi + '/policies';
    }

    _computeCompanyImportResourcesApi(companyApplicationsApi) {
        return companyApplicationsApi ? (companyApplicationsApi + '/import') : null;
    }

    _computeCompanyImportContactsApi(contactsApi) {
        return contactsApi ? (contactsApi + '/import') : null;
    }

    _computeImportCustomersApi(customersApi) {
        return customersApi ? (customersApi + '/import') : null;
    }

    _computeCheckIfCustomerExistsApi(partnerApi) {
        return partnerApi ? (partnerApi + '/customer/exists') : null;
    }

    _computeCustomerResourcesImportApi(customersApi) {
        return customersApi ? customersApi + '/import-resources' : null;
    }

    _computeCompanyExportCustomersApi(customersApi) {
        return customersApi ? customersApi + '/export' : null;
    }

    _computeAddPartnerAdminToCustomerApi(customersApi) {
        return customersApi ? (customersApi + '/partner-admins') : null;
    }

    _computeExportAccessReportApi(getAccessReportApi) {
        return getAccessReportApi ? (getAccessReportApi + '/export') : null;
    }

    _computeExportComplianceReportApi(getComplianceReportApi) {
        return getComplianceReportApi ? (getComplianceReportApi + '/export') : null;
    }

    _computeExportPoliciesReportApi(getPoliciesReportApi) {
        return getPoliciesReportApi ? (getPoliciesReportApi + '/export') : null;
    }

    _computeExportBillingReportApi(billingReportApi) {
        return billingReportApi ? (billingReportApi + '/export') : null;
    }

    _computeExportAccessAccessOnBoardingApi(accessOnBoardingUsersApi) {
        return accessOnBoardingUsersApi ? (accessOnBoardingUsersApi + '/export') : null;
    }

    _computeCompanyIconsWithoutFolderApi(companyFoldersApi) {
        return companyFoldersApi ? (companyFoldersApi + '/icons') : null;
    }

    _getLoggedAccount() {
        this.shadowRoot.getElementById('getAccountRequest').generateRequest();
    }

    _onGetAccountResponse(event) {
        const account = event.detail.response.account;

        this.set('account', {});
        this.set('account', account);
    }

    _onGetPageConfig(event) {
        this.set('pageConfigResponse', event.detail.response);
    }

    _processPageConfigResponse(pageConfig) {
        const _pageConfig = JSON.parse(JSON.stringify(this._pageConfig));

        for (const key in pageConfig) {
            _pageConfig[key] = pageConfig[key];

        }

        this.set('_pageConfig', {});
        this.set('_pageConfig', _pageConfig);
    }

    _onCompaniesAccountHasPermissionToChanged() {
        if (this._companiesAccountHasPermissionTo) {
            this._getCurrentCompanyFromAccount();
        }
    }

    _getCurrentCompanyFromAccount() {
        if (this._companiesAccountHasPermissionTo.length > 0) {
            const companies = this._companiesAccountHasPermissionTo,
                length = companies.length;

            let companyAlias = this._getStoredValue('company'),
                currentCompany = companies[0];

            if (!this._getCurrentCompanyFromAccount.personal_dashboard_allowed && this.account.native_company) {
                let lastNativeRedirect = {};
                try {
                    lastNativeRedirect = JSON.parse(this._getStoredValue('native_redirected'));
                } catch (Error) {}
                if (!lastNativeRedirect
                    || !lastNativeRedirect.accountId
                    || !lastNativeRedirect.login_date
                    || lastNativeRedirect.login_date != this.account.last_login.date
                    || lastNativeRedirect.accountId != this.account.id
                ) {
                    this._storeValue('native_redirected', JSON.stringify({
                        accountId: this.account.id,
                        login_date: this.account.last_login.date
                    }));
                    companyAlias = this.account.native_company.alias;
                }
            }

            if (this.account.default_company && this._defaultCompany) {
                companyAlias = this._defaultCompany;
            }

            if (companyAlias && companyAlias.toString().length > 0) {
                for (let i = 0; i < length; i++) {
                    if (companies[i].company.alias == companyAlias) {
                        currentCompany = companies[i];
                    }
                }
            }

            this.currentCompany = currentCompany;
        }
    }

    _computeContactIconsApi(domain, currentCompany) {
        if (currentCompany.company && currentCompany.company_contact) {
            return domain + '/api/v2/me/contact/companies/' + currentCompany.company.alias + '/apps';
        }

        return null;
    }

    /**
     * Checks is user allowed to see personal dashboard pages
     *
     * @param {String} page
     * @param {Object} account
     *
     * @private
     */
    _checkPersonalDashboardPermission(page, account) {
        if (!this.isPersonalDashboardAllowed(account)) {
            this._disablePersonalDashboard(page);
        } else {
            this._enablePersonalDashboard(page);
        }
    }

    /**
     * Remove personal from product list, and redirect user to company page if needed
     *
     * @param {String} page
     *
     * @private
     */
    _disablePersonalDashboard(page) {
        this.$.appscoHeader.removeProduct('appsco-product');
        this._setProduct(true);

        if (this._isPersonalPage(page)) {
            this._showCompanyHomePage();
        }
    }

    /**
     * Returns Personal to product list
     *
     * @private
     */
    _enablePersonalDashboard(page) {
        this.$.appscoHeader.addPersonalToProducts();
        this._setProduct(!this._isPersonalPage(page));
    }

    /**
     * Returns true if page is on personal dashboard
     *
     * @param {String} page
     * @returns {Boolean}
     *
     * @private
     */
    _isPersonalPage(page) {
        if ('dashboard-folder' === page) {
            return this._personalFolderPage;
        }
        const personalPages = ['home', 'resource', 'trybusiness', 'account'];
        return personalPages.indexOf(page) !== -1;
    }

    isPersonalDashboardAllowed(account) {
        return account && account.native_company
            ? account.native_company.personal_dashboards_allowed
            : true;
    }

    _onGetCompaniesAccountIsContactInApiResponse(event) {
        const response = event.detail.response;
        this.set('contactCompaniesResponse', response.companies);
    }

    _computeContactCompanies(contactCompanies) {
        if (undefined === contactCompanies) {
            return undefined;
        }
        return contactCompanies.map(function(company) {
            return {
                company: company,
                company_contact: true
            };
        });
    }

    _onGetIsUserLoggedInResponse() {
        this._getIsUserLoggedIn();
    }

    _onCheckNewNotificationsResponse(event, response) {
        const newNotifications = event.detail.response;
        if (0 < newNotifications) {
            this._notifyNewNotifications(newNotifications);
        } else {
            this._notifyNotificationsSeen();
        }
        this._checkNewNotifications();
    }

    _checkNewNotifications() {
        setTimeout(function() {
            this.shadowRoot.getElementById('checkNewNotifications').generateRequest();
        }.bind(this), 30000);
    }

    _notifyNewNotifications(newNotifications) {
        this.$.appscoHeader.notifyNewNotifications(newNotifications);
    }

    _notifyNotificationsSeen() {
        this.$.appscoHeader.notifyNotificationsSeen();
    }

    _onNotificationsSeen() {
        this._notifyNotificationsSeen();
        this.shadowRoot.getElementById('notificationsSeen').generateRequest();
    }

    _setGetApplicationsApi() {
        this._applicationsApi = this.api.foldersApi + '/icons';
    }

    _createDefaultDashboard() {
        const request = document.createElement('iron-request'),
            options = {
                url: this.api.dashboards,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers,
                body: 'dashboard[title]=' + encodeURIComponent(this.account.name)
            };

        request.send(options).then(function() {
            if (200 === request.status) {
                this._addAppApi = request.response.dashboard.self;
                this._setGetApplicationsApi();
            }
        }.bind(this));
    }

    _onDashboardsResponse(event) {
        const response = event.detail.response;
        this.set('dashboards', response.dashboards);
    }

    _onDashboardsChange() {
        if (this.dashboards) {
            this.processDashboards(this.dashboards);
        }
    }

    processDashboards(dashboards) {
        if (!dashboards) {
            this._createDefaultDashboard();
            return;
        }
        const length = dashboards.length;
        let hasDashboard = false;

        dashboardsLoop:
            for (let i = 0; i < length; i++) {
                const dashboardRoles = dashboards[i].roles,
                    rolesLength = dashboardRoles.length;

                for (let j = 0; j < rolesLength; j++) {
                    if ('owner' === dashboardRoles[j].toLowerCase()) {
                        this._addAppApi = dashboards[i].self;
                        this._setGetApplicationsApi();
                        hasDashboard = true;
                        break dashboardsLoop;
                    }
                }

            }

        if (!hasDashboard) {
            this._createDefaultDashboard();
        }
    }

    _onSubscriptionLoaded(event) {
        const subscription = event.detail.subscription;
        this._setSubscription(subscription);
        this._evaluateSubscriptionLicences();
    }

    _onDirectoryPageLoaded(event) {
        this._directoryPageLoaded = true;
    }

    _onResourcesPageLoaded(event) {
        this._resourcesPageLoaded = true;
    }

    _computeAccountManagedState(account) {
        return !!account.native_company;
    }

    _getIsUserLoggedIn() {
        setTimeout(function() {
            this.shadowRoot.getElementById('getIsUserLoggedIn').generateRequest();
        }.bind(this), 30000);
    }

    _redirectUserToLoginPage() {
        window.location.href = this.api.loginURL;
    }

    _showUserSessionExpiredInfo() {
        const dialog = this.shadowRoot.getElementById('appscoCompanyNotice');
        dialog.removeAttribute('disable-upgrade');

        setTimeout(function() {
            dialog.setNotice('Your session has expired. You will be redirected in order to login again.');
            dialog.setNoticeEvent('user-session-expired');
            dialog.open();
        });
    }

    _onUserSessionExpired() {
        this._redirectUserToLoginPage();
    }

    _onIsUserLoggedInError() {
        this._showUserSessionExpiredInfo();
    }
    /**
     * Ajax END
     */

    /**
     * Appsco header actions START
     */
    _onBrandAction() {
        this._companyPage ? this._showCompanyHomePage() : this._showHomePage();
    }

    _onAppscoProductChangeAction(event) {
        const panel = event.detail.product,
            company = event.detail.company;

        if ('appsco-product' === panel && 'home' !== this.page) {
            this._showHomePage();
        }

        if ('appsco-business-product' === panel) {
            this.currentCompany = company;

            company.company_contact ? this._showContactHomePage() : this._showCompanyHomePage();
        }
    }

    _onAccountSettingsAction() {
        this._setProduct(this._accountManaged);

        this._accountManaged ? this._showCompanyAccountPage() : this._showAccountPage();
    }

    _onAllNotifications() {
        this._setProduct(this._accountManaged);

        if (this._accountManaged) {
            this.shadowRoot.getElementById('appscoCompanyAccountPage').showAllNotifications = true;
            this._showCompanyAccountPage();
        }
        else {
            this.shadowRoot.getElementById('appscoAccountPage').showAllNotifications = true;
            this._showAccountPage();
        }
    }

    _onAccountLogout() {
        this._showLogoutPage();
    }

    _onGetStarted() {
        this._showGetStartedPage();
    }

    /**
     * Appsco header actions END
     */

    /**
     * Home page START
     */
    _onLoadedPage(event) {
        const page = event.currentTarget;

        if (page.$ && ('home' === this.page || 'company-home' === this.page || 'resources' === this.page || 'contact-home' === this.page)) {
            page.initializePage();
        }
    }

    getCurrentAppscoPageElement() {
        switch (this.page) {
            case 'home':
                return this.shadowRoot.getElementById('appscoHomePage');
            case 'company-home':
                return this.shadowRoot.getElementById('appscoCompanyHomePage');
            case 'resources':
                return this.shadowRoot.getElementById('appscoResourcesPage');
            case 'manage-integration':
                return this.shadowRoot.getElementById('appscoManageIntegrationPage');
            case 'directory':
                return this.shadowRoot.getElementById('appscoDirectoryPage');
            case 'company':
                return this.shadowRoot.getElementById('appscoCompanyPage');
            case 'licences':
                return this.shadowRoot.getElementById('appscoLicencesPage');
            case 'contacts':
                return this.shadowRoot.getElementById('appscoContactsPage');
            case 'groups':
                return this.shadowRoot.getElementById('appscoGroupsPage');
            case 'account':
                return this.shadowRoot.getElementById('appscoAccountPage');
            case 'company-account':
                return this.shadowRoot.getElementById('appscoCompanyAccountPage');
            case 'contact-home':
                return this.shadowRoot.getElementById('appscoContactHomePage');
            case 'customers':
                return this.shadowRoot.getElementById('appscoCustomersPage');
            case 'oauth-applications':
                return this.shadowRoot.getElementById('appscoOAuthApplicationsPage');
            case 'reports':
                return this.shadowRoot.getElementById('appscoReportsPage');
            case 'access-report':
                return this.shadowRoot.getElementById('appscoAccessReportPage');
            case 'compliance-report':
                return this.shadowRoot.getElementById('appscoComplianceReportPage');
            case 'manage-oauth-application':
                return this.shadowRoot.getElementById('appscoManageOAuthApplicationPage');
            case 'provisioning-log':
                return this.shadowRoot.getElementById('appscoProvisioningLogPage');
            case 'audit-log':
                return this.shadowRoot.getElementById('appscoAuditLogPage');
            case 'access-on-boarding':
                return this.shadowRoot.getElementById('appscoAccessOnBoardingPage');
            case 'dashboard-folder':
                return this.shadowRoot.getElementById('appscoDashboardFolderPage');
            case 'billing':
                return this.shadowRoot.getElementById('appscoBillingPage');
            case 'customer-billing':
                return this.shadowRoot.getElementById('appscoCustomerBillingPage');
            case 'billing-report':
                return this.shadowRoot.getElementById('appscoBillingReportPage');
            case 'policies':
                return this.shadowRoot.getElementById('appscoPoliciesPage');
            case 'policies-report':
                return this.shadowRoot.getElementById('appscoPoliciesReportPage');
            case 'get-started':
                return this.shadowRoot.getElementById('appscoGetStartedPage');
            case 'additional-options':
                return this.shadowRoot.getElementById('appscoAdditionalOptionsPage');
        }

        return null;
    }

    getCurrentAppscoPageActionsElement() {
        switch (this.page) {
            case 'home':
                return this.shadowRoot.getElementById('appscoHomePageActions');
            case 'resources':
                return this.shadowRoot.getElementById('appscoResourcesPageActions');
            case 'directory':
                return this.shadowRoot.getElementById('appscoDirectoryPageActions');
            case 'contacts':
                return this.shadowRoot.getElementById('appscoContactsPageActions');
            case 'licences':
                return this.shadowRoot.getElementById('appscoLicencesPageActions');
            case 'groups':
                return this.shadowRoot.getElementById('appscoGroupsPageActions');
            case 'account':
                return this.shadowRoot.getElementById('appscoAccountPageActions');
            case 'company-account':
                return this.shadowRoot.getElementById('appscoCompanyAccountPageActions');
            case 'customers':
                return this.shadowRoot.getElementById('appscoCustomersPageActions');
            case 'provisioning':
                return this.shadowRoot.getElementById('appscoProvisioningPageActions');
            case 'oauth-applications':
                return this.shadowRoot.getElementById('appscoOAuthApplicationsPageActions');
            case 'manage-oauth-application':
                return this.shadowRoot.getElementById('appscoManageOAuthApplicationPageActions');
            case 'dashboard-folder':
                return this.shadowRoot.getElementById('appscoDashboardFolderPageActions');
            case 'policies':
                return this.shadowRoot.getElementById('appscoPoliciesPageActions');
            case 'policies-report':
                return this.shadowRoot.getElementById('appscoPolicyReportPageActions');
            case 'company-home':
                return this.shadowRoot.getElementById('appscoCompanyHomePageActions');
        }
    }

    _onInfoAction() {
        this.getCurrentAppscoPageElement().toggleInfo();
    }

    _onFiltersAction() {
        this.getCurrentAppscoPageElement().toggleResource();
    }

    _onToggleAdditionalOptionsAction() {
        this.getCurrentAppscoPageElement().toggleAdditionalOptions();
    }

    _onShowBulkActions() {
        this.getCurrentAppscoPageActionsElement().showBulkActions();
    }

    _onHideResourcesBulkActions() {
        this.shadowRoot.getElementById('appscoResourcesPageActions').hideBulkActions();
    }

    _onHideContactBulkActions() {
        this.shadowRoot.getElementById('appscoContactsPageActions').hideBulkActions();
    }

    _onHideDirectoryBulkActions() {
        this.shadowRoot.getElementById('appscoDirectoryPageActions').hideBulkActions();
    }

    _showBulkSelectAll() {
        const element = this.getCurrentAppscoPageActionsElement();
        if (element && typeof element.showBulkSelectAll === 'function') {
            element.showBulkSelectAll();
        }
    }

    _hideBulkSelectAll() {
        const element = this.getCurrentAppscoPageActionsElement();
        if (element && typeof element.hideBulkSelectAll === 'function') {
            element.hideBulkSelectAll();
        }
    }

    _editApplication(application) {
        this.set('application', application);
        this._showManagePage('resource/' + application.alias);
    }

    _onEditApplication(event) {
        this._editApplication(event.detail.application);
    }

    _onInfoEditApplication(event) {
        this._editApplication(event.detail.application);
    }

    _onResourcesLoadForbidden(event) {
        if (this.currentCompany) {
            this.page = 'company-home';
        }
    }

    _onEditAdditionalOptionsAction() {
        this._showAdditionalOptionsPage();
    }

    _reloadHomePageApplications() {
        if (this.shadowRoot.getElementById('appscoHomePage').$) {
            this.shadowRoot.getElementById('appscoHomePage').reloadApplications();
        }
    }
    /**
     * Home page END
     */

    /**
     * Resource page START
     */
    _onApplicationUpdated(event) {
        const application = event.detail.application;

        switch (this.page) {
            case 'home':
            case 'resource':
                this.set('application', {});
                this.set('application', application);

                if (this.shadowRoot.getElementById('appscoHomePage').$) {
                    this.shadowRoot.getElementById('appscoHomePage').setApplication(application);
                }

                if (this.shadowRoot.getElementById('appscoDashboardFolderPage').$) {
                    this.shadowRoot.getElementById('appscoDashboardFolderPage').setApplication(application);
                }

                break;
            case 'company-home':
                this.set('_companyApplication', {});
                this.set('_companyApplication', application);

                if (this.shadowRoot.getElementById('appscoCompanyHomePage').$) {
                    this.shadowRoot.getElementById('appscoCompanyHomePage').setApplication(application);
                }

                if (this.shadowRoot.getElementById('appscoDashboardFolderPage').$) {
                    this.shadowRoot.getElementById('appscoDashboardFolderPage').setApplication(application);
                }

                this._reloadCompanyApplications();
                break;
            case 'contact-home':
                this.set('_companyApplication', {});
                this.set('_companyApplication', application);

                if (this.shadowRoot.getElementById('appscoContactHomePage').$) {
                    this.shadowRoot.getElementById('appscoContactHomePage').setApplication(application);
                }
                this._reloadCompanyApplications();
                break;
            case 'manage-resource':
                this.set('_companyApplication', {});
                this.set('_companyApplication', application);

                this._reloadCompanyHomePageApplications();
                this._reloadCompanyApplications();
                break;
        }
    }

    _onApplicationShared(event) {
        const application = event.detail.application,
            succeeded = event.detail.succeded,
            failed = event.detail.failed,
            applicationLogApi = application.meta.log;

        let message = '';

        if (parseInt(succeeded) !== 0) {
            message = 'Application ' + application.title + ' was successfully shared to ' + succeeded + ' accounts.';
        }

        if (parseInt(failed) !== 0) {
            message = (0 !== message.length) ?
                message + ' It was already shared to ' + failed + ' selected accounts. ' :
                'Application ' + application.title + ' was already shared to ' + failed + ' selected accounts.';
        }

        // In order to notify.
        this.set('application', {});
        this.set('application', application);

        this._notifyAboutApplicationLogChange(applicationLogApi);
        this._notify(message, true);
    }

    _onApplicationRemoved(event) {
        const application = event.detail.application,
            applications = [application],
            message = application.title + ' was successfully removed.';

        if (this.shadowRoot.getElementById('appscoHomePage').$) {
            this.shadowRoot.getElementById('appscoHomePage').removeApplications(applications);
        }

        this._showHomePage();
        this._notify(message);
        this._notifyAccountLog();
    }

    _onApplicationSettingsSaved(event) {
        const application = event.detail.application,
            applicationLogApi = application.meta.log,
            message = application.title + ' was successfully changed.';

        if (this.shadowRoot.getElementById('appscoHomePage').$) {
            this.shadowRoot.getElementById('appscoHomePage').reloadApplications();
        }
        if (this.shadowRoot.getElementById('appscoCompanyHomePage').$) {
            this.shadowRoot.getElementById('appscoCompanyHomePage').reloadApplications();
        }
        if (this.shadowRoot.getElementById('appscoContactHomePage').$) {
            this.shadowRoot.getElementById('appscoContactHomePage').reloadApplications();
        }
        if (this.shadowRoot.getElementById('appscoDashboardFolderPage').$) {
            this.shadowRoot.getElementById('appscoDashboardFolderPage').reloadApplications();
        }
        if (this.shadowRoot.getElementById('appscoResourcesPage').$) {
            this.shadowRoot.getElementById('appscoResourcesPage').modifyResources([application]);
        }

        this._notifyAboutApplicationLogChange(applicationLogApi);
        this._notify(message);
    }

    _onAutologinChanged() {
        this._notifyReloadApplications();
    }

    _onReloadApplications() {
        switch (this.page) {
            case 'resource':
                this._reloadHomePageApplications();

                break;

            case 'resources':
                this._reloadHomePageApplications();
                this._reloadCompanyHomePageApplications();
                this._reloadContactHomePageApplications();

                break;

            case 'manage-resource':
                this._reloadCompanyApplications();
                this._reloadCompanyHomePageApplications();
                this._reloadContactHomePageApplications();

                break;
        }
    }

    /**
     * Notifies application log api change.
     * Used to notify appsco-application-log to load log again.
     *
     * @param String applicationLogApi
     * @private
     */
    _notifyAboutApplicationLogChange(applicationLogApi) {
        this.set('application.meta.log', null);
        this.set('application.meta.log', applicationLogApi);
    }

    _onSelfSubscriptionRevoked(event) {
        const homePage = this.shadowRoot.getElementById('appscoHomePage');
        if (homePage.$) {
            homePage.removeApplications([event.detail.application]);
            homePage.setDefaultApplication();
        }
        this._notify('You have successfully revoked access to ' + event.detail.application.title + '.');
    }

    _onAccountSubscriptionRevoked(event) {
        this.set('application', {});
        this.set('application', event.detail.application);
        this._notify('You have successfully revoked access to ' + event.detail.application.title + ' for ' + event.detail.account.name);
    }

    _onSubscriptionRevoked(event) {
        switch (this.page) {
            case 'home':
                this._onSelfSubscriptionRevoked(event);
                break;

            case 'resource':
                this._onAccountSubscriptionRevoked(event);
                break;
        }
    }

    _onApplicationInstanceRevoked(event) {
        const homePage = this.shadowRoot.getElementById('appscoHomePage');
        if (homePage.$ && this.page === 'home') {
            homePage.removeApplications([event.detail.applicationInstance]);
            homePage.setDefaultApplication();
        }

        const companyHomePage = this.shadowRoot.getElementById('appscoCompanyHomePage');
        if (companyHomePage.$ && this.page === 'company-home') {
            companyHomePage.removeApplications([event.detail.applicationInstance]);
            companyHomePage.setDefaultApplication();
        }

        const dashboardFolderPage = this.shadowRoot.getElementById('appscoDashboardFolderPage');
        if (dashboardFolderPage.$ && this.page === 'dashboard-folder') {
            dashboardFolderPage.removeApplications([event.detail.applicationInstance]);
            dashboardFolderPage.setDefaultApplication();
        }

        const contactHomePage = this.shadowRoot.getElementById('appscoContactHomePage');
        if (contactHomePage.$ && this.page === 'contact-home') {
            contactHomePage.removeApplications([event.detail.applicationInstance]);
            contactHomePage.setDefaultApplication();
        }

        this._notify('You have successfully revoked access to ' + event.detail.applicationInstance.application.title + '.');
    }

    _onApplicationsRemovedFromHomePage() {
        this._showHomePage();
        this._notifyReloadApplications();
    }

    /**
     * Resource page END
     */

    /**
     * Account page START
     */

    _updateIfAdministrator(account) {
        if (this.shadowRoot.getElementById('appscoDirectoryPage').$ && (account.id === this.account.id)) {
            this.shadowRoot.getElementById('appscoDirectoryPage').updateAccount(account);
        }
    }

    _onAccountSettingsSaved(event) {
        const account = event.detail.account;

        switch (this.page) {
            case 'manage-account':
                this._notify('Account settings for ' + account.name + ' were successfully changed.');
                break;
            case 'account':
            case 'company-account':
                this._updateIfAdministrator(account);
                this._notify('Account settings were successfully changed.');
                break;
        }

        this._notifyReloadAccounts();
    }

    _onAccountPasswordChanged() {
        this._notify('Account password was successfully changed.');
        this._notifyReloadAccounts();
    }

    _onAuthorizedApplicationRevoked(event) {
        const application = event.detail.application;

        this._notify(application.title + ' was successfully revoked.');
        this.getCurrentAppscoPageElement().reloadAuthorizedApplications();

        this._notifyAccountLog();
        this._notifyReloadAccounts();
    }

    _onTwoFaEnabled() {
        this._notify("Two-factor authentication enabled.");

        this._notifyReloadAccounts();
    }

    _setupAfterTwoFaDisabled() {
        if (this.shadowRoot.getElementById('appscoAccountPage').$) {
            this.shadowRoot.getElementById('appscoAccountPage').setupAfterTwoFaDisabled();
        }

        if (this.shadowRoot.getElementById('appscoCompanyAccountPage').$) {
            this.shadowRoot.getElementById('appscoCompanyAccountPage').setupAfterTwoFaDisabled();
        }
    }

    _onTwoFaDisabled() {
        this._notifyReloadAccounts();
        this._setupAfterTwoFaDisabled();
        this._notify('Two-factor authentication disabled successfully.');
    }

    _onReloadAccountLog() {
        if (this.shadowRoot.getElementById('appscoAccountPage').$) {
            this.shadowRoot.getElementById('appscoAccountPage').reloadLog();
        }

        if (this.shadowRoot.getElementById('appscoCompanyAccountPage').$) {
            this.shadowRoot.getElementById('appscoCompanyAccountPage').reloadLog();
        }
    }

    _onTokenGenerated() {
        this._notify('Transfer token was successfully generated.');
    }
    /**
     * Account page END
     */

    /**
     * Upgrade page START
     */
    _onUpgradeTogglePricing() {
        this.$.appscoUpgradePage.togglePricing();
    }
    /**
     * Upgrade page END
     */

    /**
     * Resources page START
     */

    _editCompanyResource(resource) {
        this.set('_companyApplication', resource);
        this._showManagePage('manage-resource/' + resource.alias);
    }

    _onEditCompanyResource(event) {
        this._editCompanyResource(event.detail.resource);
    }

    _onInfoEditCompanyResource(event) {
        this._editCompanyResource(event.detail.resource);
    }

    _onOrgunitChanged(event) {
        this._notifyAccountLog();
    }

    _onImportCompanyResourcesFinished() {
        this._notifyAccountLog();
    }

    _onImportPersonalResourcesFinished(event) {
        const response = event.detail.response;
        let message = response.numberOfCustomApplications + response.numberOfSecureNotes + ' resources imported out of '
            + response.total + ', '
            + response.numberOfCustomApplications + ' custom applications created, '
            + response.numberOfSecureNotes + ' secure notes created, '
            + 'number of failed imports ' + response.numberOfFailed + '.';

        if (0 < response.numberOfCustomApplications || 0 < response.numberOfSecureNotes) {
            this._reloadHomePageApplications();
        }

        this._notify(message, true);
        this._notifyAccountLog();
    }

    _onResourceAdminAdded(event) {
        if (this.shadowRoot.getElementById('appscoManageApplicationPage').$) {
            this.shadowRoot.getElementById('appscoManageApplicationPage').reloadResourceAdmins();
        }
        this._notify('Resource admin successfully added.');
        this._notifyReloadApplications();
    }

    _onResourcesShared(event) {
        const resources = event.detail.resources,
            length = resources.length;

        let resource = resources[length - 1];

        for (let i = 0; i < length; i++) {
            if (this._companyApplication && this._companyApplication.self === resources[i].self) {
                resource = resources[i];
                break;
            }
        }

        this.set('_companyApplication', {});
        this.set('_companyApplication', resource);
        this.resetApplicationAssigneesPage();
        this._notify('Selected resources were successfully shared.');
        this._notifyReloadApplications();
        this._notifyReloadAccessOnBoarding();

        if (this.shadowRoot.getElementById('appscoAccessOnBoardingPage').$) {
            this.shadowRoot.getElementById('appscoAccessOnBoardingPage').reloadRoles();
        }
    }

    resetApplicationAssigneesPage() {
        if (this.shadowRoot.getElementById('appscoManageApplicationPageActions').$) {
            this.shadowRoot.getElementById('appscoManageApplicationPageActions').resetApplicationAssigneesPageActions();
        }
    }

    _modifyCompanyApplications(applications) {
        if (this.shadowRoot.getElementById('appscoResourcesPage').$) {
            this.shadowRoot.getElementById('appscoResourcesPage').modifyResources(applications);
        }
    }

    _reloadCompanyHomePageApplications() {
        if (this.shadowRoot.getElementById('appscoCompanyHomePage').$) {
            this.shadowRoot.getElementById('appscoCompanyHomePage').reloadApplications();
        }
    }

    _reloadContactHomePageApplications() {
        if (this.shadowRoot.getElementById('appscoContactHomePage').$) {
            this.shadowRoot.getElementById('appscoContactHomePage').reloadApplications();
        }
    }

    _reloadCompanyApplications() {
        if (this.shadowRoot.getElementById('appscoResourcesPage').$) {
            this.shadowRoot.getElementById('appscoResourcesPage').reloadResources();
        }
    }

    _onAssigneeClaimsChanged(event) {
        this._notifyReloadAccounts();
        this._onApplicationUpdated(event);
        this._notify('Claims for ' + event.detail.assignee.display_name + ' were successfully changed.');
    }

    _removeApplicationAssignee(application, assignee) {
        if (this.shadowRoot.getElementById('appscoResourcesPage').$) {
            this.shadowRoot.getElementById('appscoResourcesPage').removeResourceAssignee(application, assignee);
        }

        if (this.shadowRoot.getElementById('appscoManageApplicationPage').$) {
            this.shadowRoot.getElementById('appscoManageApplicationPage').removeApplicationAssignee(application, assignee);
        }
    }

    _onAssigneeAccessRevoked(event) {
        const application = event.detail.application,
            assignee = event.detail.assignee;

        this.resetApplicationAssigneesPage();
        this._removeApplicationAssignee(application, assignee);

        if (this.shadowRoot.getElementById('appscoManageAccountPage').$) {
            this.shadowRoot.getElementById('appscoManageAccountPage').reloadApplications();
        }

        if (this.shadowRoot.getElementById('appscoManageContactPage').$) {
            this.shadowRoot.getElementById('appscoManageContactPage').reloadApplications();
        }

        this._notifyReloadApplications();
        this._notifyReloadAccounts();
        this._notifyReloadAccessOnBoarding();
        this._notify('Access for ' + assignee.display_name + ' on ' + application.title + ' was revoked successfully.');
    }

    _onResourceAdminRevoked(event) {
        const application = event.detail.application,
            assignee = event.detail.assignee;

        if (this.shadowRoot.getElementById('appscoManageApplicationPage').$) {
            this.shadowRoot.getElementById('appscoManageApplicationPage').reloadResourceAdmins();
        }

        if (this.shadowRoot.getElementById('appscoManageAccountPage').$) {
            this.shadowRoot.getElementById('appscoManageAccountPage').reloadResourceAdmins();
        }

        this._notifyReloadApplications();
        this._notify('Resource admin access for ' + assignee.display_name + ' on ' + application.title + ' was revoked successfully.');
    }

    _onApplicationsRemoved(event) {
        if (this.shadowRoot.getElementById('appscoResourcesPage').$) {
            this.shadowRoot.getElementById('appscoResourcesPage').removeResources(event.detail.applications);
        }

        this._showCompanyResourcesPage();
        this._notify('Selected resources were successfully removed from company.');

        this._notifyReloadApplications();
    }

    _onApplicationRemovedFromGroup(event) {
        const application = event.detail.application,
            group = event.detail.group;

        this.shadowRoot.getElementById('appscoManageApplicationPage').removeGroup(group);
        this.shadowRoot.getElementById('appscoManageApplicationPage').reload();

        this._notify(application.application.title + ' has been successfully removed from group ' + group.name + '.');
        this._notifyReloadApplications();
    }

    _onResourceImageChanged() {
        this._notifyReloadApplications();
        this._reloadHomePageApplications();
    }

    _onImageUploadError(event) {
        this._notify('Upload failed: ' + event.detail);
    }

    _onPageSettingsChanged(event) {
        const pageComponent = this.getCurrentAppscoPageElement(),
            pageConfig = event.detail.pageConfig,
            page = event.detail.page,
            _pageConfig = JSON.parse(JSON.stringify(this._pageConfig));

        if (pageComponent.resetListFilters) {
            pageComponent.resetListFilters();
        }

        _pageConfig[page] = pageConfig[page];
        this.set('_pageConfig', {});
        this.set('_pageConfig', _pageConfig);
    }
    /**
     * Resources page END
     */

    /**
     * Directory page START
     */
    _evaluateSubscriptionLicences() {
        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').evaluateSubscriptionLicences();
        }
    }

    _onAccountsRemoved(event) {
        this._notifyAccountLog();
        this._notifyReloadAccessOnBoarding();
    }

    _onAccountImportFinished() {
        this._notifyAccountLog();
    }

    _onAccountsAddedToOrgunit(event) {
        const accounts = event.detail.accounts,
            length = accounts.length;

        this._notify('Selected accounts were successfully added to ' + event.detail.orgunit.name + '.');

        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').modifyAccounts(accounts);
        }

        if (accounts.length === 1) {
            this._role = accounts[0];
        }

        for (let i = 0; i < length; i++) {
            if (accounts[i].account.email === this.account.email) {
                this._reloadHomePageApplications();
                break;
            }
        }

        this._notifyAccountLog();
        this._notifyReloadApplications();
        this._notifyReloadAccounts();
    }

    _onManageDomains() {
        this.shadowRoot.getElementById('appscoCompanyPage').showDomainsPage = true;
        this._showCompanyPage();
    }

    _reloadCompanyAccounts() {
        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').reloadAccounts();
        }
    }

    _reloadCompanyContacts() {
        if (this.shadowRoot.getElementById('appscoContactsPage').$) {
            this.shadowRoot.getElementById('appscoContactsPage').reloadContacts();
        }
    }

    _onReloadAccounts() {
        if ('manage-account' === this.page) {
            this._reloadCompanyAccounts();
        }
    }
    /**
     * Directory page END
     */

    /**
     * Manage Account page START
     */
    _onEditAccount(event) {
        const role = event.detail.role;

        this.set('_role', role);
        this._showManagePage('manage-account/' + role.alias);
    }

    _onCompanyAccountPasswordChanged(event) {
        this._notify('Password for ' + event.detail.account.name + ' was successfully changed.');

        this._notifyReloadAccounts();
    }

    _onAccountRemovedFromOrgunit(event) {
        const role = event.detail.account;

        if (role.account.email === this.account.email) {
            this._reloadHomePageApplications();
        }

        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').modifyAccounts([role]);
        }

        this._role = role;
        this._notify(role.account.name + ' has been removed from ' + event.detail.orgunit.name + ' organization unit.');

        this._notifyAccountLog();
        this._notifyReloadApplications();
        this._notifyReloadAccounts();
    }

    _onAccountRemovedFromGroup(event) {
        const role = event.detail.account,
            group = event.detail.group;

        const manageAccountPage = this.shadowRoot.getElementById('appscoManageAccountPage');
        if (manageAccountPage.$) {
            manageAccountPage.removeGroup(group);
        }

        if (role.account.email === this.account.email) {
            this._reloadHomePageApplications();
        }

        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').modifyAccounts([role]);
        }

        this._role = role;
        this._notify(role.account.name + ' has been successfully removed from group ' + group.name + '.');

        this._notifyAccountLog();
        this._notifyReloadApplications();
        this._notifyReloadAccounts();
    }

    _onContactRemovedFromGroup(event) {
        const contact = event.detail.contact,
            group = event.detail.group;

        const manageContactPage = this.shadowRoot.getElementById('appscoManageContactPage');
        if (manageContactPage.$) {
            manageContactPage.removeGroup(group);
            manageContactPage.reload();
        }

        const contactsPage = this.shadowRoot.getElementById('appscoContactsPage');
        if (contactsPage.$) {
            contactsPage.reloadContacts();
        }
        this._notify(contact.display_name + ' has been successfully removed from group ' + group.name + '.');
    }

    _onAccountRoleChanged(event) {
        const accountName = event.detail.account.account.name,
            role = event.detail.role;
        let message = '';

        if (role.value) {
            message = role.name + ' role is given to ' + accountName + '.';
        }
        else {
            message = role.name + ' role is revoked from ' + accountName + '.';
        }

        this._notify(message);
        this._notifyReloadAccounts();
        this._reloadAccountLog();
    }

    /**
     * Manage Account page END
     */

    /**
     * Groups page START
     */
    _onEditCompanyGroupAction(event) {
        const group = event.detail.item;

        this.set('_group', group);
        this._showManagePage('manage-group/' + group.alias);
    }
    /**
     * Groups page END
     */


    /**
     * Manage Contact page START
     */
    _onEditContactAction(event) {
        const contact = event.detail.contact;

        if (this.shadowRoot.getElementById('appscoManageContactPage').$) {
            this.shadowRoot.getElementById('appscoManageContactPage').setContact(contact);
        }

        this._showManagePage('manage-contact/' + contact.alias);
    }

    _onContactConverted(event) {
        const contact = event.detail.contact;

        if (this.shadowRoot.getElementById('appscoContactsPage').$) {
            this.shadowRoot.getElementById('appscoContactsPage').removeContacts([contact]);
        }

        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').reloadAccounts();
        }

        this._showContactsPage();
        this._notify('Contact ' + contact.display_name + ' has been successfully converted to company user.');
    }

    _onCustomerRemoved(event) {
        const customer = event.detail.customer;

        if (this.shadowRoot.getElementById('appscoCustomersPage').$) {
            this.shadowRoot.getElementById('appscoCustomersPage').removeCustomers([customer]);
        }

        this._showCustomersPage();
        this._notify('Customer ' + customer.name + ' has been deleted from company.');
    }

    _onContactDeleted(event) {
        const contact = event.detail.contact;

        if (this.shadowRoot.getElementById('appscoContactsPage').$) {
            this.shadowRoot.getElementById('appscoContactsPage').removeContacts([contact]);
        }

        this._showContactsPage();
        this._notify('Contact ' + contact.display_name + ' has been deleted from company.');
    }
    /**
     * Manage Contact page END
     */

    /**
     * Get started page START
     */
    _onTutorialStart(event) {
        this.$.appscoTutorial.startTutorial(event.detail.tutorialId);
    }

    onTutorialProgressChanged(event) {
        this._progress = event.detail.progress;
    }

    /**
     * Get started page END
     */

    /**
     * Access On-boarding page START
     */
    _notifyReloadAccessOnBoarding() {
        this.dispatchEvent(new CustomEvent('reload-access-of-boarding', { bubbles: true, composed: true }));
    }

    _onReloadAccessOnBoarding() {
        if (this.shadowRoot.getElementById('appscoAccessOnBoardingPage').$) {
            this.shadowRoot.getElementById('appscoAccessOnBoardingPage').reloadRoles();
        }
    }
    /**
     * Access On-boarding page END
     */

    /**
     * Billing page START
     */
    _setSubscription(subscription) {
        const directoryPage = this.shadowRoot.getElementById('appscoDirectoryPage');
        if (directoryPage.$) {
            directoryPage.setSubscription(subscription);

            return;
        }

        directoryPage.subscription = subscription;
        directoryPage.subscriptionLoaded = true;
    }

    _reloadSubscription() {
        if (this.shadowRoot.getElementById('appscoBillingPage').$) {
            this.shadowRoot.getElementById('appscoBillingPage').reloadSubscription();
        }

        if (this.shadowRoot.getElementById('appscoCustomerBillingPage').$) {
            this.shadowRoot.getElementById('appscoCustomerBillingPage').reloadSubscription();
        }
    }

    _onSubscriptionUpdated(event) {
        this._reloadSubscription(event.detail.subscription);
        this._notify('Subscription has been successfully changed.');
    }

    _onSubscriptionChanged(event) {
        this._setSubscription(event.detail.subscription);
        this._reloadSubscription(event.detail.subscription);
        this._evaluateSubscriptionLicences();
        this._notify('Subscription has been successfully changed.');
    }

    _onSubscriptionCanceled(event) {
        this._setSubscription(event.detail.subscription);
        this._reloadSubscription();
        this._notify('Subscription has been successfully canceled.');
    }

    _onCreditCardAdded(event) {
        if (this.shadowRoot.getElementById('appscoBillingPage').$) {
            this.shadowRoot.getElementById('appscoBillingPage').setCreditCard(event.detail.credit_card);
        }
        if (this.shadowRoot.getElementById('appscoCustomerBillingPage').$) {
            this.shadowRoot.getElementById('appscoCustomerBillingPage').setCreditCard(event.detail.credit_card);
        }
        this._notify('Credit card has been successfully saved.');
    }

    /**
     * Billing page END
     */

    /**
     * Provisioning page START
     */

    _onEditIntegrationAction(event) {
        const integration = event.detail.integration;

        if (this.shadowRoot.getElementById('appscoManageIntegrationPage').$) {
            this.shadowRoot.getElementById('appscoManageIntegrationPage').setIntegration(integration);
        }

        this._showManagePage('manage-integration/' + integration.alias);
    }

    _onIntegrationSettingsChanged(event) {
        const integration = event.detail.integration;

        if (this.shadowRoot.getElementById('appscoProvisioningPage').$) {
            this.shadowRoot.getElementById('appscoProvisioningPage').setIntegration(integration);
        }

        this._notify('Settings for integration ' + integration.name + ' has been successfully saved.');
    }

    _onIntegrationSetup(event) {
        this._selectedIntegration = event.detail.integration;
        this.set('routeData.page', 'provisioning-settings');
    }

    /**
     * Provisioning page END
     */

    /**
     * Company page START
     */
    _onCompanySettingsChanged(event) {
        this._setAccountCompany(event.detail.company);
        this._notify('Company settings were successfully saved.');
    }

    _onCompanyIPWhiteListChanged(event) {
        this._setAccountCompany(event.detail.company);
        this._notify('Company IP whitelist was successfully saved.');
    }

    _onCompanyBrandSettingsChanged(event) {
        this._setAccountCompany(event.detail.company);
        this._notify('Company brand settings were successfully saved.');
    }

    _onCompanyBrandedLoginChanged() {
        this._notify('Branded login settings were successfully saved.');
    }

    _onCompanyLogoChanged(event) {
        this._setAccountCompany(event.detail.company);
        this._notify('Company logo was successfully saved.');

        this._notifyAccountLog();
    }

    _onCompanyDashboardLogoChanged(event) {
        this._setAccountCompany(event.detail.company);
        this._notify('Company dashboard logo was successfully saved.');

        this._notifyAccountLog();
    }

    _upgradedToBusiness(e) {
        this.account = {};
        this.account = e.detail.account;

        this.currentCompany = this.account.companies[this.account.companies.length - 1];
        this._setProduct(true);

        this.set('routeData.page', 'get-started');
        this._notify('Upgrade to AppsCo business succeeded.');

        setTimeout(function() {
            this._notify('Please setup your company settings.');
        }.bind(this), 2000);
    }

    _onUpgradeToCompanyFailed(event) {
        this._notify(this._apiErrors.getError(event.detail.error), true);
    }

    _onDomainAdded(event) {
        const domain = event.detail.domain;

        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').evaluateDomainVerification({
                domain: domain,
                added: true,
                removed: false
            });
        }

        this._notify('Domain ' + domain.domain + ' was successfully saved.');

        const companyPage = this.shadowRoot.getElementById('appscoCompanyPage');
        if (companyPage.$) {
            companyPage.addDomain(domain);
        }
        this.$.appscoTutorial.notifyDomainAdded(domain);
    }

    _onIntegrationRemoved(event) {
        if (this.shadowRoot.getElementById('appscoProvisioningPage').$) {
            this.shadowRoot.getElementById('appscoProvisioningPage').reloadIntegrations();
        }
        this._showCompanyProvisioningPage();
        this._notify('Integration was successfully removed.');
    }

    _onDomainRemoved(event) {
        const domain = event.detail.domain;

        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').evaluateDomainVerification({
                domain: domain,
                added: false,
                removed: true
            });
        }

        const companyPage = this.shadowRoot.getElementById('appscoCompanyPage');
        if (companyPage.$) {
            companyPage.removeDomain(domain);
        }

        this._notify('Domain ' + domain.domain + ' was successfully removed.');
    }

    _onDomainVerified(event) {
        const domain = event.detail.domain;

        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').hideDomainNotVerifiedInfo();
        }

        const companyPage = this.shadowRoot.getElementById('appscoCompanyPage');

        if (companyPage.$) {
            companyPage.reloadIdPDomains();
            companyPage.modifyDomain(domain);
        }

        this._notify('Domain ' + domain.domain + ' was successfully verified.');
    }

    _onCompanyDomainsLoadFinished() {
        this._companyDomainsLoaded = true;
    }
    /**
     * Company page END
     */

    /**
     * Company Home page START
     */

    _openFolder(folder) {
        this._activeFolder = folder;
        this._showManagePage('dashboard-folder/' + folder.alias);
    }

    _onFolderTapped(event) {
        this._openFolder(event.detail.folder);
    }

    _addResourceToCompanyHomePage(resource) {
        if (this.shadowRoot.getElementById('appscoCompanyHomePage').$) {
            this.shadowRoot.getElementById('appscoCompanyHomePage').addApplications([resource]);
        }
    }

    _removeResourceFromCompanyHomePage(resource) {
        if (this.shadowRoot.getElementById('appscoCompanyHomePage').$) {
            this.shadowRoot.getElementById('appscoCompanyHomePage').removeApplications([resource]);
        }
    }

    _addResourceToDashboardFolderPage(resource, folder) {
        const dashboardFolderPage = this.shadowRoot.getElementById('appscoDashboardFolderPage');

        if (dashboardFolderPage.$ && (folder.alias === dashboardFolderPage.getFolder().alias)) {
            dashboardFolderPage.addApplications([resource]);
        }
    }

    _removeResourceFromDashboardFolderPage(resource, folder) {
        const dashboardFolderPage = this.shadowRoot.getElementById('appscoDashboardFolderPage');

        if (dashboardFolderPage.$ && (folder.alias === dashboardFolderPage.getFolder().alias)) {
            dashboardFolderPage.removeApplications([resource]);
        }
    }

    _onResourceMovedToFolder(event) {
        const resource = event.detail.resource,
            folder = event.detail.folder,
            sourceFolder = event.detail.sourceFolder;

        if (sourceFolder && folder.alias !== sourceFolder.alias) {
            this._removeResourceFromDashboardFolderPage(resource, sourceFolder);
        }

        switch (this.page) {
            case 'home':
                this._reloadHomePageApplications();
                this._addResourceToDashboardFolderPage(resource, folder);
                break;

            case 'company-home':
                this._removeResourceFromCompanyHomePage(resource);
                this._addResourceToDashboardFolderPage(resource, folder);

                break;

            case 'contact-home':
                this._reloadContactHomePageApplications();
                break;
        }

        this._notify('Resource ' + resource.title + ' has been moved to folder ' + folder.title + '.');
    }

    _onResourceRemovedFromFolder(event) {
        const resource = event.detail.resource,
            folder = event.detail.folder;

        this._removeResourceFromDashboardFolderPage(resource, folder);
        this._addResourceToCompanyHomePage(resource);
        this._reloadHomePageApplications();
        this._reloadContactHomePageApplications();

        this._notify('Resource ' + resource.title + ' has been removed from folder ' + folder.title + '.');
    }
    /**
     * Company Home page END
     */

    /**
     * Groups page START
     */

    _addGroup(group) {
        if (this.shadowRoot.getElementById('appscoResourcesPage').$) {
            this.shadowRoot.getElementById('appscoResourcesPage').addGroup(group);
        }

        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').addGroup(group);
        }

        if (this.shadowRoot.getElementById('appscoContactsPage').$) {
            this.shadowRoot.getElementById('appscoContactsPage').addGroup(group);
        }

        if (this.shadowRoot.getElementById('appscoGroupsPage').$) {
            this.shadowRoot.getElementById('appscoGroupsPage').addGroup(group);
            this._reloadGroups();
        }
    }

    _renameGroups(groups) {
        if (this.shadowRoot.getElementById('appscoGroupsPage').$) {
            this.shadowRoot.getElementById('appscoGroupsPage').modifyGroups(groups);
        }
        if (this.shadowRoot.getElementById('appscoResourcesPage').$) {
            this.shadowRoot.getElementById('appscoResourcesPage').modifyGroups(groups);
        }

        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').modifyGroups(groups);
        }

        if (this.shadowRoot.getElementById('appscoContactsPage').$) {
            this.shadowRoot.getElementById('appscoContactsPage').modifyGroups(groups);
        }
    }

    _onGroupAdded(event) {
        const group = event.detail.group;

        this._addGroup(group);
        this._notify('Group ' + group.name + ' was successfully saved.');
    }

    _onGroupRenamed(event) {
        const group = event.detail.group;

        this._renameGroups([group]);
    }


    _onRemovedGroups(event) {
        const groups = event.detail.groups;
        if (this.shadowRoot.getElementById('appscoResourcesPage').$) {
            this.shadowRoot.getElementById('appscoResourcesPage').removeGroups(groups);
        }

        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').removeGroups(groups);
        }

        if (this.shadowRoot.getElementById('appscoContactsPage').$) {
            this.shadowRoot.getElementById('appscoContactsPage').removeGroups(groups);
        }

        if (this.shadowRoot.getElementById('appscoGroupsPage').$) {
            this.shadowRoot.getElementById('appscoGroupsPage').removeGroups(groups);
        }

        this._reloadCompanyApplications();
        this._reloadCompanyAccounts();
        this._reloadCompanyContacts();
    }

    _onGroupRemoved(event) {
        const group = event.detail.group;

        this._removeGroup(group);
        this._reloadApplicationsForCompanyAdministrator();
        this._showGroupsPage();
        this._notify('Group ' + group.name + ' was successfully removed.');
    }

    _removeGroup(group) {
        if (this.shadowRoot.getElementById('appscoResourcesPage').$) {
            this.shadowRoot.getElementById('appscoResourcesPage').removeGroup(group);
        }

        if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
            this.shadowRoot.getElementById('appscoDirectoryPage').removeGroup(group);
        }

        if (this.shadowRoot.getElementById('appscoContactsPage').$) {
            this.shadowRoot.getElementById('appscoContactsPage').removeGroup(group);
        }

        if (this.shadowRoot.getElementById('appscoGroupsPage').$) {
            this.shadowRoot.getElementById('appscoGroupsPage').removeGroup(group);
        }

        this._reloadCompanyApplications();
        this._reloadCompanyAccounts();
        this._reloadCompanyContacts();
    }

    _handleResourcesAddedToGroupResponse(groups, items, resourceType) {
        const length = items.length,
            oneItem = (length === 1);

        if (this.shadowRoot.getElementById('appscoManageGroupPage').$) {
            this.shadowRoot.getElementById('appscoManageGroupPage').addGroupItems(groups, items, resourceType);
        }

        if (this.shadowRoot.getElementById('appscoGroupsPage').$) {
            this.shadowRoot.getElementById('appscoGroupsPage').recalculateTotals(groups, resourceType);
        }

        switch (resourceType) {
            case 'resource':
                if (oneItem) {
                    this._companyApplication = items[0];
                }

                this._notify('Selected resources were successfully shared to groups.');
                this._modifyCompanyApplications(items);
                this._reloadCompanyHomePageApplications();
                this._reloadHomePageApplications();
                this._notifyAccountLog();
                this._notifyReloadApplications();
                this._notifyReloadAccounts();

                break;
            case 'role':
                if (oneItem) {
                    this._role = items[0];
                }

                if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
                    this.shadowRoot.getElementById('appscoDirectoryPage').modifyAccounts(items);
                }

                for (let i = 0; i < length; i++) {
                    if (items[i].account.email === this.account.email) {
                        this._reloadHomePageApplications();
                        this._reloadCompanyHomePageApplications();
                        this._reloadContactHomePageApplications();
                        break;
                    }
                }

                this._notify('Selected users were successfully added to groups.');
                this._notifyAccountLog();
                this._notifyReloadApplications();
                this._notifyReloadAccounts();

                break;
            case 'contact':
                this._notify('Selected contacts were successfully added to groups.');

                if (this.shadowRoot.getElementById('appscoContactsPage').$) {
                    this.shadowRoot.getElementById('appscoContactsPage').modifyContacts(items);
                }

                break;
            default:
                return false;
        }
    }

    _onGroupsAddedToResources(event) {
        this._handleResourcesAddedToGroupResponse(event.detail.groups, event.detail.items, event.detail.resourceType);
    }

    _onResourcesAddedToGroup(event) {
        this._handleResourcesAddedToGroupResponse([event.detail.group], event.detail.items, event.detail.resourceType);
    }

    _onResourceRemovedFromGroup(event) {
        const item = event.detail.item,
            group = event.detail.group,
            resourceType = event.detail.resourceType;

        if (this.shadowRoot.getElementById('appscoGroupsPage').$) {
            this.shadowRoot.getElementById('appscoGroupsPage').removeGroupItems(group, [item], resourceType);
        }

        if (this.shadowRoot.getElementById('appscoManageGroupPage').$) {
            this.shadowRoot.getElementById('appscoManageGroupPage').removeGroupItems(group, [item], resourceType);
        }

        switch (resourceType) {
            case 'resource':
                this._notify(item.application.title + ' was successfully removed from ' + group.name + ' group.');

                this._modifyCompanyApplications([item]);
                this._reloadCompanyHomePageApplications();
                this._reloadHomePageApplications();
                this._notifyAccountLog();
                this._notifyReloadApplications();
                this._notifyReloadAccounts();

                break;
            case 'role':
                this._notify(item.account.display_name + ' was successfully removed from ' + group.name + ' group.');

                if (this.shadowRoot.getElementById('appscoDirectoryPage').$) {
                    this.shadowRoot.getElementById('appscoDirectoryPage').modifyAccounts([item]);
                }

                for (let i = 0; i < length; i++) {
                    if (item.account.email === this.account.email) {
                        this._reloadHomePageApplications();
                        this._reloadCompanyHomePageApplications();
                        break;
                    }
                }

                this._notifyAccountLog();
                this._notifyReloadApplications();
                this._notifyReloadAccounts();

                break;
            case 'contact':
                this._notify(item.account.display_name + ' was successfully removed from ' + group.name + ' group.');

                if (this.shadowRoot.getElementById('appscoContactsPage').$) {
                    this.shadowRoot.getElementById('appscoContactsPage').modifyContacts([item]);
                }

                break;
            default:
                return false;
        }
    }
    /**
     * Groups page END
     */

    /**
     * Customers page START
     */

    _onEditCustomerAction(event) {
        const customer = event.detail.customer;
        if (this.shadowRoot.getElementById('appscoManageCustomerPage').$) {
            this.shadowRoot.getElementById('appscoManageCustomerPage').setCustomer(customer);
        }
        this._showManagePage('manage-customer/' + customer.alias);
    }

    _onCustomersImportFinished() {
        this._notifyAccountLog();
    }

    _reloadPartnerAdmins(customers) {
        if (this.shadowRoot.getElementById('appscoManageCustomerPage').$) {
            this.shadowRoot.getElementById('appscoManageCustomerPage').reloadPartnerAdmins(customers);
        }
    }

    _reloadCustomersInfo(customers) {
        if (this.shadowRoot.getElementById('appscoCustomersPage').$) {
            this.shadowRoot.getElementById('appscoCustomersPage').reloadCustomersInfo(customers);
        }
    }

    _reloadGroups() {
        if (this.shadowRoot.getElementById('appscoGroupsPage').$) {
            this.shadowRoot.getElementById('appscoGroupsPage').reloadGroups();
        }
    }

    _reloadAccountLog() {
        if (this.shadowRoot.getElementById('appscoManageAccountPage').$) {
            this.shadowRoot.getElementById('appscoManageAccountPage').reloadAccountLog();
        }
    }

    _removeCompaniesFromSwitcher(companies) {
        this.$.appscoHeader.removeProductCompanies(companies);
    }

    _onCustomerAdded(event) {
        this._getLoggedAccount();
    }

    _onRemovedCustomers(event) {
        this._removeCompaniesFromSwitcher(event.detail.customers);
    }

    _onPartnerAdminsAdded(event) {
        const customers = event.detail.customers;

        this._reloadCustomersInfo(customers);
        this._reloadPartnerAdmins(customers);
        this._notify('Partner admin added successfully.');
    }

    /**
     * Customers page END
     */

    _onExportAccessReportAction() {
        this.exportReport(
            this._exportAccessReportApi,
            'GET',
            this.shadowRoot.getElementById('appscoAccessReportPage')
        );
    }

    _onExportComplianceReportAction() {
        this.exportReport(
            this._exportComplianceReportApi,
            'POST',
            this.shadowRoot.getElementById('appscoComplianceReportPage')
        );
    }

    _onExportPoliciesReportAction() {
        this.exportReport(
            this._exportPoliciesReportApi,
            'POST',
            this.shadowRoot.getElementById('appscoPoliciesReportPage')
        );
    }

    _onExportBillingReportAction() {
        this.exportReport(
            this._exportBillingReportApi,
            'GET',
            this.shadowRoot.getElementById('appscoBillingReportPage')
        );
    }

    /**
     * Oauth page START
     */
    _reloadOAuthApplications() {
        if (this.shadowRoot.getElementById('appscoOAuthApplicationsPage').$) {
            this.shadowRoot.getElementById('appscoOAuthApplicationsPage').reloadOAuthApplications();
        }
    }

    _onEditOAuthApplicationAction(event) {
        const application = event.detail.application;

        if (this.shadowRoot.getElementById('appscoManageOAuthApplicationPage').$) {
            this.shadowRoot.getElementById('appscoManageOAuthApplicationPage').setApplication(application);
        }

        this._showManagePage('manage-oauth-application/' + application.alias);
    }

    _onOAuthApplicationUpdated(event) {
        const application = event.detail.application;

        this._reloadOAuthApplications();
        this._notify('OAuth application ' + application.title + ' has been successfully saved.');
    }

    _onOAuthApplicationRemoved(event) {
        this._showOAuthApplicationsPage();
        this._reloadOAuthApplications();
        if (this.shadowRoot.getElementById('appscoOAuthApplicationsPage').$) {
            this.shadowRoot.getElementById('appscoOAuthApplicationsPage').hideInfo();
        }
        this._notify('OAuth application ' + event.detail.application.title + ' has been successfully removed.');
    }

    /**
     * Global START
     */
    _setProgressBar(page) {
        const pages = dom(this.root).querySelectorAll('[page]');
        for(let index = 0; index< pages.length; index++) {
            if(pages[index].getAttribute('name') === page) {
                pages[index].pageLoaded ? this._hideProgressBar() : this._showProgressBar();
                return;
            }
        }
        this._hideProgressBar();
    }

    _onPageLoaded() {
        this._hideProgressBar();
    }

    _showProgressBar() {
        this.$.pageProgress.hidden = false;
    }

    _hideProgressBar() {
        this.$.pageProgress.hidden = true;
    }

    _computeCompany(page, companyPageResolved) {
        if (!companyPageResolved) {
            return false;
        }
        const companyPages = dom(this.root).querySelectorAll('[company-page]');
        for(let index = 0; index < companyPages.length; index++) {
            if(companyPages[index].getAttribute('name') === page) {
                return 'dashboard-folder' !== page || !this._personalFolderPage;
            }
        }
        return false;
    }

    _computeBrandLogo(company, companyPage) {
        if (companyPage && company.company && company.company.image) {
            return company.company.image;
        }

        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAgCAYAAAB+ZAqzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVZJREFUeNrsmOENgjAQhcE4AG5QN2AERnCEjsAIdQJG6AiO0BEcATdwhLONxJR6V1u8Ij98ycXkrL3HR+8gVlWCAEDa0EjuaqP1csLGkPJ7FtlNR3hKIzknNeV0uC5YqzhNSc/AiORgKiyCnCbWSm5ar02DHEzFhyB3J9aCf/tL02qckSCvbHSAy60Va9BSSGFn1gAt1zjNlmj5Mr+gdYE0aXZahFmFdOgnSW5aEikivHmWo1NJWnoBLf8ItFujNWumErSwDs3V+xjJoNURtBTwSC6lZQrRmtXhoNXa6IFPIwctE3lYf3crv6TVER26Ki29RVpiNVoJkz+FlmGnlTD5Y7ROia82q9Iat0ALG5xyml3laUXMqkSKZWgRpiha4k+LMPYzWvuYsbquDxhFxn8fzmTt3DNnP9xVNgymbvbCj9SXu8zNeiZTUVocZ27pe/3HA/8QYABzJAP50CmRFwAAAABJRU5ErkJggg==";
    }

    _computeBrandTitle(company, companyPage) {
        if (!companyPage) {
            return 'AppsCo';
        }

        return '';
    }

    _setAccountCompany(company) {
        const newCompany = JSON.parse(JSON.stringify(this.currentCompany)),
            companies = JSON.parse(JSON.stringify(this.account.companies)),
            length = companies.length;

        newCompany.company = company;

        this.set('currentCompany', {
            company: {}
        });

        this.set('currentCompany', newCompany);

        for (let i = 0; i < length; i++) {
            if (company.alias === companies[i].company.alias) {
                companies[i].company = company;
                break;
            }
        }
        companies.sort(function(a, b){
            return a.company.name.toLowerCase() < b.company.name.toLowerCase() ? -1 :
                a.company.name.toLowerCase() < b.company.name.toLowerCase() ? 1: 0;
        });

        this.set('account.companies', companies);
    }

    _computePersonaFolderPage(activeFolder) {
        return !(activeFolder && activeFolder.company);
    }

    _activeFolderChanged(activeFolder) {
        if (!activeFolder || !activeFolder.company) {
            return;
        }
        const company = this._findCompanyByPath(activeFolder.company);
        if (!company) {
            return;
        }
        if (undefined === this.currentCompany || this.currentCompany.company.self !== company.company.self) {
            this.set('currentCompany', company);
            this._setProduct(true);
        }
    }

    _findCompanyByPath(path) {
        if (!this._companiesAccountHasPermissionTo) {
            return null;
        }
        for (let x = 0; x < this._companiesAccountHasPermissionTo.length; x++) {
            const company = this._companiesAccountHasPermissionTo[x];
            if (company.company && company.company.self === path) {
                return company;
            }
        }

        return null;
    }

    /**
     * This method will reload page content for both from page and to page
     */
    _onPageAnimationFinish(event) {
        if (event.detail.toPage.$ && typeof event.detail.toPage.initializePage !== 'undefined') {
            beforeNextRender(this, () => event.detail.toPage.initializePage());
        }

        if (event.detail.fromPage.$ && typeof event.detail.fromPage.resetPage !== 'undefined') {
            if(event.detail.fromPage.getAttribute('name') === 'home') {
                this._applicationsApi = this.api.foldersApi + '/icons';
            }
            afterNextRender(this, () => event.detail.fromPage.resetPage());
        }
    }

    /**
     * This method will reload page actions in the previous page.
     * Reason to do so is to reset the filters once user leaves the page.
     */
    _onPageActionsAnimationFinish(event) {
        if (event.detail.fromPage.$ && typeof event.detail.fromPage.resetPage !== 'undefined') {
            afterNextRender(this, () => event.detail.fromPage.resetPage());
        }
    }

    _notifyAccountLog() {
        this.dispatchEvent(new CustomEvent('reload-account-log', { bubbles: true, composed: true }));
    }

    _notifyReloadApplications() {
        this.dispatchEvent(new CustomEvent('reload-applications', { bubbles: true, composed: true }));
    }

    _notifyReloadAccounts() {
        this.dispatchEvent(new CustomEvent('reload-accounts', { bubbles: true, composed: true }));
    }

    _onNotify(event) {
        const persistent = event.detail.persistent ? event.detail.persistent : false;
        this._notify(event.detail.message, persistent);
    }

    _notify(message, persistent) {
        const toast = this.$.toast;

        this._toastPersistence = persistent;
        toast.duration = persistent ? 0 : 5000;

        this._toastMessage = message;

        if (!toast.opened) {
            toast.open();
        }
    }

    _closeToastMessage() {
        const toast = this.$.toast;

        if (toast.opened) {
            toast.close();
            this._toastMessage = '';
        }
    }

    _onCloseToastAction() {
        this._closeToastMessage();
    }

    _onToastMessageClosed(event) {
        if (event.detail.canceled) {
            this.$.toast.open();
        }
    }

    _onError(event) {
        this._showPage404();
    }

    _getCookie(cookieName) {
        const name = cookieName + '=',
            decodedCookie = decodeURIComponent(document.cookie),
            cookies = decodedCookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];

            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }

            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }

        return '';
    }

    _isLocalStorageSupported () {
        return window.localStorage
            && typeof(window.localStorage.setItem) === 'function'
            && typeof(window.localStorage.getItem) === 'function'
            && typeof(window.localStorage.removeItem) === 'function';
    }

    _storeValue(key, value) {
        if (this._isLocalStorageSupported()) {
            window.localStorage.setItem(key, value);
        } else {
            const secure_cookie = Boolean(Number(this.cookieSecure)) === true ? ';secure' : '';
            document.cookie = key + '=' + value + secure_cookie;
        }
    }

    _getStoredValue(key) {
        return this._isLocalStorageSupported() ? window.localStorage.getItem(key) : this._getCookie(key);
    }

    _changeTheme(companyPage, company) {
        if (undefined === companyPage || undefined === company) {
            return;
        }

        let headerBackgroundColor = 'var(--app-primary-color)',
            headerTextColor = 'var(--brand-default-text-color)',
            brandColor = 'var(--app-primary-color)',
            brandTextColor = 'var(--brand-default-text-color)'
        ;

        if (companyPage) {
            if (company.primary_color) {
                headerBackgroundColor = company.primary_color;
                if ('#fff' !== company.primary_color && '#ffffff' !== company.primary_color) {
                    brandColor = company.primary_color;
                }
            }
            if (company.secondary_color) {
                brandTextColor = company.secondary_color;
                headerTextColor = company.secondary_color;
            }
        }

        this.updateStyles({
            '--header-background-color' : headerBackgroundColor,
            '--header-text-color' : headerTextColor,
            '--brand-color' : brandColor,
            '--brand-text-color' : brandTextColor,
        });
    }

    _onCopiedApplicationAttribute(event) {
        const appRequest = document.createElement('iron-request'),
            application = event.detail.application.application;

        if (!!application.company) {
            appRequest.send({
                url: application.meta.track_events,
                method: 'POST',
                handleAs: 'json',
                body: 'track_events[event_type]=copy_event&track_events[field]=' + encodeURIComponent(event.detail.attribute),
                headers: this._headers
            });
        }
    }

    _reloadApplicationsForCompanyAdministrator() {
        if (this.currentCompany.company_admin) {
            this._reloadHomePageApplications();
            this._reloadCompanyHomePageApplications();
            this._reloadContactHomePageApplications();
        }
    }

    _onBackToHomePageAction() {
        this._showHomePage();
        this._setProduct(false);
    }

    _setNativeCompanyAsCurrent() {
        const nativeCompany = this.account.native_company,
            accountCompanies = this.account.companies,
            length = accountCompanies.length;

        for (let i = 0; i < length; i++) {
            const company = accountCompanies[i];

            if (nativeCompany.alias === company.company.alias) {
                this.set('currentCompany', company);
                break;
            }
        }
    }

    _setupCompanyAccountPage(page, account) {
        if ('company-account' === page && account.self) {
            account.native_company ? this._setNativeCompanyAsCurrent() : this._showHomePage();
        }
    }

    _computeIsPersonalPage(page, companyPageResolved) {
        if(!page || !companyPageResolved) {
            return false;
        }

        return this._isPersonalPage(page);
    }

    _onBackFromAccountAction() {
        this._accountManaged ? this._showCompanyHomePage() : this._showHomePage();
    }

    _onItemResponse(event) {
        this.set('item', event.detail.response);
    }

    _onLinkResponse(event) {
        this.set('link', event.detail.response);
    }

    _copyObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
}
window.customElements.define(AppscoApp.is, AppscoApp);
