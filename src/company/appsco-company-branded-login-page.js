import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { NeonSharedElementAnimatableBehavior } from '@polymer/neon-animation/neon-shared-element-animatable-behavior.js';
import '@polymer/neon-animation/animations/hero-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/slide-right-animation.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-swatch-picker/paper-swatch-picker.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-ajax/iron-request.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import '../components/components/appsco-image-upload.js';
import './appsco-company-image-settings.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyBrandedLoginPage extends mixinBehaviors([
    NeonSharedElementAnimatableBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="webkit-scrollbar-style">
            :host {
                @apply --full-page;

                --paper-card-header: {
                    border-bottom: 1px solid var(--divider-color);
                };

                --appsco-upload-image-settings: {
                    display: inline-block;
                };
            }
            paper-card {
                @apply --full-page-paper-card;

                --paper-card-header-text: {
                    color: var(--primary-text-color);
                    @apply --full-page-paper-card-header-text;
                };
            }
            .page-close-action {
                @apply --page-close-action;
            }
            .message {
                @apply --info-message;
            }
            .label {
                @apply --paper-font-subhead;
                display: block;
                font-size: 16px;
                margin-top:20px;
                font-weight: 700;
            }
            :host .submit-button {
                margin: 20px 0 0 0;
                @apply --form-action;
            }
            :host .reset-button {
                margin: 20px 0 0 0;
                background-color: transparent;
            }
        </style>

        <iron-ajax auto="" id="brandedLogin" url="[[ company.meta.branded_login ]]" headers="[[ _headers ]]" on-response="_onResponse" debounce-duration="300"></iron-ajax>

        <paper-card heading="Branded Login" id="brandedLoginCard">
            <paper-icon-button icon="close" title="Close" class="page-close-action" on-tap="_onBack"></paper-icon-button>

            <div class="card-content" id="brandedLoginFormCard">
                <p class="message">
                    On this page you can customize the login form.
                    You can modify the logo, or the fields and text showing on the login form. This branding and setup will be visible to all users and contacts logging in trough your login page.
                </p>
                <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

                <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                <div class="logo-upload">
                    <label for="appscoCompanyLogoSettings" class="label">Company logo</label>
                    <appsco-image-upload id="appscoCompanyLogoSettings" image="[[ brandedLogin.logo ]]" authorization-token="[[ authorizationToken ]]" image-settings-api="[[ _companyLogoApi ]]" image-alt="Company logo" loader-alt="AppsCo is saving company logo" remove-action-text="Remove logo"></appsco-image-upload>
                </div>

                <iron-form id="form" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse" on-keyup="_onKeyUp">
                    <form method="POST" action="[[ company.meta.branded_login ]]">

                        <div class="form-input-container">
                            <div class="form-input form-input-text">
                                <label for="loginPageTitle" class="label">Login page title</label>
                                <paper-input id="loginPageTitle" label="Login page title" name="branded_login[title]" value="[[ brandedLogin.title ]]"></paper-input>
                            </div>
                            <div class="form-input form-input-text">
                                <label for="loginPagePasswordDisabled" class="label">Password field</label>
                                <paper-toggle-button id="loginPagePasswordDisabled" name="branded_login[password_disabled]" checked\$="[[ brandedLogin.passwordDisabled ]]">
                                    Turn on or off the password field on login form.
                                </paper-toggle-button>
                            </div>
                            <div class="form-input form-input-text">
                                <label for="loginPageResetPasswordDisabled" class="label">Reset password</label>
                                <p class="info">
                                    Turning this option off will remove the Forgot password link on login page
                                    and disable the users to reset their password by themselves.
                                </p>

                                <paper-toggle-button id="loginPageResetPasswordDisabled" name="branded_login[reset_password_disabled]" checked\$="[[ brandedLogin.resetPasswordDisabled ]]">
                                    Turn on or off the forgot password field on login form.
                                </paper-toggle-button>
                            </div>
                            <div class="form-input form-input-text">
                                <label for="loginPageOauthLoginDisabled" class="label">OAuth login</label>

                                <paper-toggle-button id="loginPageOauthLoginDisabled" name="branded_login[oauth_login_disabled]" checked\$="[[ brandedLogin.oauthLoginDisabled ]]">
                                    Turn on or off login through Facebook or Google.
                                </paper-toggle-button>
                            </div>
                            <div class="form-input form-input-text">
                                <label for="loginPageCreateAccountDisabled" class="label">Create account</label>

                                <paper-toggle-button id="loginPageCreateAccountDisabled" name="branded_login[create_account_disabled]" checked\$="[[ brandedLogin.createAccountDisabled ]]">
                                    Turn on or off the "Create account in 10 seconds" button.
                                </paper-toggle-button>
                            </div>
                        </div>
                        <div class="form-input-container">
                            <div class="form-input form-input-picker">
                                <label for="brandBackgroundColorPicker" class="label">Pick a brand color</label>
                                <paper-swatch-picker id="brandBackgroundColorPicker" color="{{ brandedLogin.backgroundColor }}"></paper-swatch-picker>
                            </div>

                            <label for="brandColorInput" class="label or-label">or</label>

                            <div class="form-input form-input-text">
                                <label for="brandBackgroundColorPicker" class="label">Enter hex code</label>
                                <paper-input id="brandColorInput" label="Brand color" name="branded_login[background_color]" value="{{ brandedLogin.backgroundColor }}" no-label-float="" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\$" auto-validate="" error-message="Please enter valid hex code."></paper-input>
                            </div>
                        </div>
                        <div class="form-input-container">
                            <div class="logo-upload">
                                <label for="appscoCompanyBackgroundSettings" class="label">Background image</label>
                                <appsco-image-upload id="appscoCompanyBackgroundSettings" image="[[ brandedLogin.backgroundImage ]]" authorization-token="[[ authorizationToken ]]" image-settings-api="[[ _companyBackgroundApi ]]" image-alt="Company background image" loader-alt="AppsCo is saving background image" remove-action-text="Remove image"></appsco-image-upload>
                            </div>
                        </div>
                        <div class="form-input-container">
                            <div class="form-input form-input-text">
                                <label for="loginPageAdminLoginLinkCaption" class="label">Admin force login link</label>
                                <p class="info">
                                    This login link is only visible to your company admins when your company has set up
                                    an external identity provider and has single sign-on login enabled.
                                    You can modify the text showing on the link and add your company's name.
                                </p>
                                <paper-input id="loginPageAdminLoginLinkCaption" label="Admin force login link" name="branded_login[admin_login_link_caption]" value="[[ brandedLogin.adminLoginLinkCaption ]]"></paper-input>
                            </div>
                            <div class="form-input form-input-text">
                                <label for="loginPageUsernameFieldCaption" class="label">Username field title</label>
                                <paper-input id="loginPageUsernameFieldCaption" label="Username field title" name="branded_login[username_field_caption]" value="[[ brandedLogin.usernameFieldCaption ]]"></paper-input>
                            </div>
                            <div class="form-input form-input-text">
                                <label for="loginPagePasswordFieldCaption" class="label">Password field title</label>
                                <paper-input id="loginPagePasswordFieldCaption" label="Password field title" name="branded_login[password_field_caption]" value="[[ brandedLogin.passwordFieldCaption ]]"></paper-input>
                            </div>
                        </div>
                    </form>
                </iron-form>

                <paper-button id="submitBrandedLoginForm" class="submit-button" on-tap="_submitForm">Save</paper-button>

                <paper-button id="reset" class="reset-button" on-tap="_resetForm">Reset</paper-button>

                <iron-a11y-keys keys="enter" on-keys-pressed="_onEnter"></iron-a11y-keys>
            </div>
        </paper-card>
