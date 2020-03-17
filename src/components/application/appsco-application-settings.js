import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/appsco-loader.js';
import './appsco-application-form-item.js';
import './appsco-application-form-unpw.js';
import './appsco-application-form-cc.js';
import './appsco-application-form-login.js';
import './appsco-application-form-passport.js';
import './appsco-application-form-securenote.js';
import './appsco-application-form-softwarelicence.js';
import './appsco-application-form-saml.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationSettings extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-application-settings;
            }
            :host paper-textarea {
                @apply --paper-font-common-nowrap;
            }
            :host .save-action {
                margin: 10px 0 0 0;
                @apply --form-action;
            }
            .info, .label {
                margin: 0;
                font-size:16px;
            }

            .label {
                margin-top: 10px;
                margin-bottom: 2px;
                font-size:14px;
                color: var(--secondary-text-color);
            }
        </style>

        <template is="dom-if" if="[[ formSubmitAction ]]">
            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is saving application" multi-color=""></appsco-loader>
        </template>

        <template is="dom-if" if="[[ _canChangeTitle ]]">
            <paper-input id="title" label="Title" value="[[ _applicationComputed.title ]]" name="configure_application[title]" required="" auto-validate="" error-message="Please enter application title."></paper-input>
        </template>

        <template is="dom-if" if="[[ _canChangeUrl ]]">
            <paper-input id="url" label="Url" value="[[ _applicationComputed.url ]]" pattern="[[ _urlValidationPattern ]]" error-message="Url is invalid." required="" auto-validate="" name="configure_application[url]"></paper-input>
        </template>

        <template is="dom-if" if="[[ _unPwAuth ]]" restamp="">
            <appsco-application-form-unpw data-claims="" claims="[[ _claims ]]"></appsco-application-form-unpw>
        </template>
        <template is="dom-if" if="[[ _itemAuth ]]" restamp="">
            <appsco-application-form-item data-claims="" claims="[[ _claims ]]"></appsco-application-form-item>
        </template>
        <template is="dom-if" if="[[ _creditCardAuth ]]" restamp="">
            <appsco-application-form-cc data-claims="" claims="[[ _claims ]]"></appsco-application-form-cc>
        </template>
        <template is="dom-if" if="[[ _loginAuth ]]" restamp="">
            <appsco-application-form-login data-claims="" claims="[[ _claims ]]"></appsco-application-form-login>
        </template>
        <template is="dom-if" if="[[ _passportAuth ]]" restamp="">
            <appsco-application-form-passport data-claims="" claims="[[ _claims ]]"></appsco-application-form-passport>
        </template>
        <template is="dom-if" if="[[ _secureNoteAuth ]]" restamp="">
            <appsco-application-form-securenote data-claims="" claims="[[ _claims ]]"></appsco-application-form-securenote>
        </template>
        <template is="dom-if" if="[[ _softwareLicenceAuth ]]" restamp="">
            <appsco-application-form-softwarelicence data-claims="" claims="[[ _claims ]]"></appsco-application-form-softwarelicence>
        </template>
        <template is="dom-if" if="[[ _samlAuth ]]" restamp="">
            <appsco-application-form-saml data-claims="" claims="[[ _claims ]]"></appsco-application-form-saml>
        </template>

        <template is="dom-if" if="[[ formSubmitAction ]]" restamp="">
            <paper-button on-tap="_submit" id="submit" class="save-action">Save</paper-button>
        </template>
