import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '../components/appsco-form-error.js';
import '../components/appsco-loader.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccount2faEnable extends mixinBehaviors([NeonAnimatableBehavior, Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                @apply --paper-font-common-base;
                color: var(--primary-text-color);

                --paper-tab-content-unselected: {
                    opacity: 1;
                };

                --paper-progress-container-color: #d8d8d8;
                --paper-progress-active-color: var(--app-primary-color);
                --paper-progress-height: 2px;
            }
            :host .two-fa-container {
                width: 700px;
                margin: 0 auto;
            }
            :host .step-content-container, :host .bottom-step-navigation {
                width: 500px;
            }
            :host .step-content-container {
                height: 320px;
                margin-top: 20px;
            }
            :host([errored]) .step-content-container {
                height: auto;
            }
            :host([errored]) .step-content-container > .iron-selected {
                position: relative;
            }
            :host .top-step-navigation {
                width: 100%;
                height: 78px;
                box-sizing: border-box;
                position: relative;
            }
            :host paper-tabs {
                height: auto;
                padding: 10px 0;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                z-index: 5;
            }
            :host .step-number {
                width: 30px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                color: #ffffff;
                background-color: #d8d8d8;
                border: 1px solid #d8d8d8;
                border-radius: 50%;
                transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
                @apply --layout-flex;
            }
            :host paper-tab.iron-selected .step-number {
                background-color: var(--app-primary-color);
                border-color: var(--app-primary-color);
            }
            :host .step-name {
                margin-top: 5px;
            }
            :host paper-progress {
                width: calc(100% / 3 * 2);
                position: absolute;
                top: 25px;
                left: calc(100% / 3 / 2);
                z-index: 1;
            }
            .subtitle {
                @apply --paper-font-title;
                text-align: center;
            }
            :host .bottom-step-navigation {
                margin-top: 20px;
            }
            :host .bottom-navigation-action {
                margin: 0;
            }
            :host .action-previous {
                padding: 0 10px 0 0;
                float: left;
            }
            :host .action-next {
                padding: 0 0 0 10px;
                float: right;
            }
            :host .action-save {
                @apply --form-action;
                margin-top: 0;
                float: right;
            }
            .app-store-info {
                margin-top: 30px;
            }
            .google-authenticator-icon {
                width: 92px;
                height: 92px;
                margin-right: 30px;
            }
            .store-info {
                margin-top: 4px;
                margin-bottom: 8px;
                @apply --paper-font-body2;
            }
            .app-store-image {
                width: 150px;
                height: 44px;
            }
            .store-link {
                display: inherit;
                outline: none;
            }
            .google-play-link {
                margin-right: 10px;
            }
            .label {
                @apply --paper-font-body2;
            }
            .authenticator-code {
                @apply --layout-justified;
            }
            .qr-outline {
                width: 240px;
                height: 130px;
                margin-top: 10px;
                border: 1px solid #e1e1e1;
                position: relative;
            }
            .qr-code-image, .qr-key {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
            }
            .qr-code-image {
                width: 64px;
                height: 64px;
            }
            .qr-key {
                @apply --paper-font-subhead;
                font-weight: 500;
                height: 24px;
                text-align: center;
            }
            .verification-code-input {
                width: 300px;
            }
            .verification-info {
                @apply --shadow-elevation-2dp;
                padding: 16px 24px;
                margin-top: 50px;
                background-color: #FBFBFB;
                border-radius: 2px;
            }
            .info-icon {
                margin-top: -4px;
                --iron-icon-width: 16px;
                --iron-icon-height: 16px;
                --iron-icon-fill-color: var(--app-primary-color);
            }
            .flex-horizontal {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            .flex-vertical-center {
                @apply --layout-vertical;
                @apply --layout-center;
            }
            .flex-vertical {
                @apply --layout-vertical;
            }
        </style>

        <div class="two-fa-container flex-vertical-center">
            <div class="top-step-navigation">
                <paper-tabs id="steps" attr-for-selected="name" selected="[[ _selectedStep ]]" on-iron-select="_onStepSelected" no-bar="">
                    <paper-tab id="setup" name="setup">
                        <div class="flex-vertical-center">
                            <span class="step-number">1.</span>
                            <span class="step-name">Set up</span>
                        </div>
                    </paper-tab>

                    <paper-tab id="scan" name="scan">
                        <div class="flex-vertical-center">
                            <span class="step-number">2.</span>
                            <span class="step-name">Scan</span>
                        </div>
                    </paper-tab>

                    <paper-tab id="verify" name="verify" disabled="">
                        <div class="flex-vertical-center">
                            <span class="step-number">3.</span>
                            <span class="step-name">Verify</span>
                        </div>
                    </paper-tab>
                </paper-tabs>

                <paper-progress id="progressBar" min="1" max="3" value="[[ _progress ]]"></paper-progress>
            </div>

            <neon-animated-pages id="neon" attr-for-selected="name" selected="[[ _selectedStep ]]" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="step-content-container">

                <div name="setup" class="tab-content">
                    <h2 class="subtitle">An extra layer of security</h2>
                    <p>Two-factor authentication (also known as 2FA) is an extra layer of security
                        which requires not only a password and username but also a 6-digit code
                        generated with Authenticator app on your personal device (such as tablet or mobile phone).
                        AppsCo is using Google Authenticator which requires a second step of verification when you sign in.</p>
                    <div class="app-store-info flex-horizontal">
                        <iron-image class="google-authenticator-icon" src="/images/twofa/google-authenticator-icon.png" sizing="cover"></iron-image>

                        <div class="store-info flex-vertical">
                            <p class="store-info">Download and install application for your device</p>
                            <div class="app-store-link flex-horizontal">
                                <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&amp;hl=en" class="store-link google-play-link" tabindex="-1" target="_blank" rel="noopener noreferrer">
                                    <iron-image class="app-store-image" src="/images/twofa/google-play-image.png" sizing="cover"></iron-image>
                                </a>

                                <a href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8" class="store-link" tabindex="-1" target="_blank" rel="noopener noreferrer">
                                    <iron-image class="app-store-image apple-store-image" src="/images/twofa/apple-store-image.png" sizing="cover"></iron-image>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div name="scan" class="tab-content">
                    <h2 class="subtitle">Open Google Authenticator</h2>
                    <p>If you are using this application for the first time,
                        in the beginning you will automatically add an account by scanning a barcode.
                        If you enter key manually, you will also need to provide account name.</p>
                    <div class="authenticator-code flex-horizontal">
                        <div class="qr-code flex-vertical-center">
                            <span class="label">QR code</span>
                            <div class="qr-outline">
                                <iron-image src="[[ _qrCode ]]" class="qr-code-image qr-center" sizing="cover" alt="QR code"></iron-image>
                            </div>
                        </div>

                        <div class="flex-vertical-center">
                            <span class="label">Enter key</span>
                            <div class="qr-outline">
                                <span class="qr-key qr-center">[[ _qrSecret ]]</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div name="verify" class="tab-content flex-vertical-center">
                    <h2 class="subtitle">Enter 6-digit code</h2>

                    <iron-form id="form" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                        <form method="POST" action="[[ twoFaApi ]]">
                            <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                            <paper-input class="verification-code-input" label="Verification code" name="two_factor[key]" char-counter="" maxlength="6" pattern="[0-9]*" required="" auto-validate="" error-message="Please enter valid code. Only digits are allowed."></paper-input>
                        </form>
                    </iron-form>
                    <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>
                    <div class="verification-info">
                        <iron-icon icon="icons:info" class="info-icon"></iron-icon>
                        AppsCo Support cannot restore access to your accounts with two-factor authentication enabled for security reasons.
                        Saving your recovery codes in a safe place can keep you from being locked out of your account.
                    </div>
                </div>
            </neon-animated-pages>

            <div class="bottom-step-navigation">
                <paper-button class="bottom-navigation-action action-previous" on-tap="_onPreviousAction" hidden\$="[[ !_activePreviousAction ]]">
                    <iron-icon icon="icons:chevron-left"></iron-icon>
                    Previous
                </paper-button>

                <paper-button class="bottom-navigation-action action-next" on-tap="_onNextAction" hidden\$="[[ !_activeNextAction ]]">
                    Next
                    <iron-icon icon="icons:chevron-right"></iron-icon>
                </paper-button>

                <paper-button class="bottom-navigation-action action-save" on-tap="_onSaveAction" hidden\$="[[ _activeNextAction ]]">
                    Save
                </paper-button>
            </div>
        </div>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnter"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-account-2fa-enable'; }

    static get properties() {
        return {
            twoFaApi: {
                type: String
            },

            twoFaQrApi: {
                type: String
            },

            authorizationToken: {
                type: String,
                value: ''
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            errored: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _selectedStep: {
                type: String,
                value: ''
            },

            _progress: {
                type: Number,
                value: 1
            },

            _activePreviousAction: {
                type: Boolean,
                value: false
            },

            _activeNextAction: {
                type: Boolean,
                value: true
            },

            _qrCode: {
                type: String,
                value: ''
            },

            _qrSecret: {
                type: String,
                value: ''
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
            }
        };
    }

    ready() {
        super.ready();

        this._target = this.$.form;

        beforeNextRender(this, function() {
            this._selectSetupStep();
            this._getTwoFaQr();
        });
    }

    reset() {
        this._selectSetupStep();
        this._resetSteps();
        this._hideLoader();
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _showError(message) {
        this._errorMessage = message;
        this.errored = true;
    }

    _hideError() {
        this._errorMessage = '';
        this.errored = false;
    }

    _getTwoFaQr() {
        const request = document.createElement('iron-request'),
            options = {
                url: this.twoFaQrApi,
                method: 'GET',
                handleAs: 'json',
                headers: this._headers
            };

        request.send(options).then(function() {
            if (200 === request.status) {
                this._qrCode = request.response.qr;
                this._qrSecret = request.response.secret;
            }
        }.bind(this));
    }

    _resetSteps() {
        this.$.scan.classList.remove('iron-selected');
        this.$.verify.classList.remove('iron-selected');
        this._activePreviousAction = false;
        this._activeNextAction = true;
        this._disableVerifyStep();
        this._resetVerificationForm();
    }

    _selectSetupStep() {
        this.$.steps.select('setup');
    }

    _showSetupStep() {
        this.$.setup.classList.add('iron-selected');
        this._progress = 1;
    }

    _showScanStep() {
        this.$.scan.classList.add('iron-selected');
        this.$.verify.classList.remove('iron-selected');
        this._progress = 2;
        this._activePreviousAction = true;
        this._activeNextAction = true;
        this._resetVerificationForm();
    }

    _showVerifyStep() {
        this.$.verify.classList.add('iron-selected');
        this._progress = 3;
        this._activeNextAction = false;
    }

    _enableVerifyStep() {
        this.$.verify.disabled = false;
    }

    _disableVerifyStep() {
        this.$.verify.disabled = true;
    }

    _activateStep(step) {
        this._selectedStep = step;

        switch (step) {
            case 'setup':
                this._showSetupStep();
                this._resetSteps();
                break;
            case 'scan':
                this._showSetupStep();
                this._showScanStep();
                this._enableVerifyStep();
                break;
            case 'verify':
                this._showSetupStep();
                this._showScanStep();
                this._showVerifyStep();
                break;
            default:
                return false;
        }
    }

    _onStepSelected(event) {
        this._activateStep(event.detail.item.getAttribute('name'));
    }

    _onPreviousAction() {
        switch (this._selectedStep) {
            case 'scan':
                this._activateStep('setup');
                break;
            case 'verify':
                this._activateStep('scan');
                break;
            default:
                return false;
        }
    }

    _onNextAction() {
        switch (this._selectedStep) {
            case 'setup':
                this._activateStep('scan');
                break;
            case 'scan':
                this._activateStep('verify');
                break;
            default:
                return false;
        }
    }

    _onEnter() {
        this._submitForm();
    }

    _submitForm() {
        this._hideError();

        if (this._target.validate()) {
            this._showLoader();
            this._target.submit();
        }
    }

    _onSaveAction() {
        this._submitForm();
    }

    _onFormPresubmit(event) {
        event.target.request.body['two_factor[googleAuthenticatorSecret]'] = this._qrSecret;
    }

    _onFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.request.response.code));
        this._hideLoader();
    }

    _onFormResponse(event) {
        this.dispatchEvent(new CustomEvent('twofa-enabled', { bubbles: true, composed: true }));
        this.reset();
    }

    _resetVerificationForm() {
        this._target.reset();
        this._hideError();
    }
}
window.customElements.define(AppscoAccount2faEnable.is, AppscoAccount2faEnable);