`;
    }

    static get is() { return 'appsco-company-branded-login-page'; }

    static get properties() {
        return {
            company: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            brandedLogin: {
                type: Object,
                value: function () {
                    return {
                        adminLoginLinkCaption: null,
                        alias: "",
                        backgroundColor: null,
                        backgroundImage: null,
                        createAccountDisabled: false,
                        logo: null,
                        oauthLoginDisabled: false,
                        passwordDisabled: false,
                        passwordFieldCaption: null,
                        resetPasswordDisabled: false,
                        title: "",
                        usernameFieldCaption: null
                    };
                }
            },

            settingsApi: {
                type: String
            },

            _companyLogoApi: {
                type: String,
                computed: '_computeCompanyLogoApi(company)'
            },

            _companyBackgroundApi: {
                type: String,
                computed: '_computeCompanyBackgroundApi(company)'
            },

            animationConfig: {
                type: Object
            },

            sharedElements: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': [{
                name: 'hero-animation',
                id: 'hero',
                toPage: this,
                timing: {
                    duration: 300
                }
            }, {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 500
                }
            }],
            'exit': {
                name: 'slide-right-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };

        this.sharedElements = {
            'hero': this.$.brandedLoginCard
        };
    }

    setupPage() {
        this.$.appscoCompanySettings.setup();
    }

    resetPage() {
        this.$.appscoCompanySettings.reset();
    }

    _computeCompanyLogoApi(company) {
        return (company.meta && company.meta.branded_login) ? company.meta.branded_login + '/logo' : null;
    }

    _computeCompanyBackgroundApi(company) {
        return (company.meta && company.meta.branded_login) ? company.meta.branded_login + '/background' : null;
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _onBack() {
        this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    }

    _onResponse(event) {
        this.brandedLogin = event.detail.response;
    }

    _onEnter() {
        this._submitForm();
    }

    _submitForm() {
        this.$.form.submit();
    }

    _resetForm() {
        const request = document.createElement('iron-request'),
            options = {
                url: this.company.meta.branded_login,
                method: 'DELETE',
                handleAs: 'json',
                headers: this._headers
            };

        request.send(options).then(function() {
            if (200 === parseInt(request.status)) {
                this.brandedLogin = {
                    adminLoginLinkCaption: null,
                    alias: "",
                    backgroundColor: null,
                    backgroundImage: null,
                    createAccountDisabled: false,
                    logo: null,
                    oauthLoginDisabled: false,
                    passwordDisabled: false,
                    passwordFieldCaption: null,
                    resetPasswordDisabled: false,
                    title: "",
                    usernameFieldCaption: null
                };
            }
        }.bind(this));
    }

    _onFormPresubmit() {
        this._showLoader();
        this.$.form.request.method = 'PUT';
        const body = this.$.form.request.body;
        body['branded_login[password_disabled]'] = body['branded_login[password_disabled]'] ? 1: 0;
        body['branded_login[reset_password_disabled]'] = body['branded_login[reset_password_disabled]'] ? 1: 0;
        body['branded_login[oauth_login_disabled]'] = body['branded_login[oauth_login_disabled]'] ? 1: 0;
        body['branded_login[create_account_disabled]'] = body['branded_login[create_account_disabled]'] ? 1: 0;
    }

    _onFormError(event) {
        this._errorMessage = event.detail.error.message;
        this._hideLoader();
    }

    _onFormResponse(event) {
        this.set('brandedLogin', event.detail.response);

        this.dispatchEvent(new CustomEvent('company-branded-login-changed', {
            bubbles: true,
            composed: true,
            detail: {
                brandedLogin: this.brandedLogin
            }
        }));

        this._hideLoader();
    }

    _onKeyUp() {
        this._errorMessage = '';
    }
}
window.customElements.define(AppscoCompanyBrandedLoginPage.is, AppscoCompanyBrandedLoginPage);