`;
    }

    static get is() { return 'appsco-application-settings'; }

    static get properties() {
        return {
            formSubmitAction: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            /**
             * [Application](https://developers.appsco.com/api/dashboard/id/icons/id) that is to be rendered
             */
            application: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            applicationTpl: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            _applicationComputed: {
                type: Object,
                computed: '_computeApplicationFromAppAndTpl(application, applicationTpl)'
            },

            _claims: {
                type: Object,
                computed: '_computeClaims(application)'
            },

            applicationSettings: {
                type: Boolean,
                value: true,
                notify: true
            },

            _canChangeTitle: {
                type: Boolean,
                computed: '_computeCanChangeTitle(applicationSettings)'
            },

            _canChangeUrl: {
                type: Boolean,
                computed: '_computeCanChangeUrl(applicationSettings, _applicationComputed)'
            },

            _shouldShowUrl: {
                type: Boolean,
                computed: '_computeShouldShowUrl(applicationSettings, application, applicationTpl)'
            },

            _urlValidationPattern: {
                type: String,
                computed: '_computeUrlValidationPattern(applicationSettings, application, applicationTpl)'
            },

            company: {
                type: Boolean,
                value: false
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _unPwAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, company, 'unpw', applicationTpl)"
            },
            _itemAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, company, 'item', applicationTpl)"
            },
            _creditCardAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, company, 'cc', applicationTpl)"
            },
            _loginAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, company, 'login', applicationTpl)"
            },
            _passportAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, company, 'passport', applicationTpl)"
            },
            _secureNoteAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, company, 'securenote', applicationTpl)"
            },
            _softwareLicenceAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, company, 'softwarelicence', applicationTpl)"
            },
            _samlAuth: {
                type: Boolean,
                computed: "_computeAuthType(application, company, 'saml', applicationTpl)"
            },

            _supportedAuthTypes: {
                type: Array,
                value: function () {
                    return [
                        'icon_item', 'icon_unpw', 'icon_saml', 'icon_jwt', 'icon_cc', 'icon_login',
                        'icon_passport', 'icon_securenote', 'icon_softwarelicence', 'icon_none'
                    ]
                }
            }
        };
    }

    ready() {
        super.ready();

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('iron-overlay-closed', this._stopPropagation);
    }

    _stopPropagation(e) {
        e.stopPropagation();
    }

    _computeApplicationFromAppAndTpl(application, applicationTpl) {
        if (!application.self && !applicationTpl.self) {
            return {};
        }

        return application.self ? application : applicationTpl;
    }

    _computeClaims(application) {
        if(!application.self) {
            return {};
        }

        return application.claims;
    }

    _supportedAuthTypeByPriority(authTypes) {
        let authType = null,
            priority = 100;
        for (let prop in authTypes) {
            const currentPriority = this._supportedAuthTypes.indexOf(authTypes[prop]);
            if(priority > currentPriority) {
                authType = authTypes[prop];
                priority = currentPriority;
            }
        }

        return authType.substring('icon_'.length);
    }

    _computeAuthType(applicationIcon, company, authType, applicationTpl) {
        if (!applicationIcon.auth_type && !applicationTpl.auth_types) {
            return false;
        }
        const auth = applicationIcon.auth_type ? applicationIcon.auth_type : this._supportedAuthTypeByPriority(applicationTpl.auth_types);

        return !company && auth === authType;
    }

    _computeCanChangeTitle(applicationSettings) {
        return applicationSettings;
    }

    _computeCanChangeUrl(applicationSettings, applicationComputed) {
        return applicationSettings && applicationComputed.url_editable;
    }

    _computeShouldShowUrl(applicationSettings, applicationIcon, applicationTpl) {
        if (!applicationIcon.auth_type && !applicationTpl.auth_types) {
            return false;
        }
        const auth = applicationIcon.auth_type ? applicationIcon.auth_type : this._supportedAuthTypeByPriority(applicationTpl.auth_types),
            tpl = applicationIcon.application ? applicationIcon.application : applicationTpl
        ;
        return !(applicationSettings && tpl.url_editable) &&
            ['unpw', 'item', 'login'].indexOf(auth) !== -1;
    }

    _computeUrlValidationPattern(applicationSettings, applicationIcon, applicationTpl) {
        const defaultPattern = '^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?|^((http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$',
            allowFtpPattern = '^(http:\\/\\/|https:\\/\\/|ftp:\\/\\/|ftps:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?|^((http:\\/\\/|https:\\/\\/|ftp:\\/\\/|ftps:\\/\\/)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$';

        if (!applicationIcon.auth_type && !applicationTpl.auth_types) {
            return defaultPattern;
        }
        const auth = applicationIcon.auth_type ? applicationIcon.auth_type : this._supportedAuthTypeByPriority(applicationTpl.auth_types);
        return (['login', 'none'].indexOf(auth) !== -1) ? allowFtpPattern : defaultPattern;
    }

    save(application) {
        this._submit(application);
    }

    _applicationSaved(app) {
        this._loader = false;

        if (!app) {
            this.dispatchEvent(new CustomEvent('application-settings-no-changes', {
                bubbles: true,
                composed: true,
                detail: {
                    application: this.application
                }
            }));
        }
        else {
            this.application = app;

            this.dispatchEvent(new CustomEvent('application-settings-saved', {
                bubbles: true,
                composed: true,
                detail: {
                    application: app
                }
            }));
        }
    }

    _submit(application) {
        application = (application && application.self) ?
            application :
            this._computeApplicationFromAppAndTpl(
                this.application ? this.application : {},
                this.applicationTemplate ? this.applicationTemplate : {}
            )
        ;
        this._loader = true;
        this.message = "";
        const me = this;
        this._submitApplicationConfigure(application).then(function(app) {
            me._submitNewClaims(app).then(function(app) {
                me._applicationSaved(app);
            }, function() {
                me._applicationSaved(app);
            });
        });
    }

    _submitApplicationConfigure(application) {
        const me = this;
        if(!this.applicationSettings) {
            return new Promise(function(resolve, reject){ resolve(me.application)});
        }
        return new Promise(function (resolve, reject) {
            let body = "";
            if (application.title !== me.shadowRoot.querySelector('#title').value) {
                body = encodeURIComponent(me.shadowRoot.querySelector('#title').name) + "=" + encodeURIComponent(me.shadowRoot.querySelector('#title').value);
            }
            if (me.shadowRoot.querySelector('#url') && application.url !== me.shadowRoot.querySelector('#url').value) {
                body += body === "" ? '' : '&';
                body += encodeURIComponent(me.shadowRoot.querySelector('#url').name) + "=" + encodeURIComponent(me.shadowRoot.querySelector('#url').value);
            }
            if ('' !== body) {
                const options = {
                    url: application.self + (me.company ? '' : '/application'),
                    method: 'PATCH',
                    body: body,
                    handleAs: 'json',
                    headers: me._headers
                };

                const request = document.createElement('iron-request');
                request.send(options).then(function() {
                    if (request.succeeded) {
                        me.company ? resolve(request.response) : resolve(request.response.icon);
                    }
                });
            } else {
                resolve(application);
            }
        });
    }

    _submitNewClaims(application) {
        const me = this,
            form = this.shadowRoot.querySelector('[data-claims]');

        return new Promise(function(resolve, reject){
            if(!form) {
                reject('No claims form');
                return;
            }
            if(form.didFieldsChanged()) {
                const options = {
                    url: application.self,
                    method: 'PATCH',
                    body: form.encodedBodyValues(),
                    handleAs: 'json',
                    headers: me._headers
                };

                const request = document.createElement('iron-request');
                request.send(options).then(function() {
                    if (request.succeeded) {
                        resolve(request.response.icon);
                    }
                });
            } else {
                me._loader = false;
                me.dispatchEvent(new CustomEvent('form-error', { bubbles: true, composed: true }));
                resolve(application)
            }
        });
    }

    isValid() {
        let form = dom(this.root).querySelector('[data-claims]'),
            title = this.shadowRoot.getElementById('title'),
            url = this.shadowRoot.getElementById('url'),
            valid = false;

        if (title && url) {
            valid = (!title.invalid && !url.invalid);
        }
        else if (title && !url) {
            valid = !title.invalid;
        }
        else if (!title && url) {
            valid = !url.invalid;
        }
        else {
            valid = true;
        }

        return valid && (form ? form.isValid() : true);
    }

    setUp() {}

    reset() {
        const application = JSON.parse(JSON.stringify(this.application));
        const applicationTemplate = JSON.parse(JSON.stringify(this.applicationTpl));

        this.application = {};
        this.applicationTemplate = {};
        this.application = application;
        this.applicationTpl = applicationTemplate;
    }
}
window.customElements.define(AppscoApplicationSettings.is, AppscoApplicationSettings);
