import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanySettings extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-company-settings;
            }
            paper-toggle-button {
                cursor: pointer;
            }
            :host .info {
                margin-bottom: 0;
            }
            :host .info + .info {
                margin-top: 0;
            }
            :host .info-between {
                margin-top: 20px;
            }
            .mt-30 {
                margin-top: 30px;
            }
            .toggle-button-container paper-toggle-button {
                margin-top: 10px;
            }
            :host .submit-button {
                margin: 20px 0 0 0;
                @apply --form-action;
            }
            :host #allowPersonalDashboard {
                margin-top: 10px;
            }
            :host a.link {
                color: var(--app-primary-color-dark);
                text-decoration: none;
                color: #0b97c4;
            }
            :host .two-column{
                /*@apply --layout-horizontal;*/
            }
            :host .email-notifications-title-text {
                padding: 16px;
                font-size: 24px;
                font-weight: 400;
                margin-top: 10px;
                border-top: 1px solid rgba(65, 64, 66, 0.24);
            }
        </style>

        <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <div class="two-column">
            <div>
                <p class="info">
                    Company name is used to distinguish company resources from users personal resources.
                    It is used in branding and can be displayed in login screen along with company logo.
                </p>
                <iron-form id="form" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse" on-keyup="_onKeyUp">
                    <form method="POST" action="[[ settingsApi ]]">
                        <paper-input id="companyName" label="Company name" char-counter="" maxlength="35" value="[[ _format(company.name) ]]" name="company_settings[name]" required="" auto-validate="" error-message="Please type in company name."></paper-input>
                        <paper-input id="companyNumber" label="Company number" char-counter="" maxlength="50" value="[[ company.number ]]" name="company_settings[number]" error-message="Please type in company number."></paper-input>
                        <p class="info info-between">
                            Company contact email will be displayed in user profile section and used for contact purposes.
                        </p>
        
                        <paper-input id="contactEmail" type="email" label="Contact email" value="[[ company.contact_email ]]" name="company_settings[contactEmail]" required="" auto-validate="" error-message="Please type in correct email."></paper-input>
        
                        <paper-input id="billingEmail" type="email" label="Billing email" value="[[ company.billing_email ]]" name="company_settings[billingEmail]" required="" auto-validate="" error-message="Please type in correct email."></paper-input>
        
                        <div class="toggle-button-container mt-30">
                            <paper-toggle-button name="company_settings[sendEmailToAdminOnNewDevice]" id="newDeviceInfoAdminEmail" checked\$="[[ company.mail_admin_on_new_device ]]" on-change="_mailAdminOnNewDeviceChanged">
                                Send email notification to system admin when managed users log in from a new device
                            </paper-toggle-button>
                            <paper-toggle-button name="company_settings[disableCopyPassword]" id="disableCopyButtonOnResources" checked\$="[[ company.disable_resource_copy_button ]]" on-change="_disableResourceCopyButtonChanged">
                                Disable copy password option on all company resources.
                            </paper-toggle-button>
                            <paper-toggle-button name="company_settings[sendEmailToAdminOnNewUser]" id="newUserInfoAdminEmail" checked\$="[[ company.mail_admin_on_new_user ]]" on-change="_mailAdminOnNewUserChanged">
                                Send email notification to admins when user/contact invite is accepted.
                            </paper-toggle-button>
                            <paper-toggle-button name="company_settings[sendEmailToAdminOnWebhookIntegration]"
                                                 id="sendEmailToAdminOnWebhookIntegration"
                                                 checked\$="[[ company.mail_admin_on_new_webhook ]]"
                                                 on-change="_mailAdminOnNewWebhookChanged">
                                Send email notification to admins when webhook is triggered.
                            </paper-toggle-button>
                            <template is="dom-if" if="[[ _showAdminEmailField ]]">
                                <paper-input id="sendEmailToAdminOnNewDevice" label="Admin email" name="company_settings[newDeviceInfoAdminEmail]" value="[[ company.notify_admin_email ]]" on-keyup="_onKeyUp"></paper-input>
                            </template>
                        </div>
                        <input type="hidden" name="company_settings[emailNotificationsSetting]" id="companyNotificationEmailSettingsId" value="[[ company.email_notification_settings ]]">
                    </form>
                </iron-form>
            </div>
            <div>
                <div class="email-notifications-title-text">Email Notifications Override</div>
                <paper-toggle-button style="margin-bottom: 2rem;" checked\$="{{ _allEmailNotificationOverridesChecked }}" on-change="_allEmailNotificationOverridesToggleChanged">Enable all email notifications</paper-toggle-button>
                <paper-toggle-button id="COMPANY_ROLE_ADDED_WELCOME_EMAIL" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.COMPANY_ROLE_ADDED_WELCOME_EMAIL }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send welcome email when new user is added to company directory
                </paper-toggle-button>
                <paper-toggle-button id="COMPANY_ROLE_ADDED_EXISTING_USER" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.COMPANY_ROLE_ADDED_EXISTING_USER }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when newly added user in company directory is already an existing user
                </paper-toggle-button>
                <paper-toggle-button id="COMPANY_ROLE_ADDED_NOTIFY_ADMIN" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.COMPANY_ROLE_ADDED_NOTIFY_ADMIN }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email to administrator when user is added to company directory
                </paper-toggle-button>
                <paper-toggle-button id="MANAGED_USER_ACTIVATION_NOTIFICATION" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.MANAGED_USER_ACTIVATION_NOTIFICATION }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when newly added user has managed company domain
                </paper-toggle-button>
                <paper-toggle-button id="COMPANY_ROLE_PROVISIONED" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.COMPANY_ROLE_PROVISIONED }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when user from company directory is provisioned to other systems
                </paper-toggle-button>
                <paper-toggle-button id="EMPLOYEE_ADDED" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.EMPLOYEE_ADDED }}"
                                     on-change="_companyEmailNotificationChanged"
                >
                    Send email when new user is added to company directory
                </paper-toggle-button>
                <paper-toggle-button id="EMPLOYEE_REMOVED" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.EMPLOYEE_REMOVED }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when user is removed from company directory
                </paper-toggle-button>
                <paper-toggle-button id="APPLICATION_ICON_SHARED" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.APPLICATION_ICON_SHARED }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when application is shared
                </paper-toggle-button>
                <paper-toggle-button id="APPLICATION_ICON_UPDATED" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.APPLICATION_ICON_UPDATED }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when application is updated
                </paper-toggle-button>
                <paper-toggle-button id="NOTIFY_USER_NEW_DEVICE" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.NOTIFY_USER_NEW_DEVICE }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when new device is used
                </paper-toggle-button>
                <paper-toggle-button id="NOTIFY_NEW_DEVICE" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.NOTIFY_NEW_DEVICE }}"
                                     on-change="_companyEmailNotificationChanged">
                    
                    Send email to company administrator when new device is used
                </paper-toggle-button>
                <paper-toggle-button id="NOTIFY_TWO_FACTOR_STATUS_CHANGE" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.NOTIFY_TWO_FACTOR_STATUS_CHANGE }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when two-factor is changed
                </paper-toggle-button>
                <paper-toggle-button id="COMPANY_CONTACT_PROVISIONED" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.COMPANY_CONTACT_PROVISIONED }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when company contact is provisioned to other systems
                </paper-toggle-button>
                <paper-toggle-button id="COMPANY_INVITATION" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.COMPANY_INVITATION }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when company invitation is created
                </paper-toggle-button>
                <paper-toggle-button id="DENIED_SIGNUP_REQUEST" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.DENIED_SIGNUP_REQUEST }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when signup request is denied
                </paper-toggle-button>
                <paper-toggle-button id="ACCOUNT_TAKEOVER" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.ACCOUNT_TAKEOVER }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when company takes over an account
                </paper-toggle-button>
                <paper-toggle-button id="COMPANY_ACCOUNT_ACTIVATION" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.COMPANY_ACCOUNT_ACTIVATION }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email when company account is activated
                </paper-toggle-button>
                <paper-toggle-button id="CONTACT_CREATED_WELCOME" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.CONTACT_CREATED_WELCOME }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send welcome email when company contact is created
                </paper-toggle-button>
                <paper-toggle-button id="CONTACT_CREATED_NEW_USER_ADMIN_EMAIL" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.CONTACT_CREATED_NEW_USER_ADMIN_EMAIL }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email that notifies admin about non existing contact
                </paper-toggle-button>
                <paper-toggle-button id="CONTACT_CREATED_EXISTING_USER_ADMIN_EMAIL" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.CONTACT_CREATED_EXISTING_USER_ADMIN_EMAIL }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email that notifies admin about existing contact
                </paper-toggle-button>
                <paper-toggle-button id="NEW_SIGNUP_REQUEST" style="margin-bottom: 8px;"
                                     checked\$="{{ companyNotification.NEW_SIGNUP_REQUEST }}"
                                     on-change="_companyEmailNotificationChanged">
                    Send email that notifies admin about new signup request
                </paper-toggle-button>
            </div>
        </div>

        <div class="toggle-button-container mt-30">
            <p class="info">
                Policy settings have moved to company policies page.
                To access them please use <a href="/policies" rel="noopener noreferrer" class="link">policies page</a>
            </p>
        </div>

        <paper-button id="companySettingsSaveBtn" class="submit-button" on-tap="_onSaveAction">Save</paper-button>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnterAction"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-company-settings'; }

    static get properties() {
        return {
            company: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onCompanyChanged'
            },

            companyNotification: {
                type: Object,
                value: function() {
                    return {
                        "COMPANY_ROLE_ADDED_WELCOME_EMAIL": true,
                        "COMPANY_ROLE_ADDED_NOTIFY_ADMIN": true,
                        "COMPANY_ROLE_ADDED_EXISTING_USER": true,
                        "MANAGED_USER_ACTIVATION_NOTIFICATION": true,
                        "COMPANY_ROLE_PROVISIONED": true,
                        "EMPLOYEE_ADDED": true,
                        "EMPLOYEE_REMOVED": true,
                        "APPLICATION_ICON_SHARED": true,
                        "APPLICATION_ICON_UPDATED": true,
                        "NOTIFY_USER_NEW_DEVICE": true,
                        "NOTIFY_NEW_DEVICE": true,
                        "NOTIFY_TWO_FACTOR_STATUS_CHANGE": true,
                        "COMPANY_CONTACT_PROVISIONED": true,
                        "COMPANY_INVITATION": true,
                        "DENIED_SIGNUP_REQUEST": true,
                        "ACCOUNT_TAKEOVER": true,
                        "COMPANY_ACCOUNT_ACTIVATION": true,
                        "CONTACT_CREATED_WELCOME": true,
                        "CONTACT_CREATED_NEW_USER_ADMIN_EMAIL": true,
                        "CONTACT_CREATED_EXISTING_USER_ADMIN_EMAIL": true,
                        "NEW_SIGNUP_REQUEST": true
                    };
                }
            },

            settingsApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            _target: {
                type: Object
            },

            _emailAdminOnNewDevice: {
                type: Boolean,
                value: false
            },

            _emailAdminOnNewUser: {
                type: Boolean,
                value: false
            },

            _emailAdminOnNewWebhook: {
                type: Boolean,
                value: false
            },

            _disableResourcePasswordCopy: {
                type: Boolean,
                value: false
            },

            _showAdminEmailField: {
                type: Boolean,
                computed: '_computeShowAdminEmailField(_emailAdminOnNewDevice, _emailAdminOnNewUser, _emailAdminOnNewWebhook)'
            },

            _allEmailNotificationOverridesChecked: {
                type: Boolean,
                value: true
            }
        };
    }

    static get observers() {
        return [
            '_emailNotificationOverridesChanged(companyNotification.*)'
        ]
    }

    ready() {
        super.ready();
        this._target = this;
    }

    _format(name) {
        return name ? name.substring(0, 35) : '';
    }

    _onCompanyChanged() {
        this.$.contactEmail.invalid = false;
        this.$.billingEmail.invalid = false;
        this._emailAdminOnNewDevice = this.company ? this.company.mail_admin_on_new_device : false;
        this._emailAdminOnNewUser = this.company ? this.company.mail_admin_on_new_user : false;
        this._emailAdminOnNewWebhook = this.company ? this.company.mail_admin_on_new_webhook : false;
        this._disableResourcePasswordCopy = this.company ? this.company.disable_resource_copy_button : false;
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _submitSettingsForm() {
        let companyNotificationEmailSettings = {};
        for(const property in this.companyNotification) {
            companyNotificationEmailSettings[property.toLowerCase().replaceAll('_', '-')] = this.companyNotification[property];
        }
        this.company.email_notification_settings = JSON.stringify(companyNotificationEmailSettings);
        this.shadowRoot.getElementById('companyNotificationEmailSettingsId').value = JSON.stringify(companyNotificationEmailSettings);

        this.$.form.submit();
    }

    _onEnterAction(event) {
        event.stopPropagation();
        this._onSaveAction();
    }

    _onSaveAction() {
        this._submitSettingsForm();
    }

    _onFormPresubmit() {
        this._showLoader();
        this.$.form.request.method = 'PUT';
    }

    _onFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.request.response.code));
        this._hideLoader();
    }

    _onFormResponse(event) {;
        this.$.contactEmail.invalid = false;
        this.$.billingEmail.invalid = false;

        this._hideLoader();

        this.dispatchEvent(new CustomEvent('company-settings-changed', {
            bubbles: true,
            composed: true,
            detail: {
                company: event.detail.response
            }
        }));

        if (this._2faChangedToEnable) {
            this._reloadPage();
        }
    }

    _onKeyUp(event) {
        if (13 !== event.keyCode) {
            this._hideError();
            event.target.invalid = false;
        }
    }

    _reloadPage() {
        window.location.reload(true);
    }

    _mailAdminOnNewUserChanged() {
        this._emailAdminOnNewUser = this.$.newUserInfoAdminEmail.checked;
    }

    _mailAdminOnNewWebhookChanged() {
        this._emailAdminOnNewWebhook = this.$.sendEmailToAdminOnWebhookIntegration.checked;
    }

    _companyEmailNotificationChanged(e) {
        this.set('companyNotification.'+e.currentTarget.id, e.currentTarget.checked);
    }

    _mailAdminOnNewDeviceChanged() {
        this._emailAdminOnNewDevice = this.$.newDeviceInfoAdminEmail.checked;
    }

    _disableResourceCopyButtonChanged() {
        this._disableResourcePasswordCopy = this.$.disableCopyButtonOnResources.checked;
    }

    _computeShowAdminEmailField(_emailAdminOnNewDevice, _emailAdminOnNewUser, _emailAdminOnNewWebhook) {
        return _emailAdminOnNewDevice || _emailAdminOnNewUser || _emailAdminOnNewWebhook;
    }

    setup() {
        this.$.companyName.focus();
        let settings = this.company.email_notification_settings;
        for (const property in settings) {
            let companyNotificationProperty = property.toUpperCase().replaceAll('-', '_');

            if(this.companyNotification.hasOwnProperty(companyNotificationProperty)) {
                this.companyNotification[companyNotificationProperty] = settings[property];
            }
        }
        let notifications = this.companyNotification;
        this.set('companyNotification', {});
        this.set('companyNotification', notifications);
    }

    reset() {
        const company = JSON.parse(JSON.stringify(this.company));

        this.company = {};
        this.company = company;

        this._hideError();
        this.$.contactEmail.invalid = false;
        this.$.billingEmail.invalid = false;
    }

    _allEmailNotificationOverridesToggleChanged(e) {
        const companyNotification = Object.assign({}, this.companyNotification);

        Object.keys(companyNotification).forEach(setting => {
            companyNotification[setting] = e.currentTarget.checked;
        });

        this.companyNotification = companyNotification;
    }

    _emailNotificationOverridesChanged() {
        this._allEmailNotificationOverridesChecked = !Object.values(this.companyNotification).includes(false);
    }
}
window.customElements.define(AppscoCompanySettings.is, AppscoCompanySettings);
