import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import { AppscoApplicationFormBehavior } from './appsco-application-form-behavior.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApplicationFormSaml extends mixinBehaviors([AppscoApplicationFormBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            paper-dropdown-menu {
              display: block;
            }
            paper-toggle-button {
              margin-top: 20px;
            }
            paper-toggle-button[disabled] {
              --paper-toggle-button-label-color: var(--secondary-text-color);
            }
        </style>
        <paper-input id="samlIssuer" data-field="" label="SAML Issuer" value="[[ claims.samlIssuer ]]" name\$="[[ claimsNamePrefix ]][samlIssuer]" error-message="Please enter SAML Issuer" auto-validate="" required=""></paper-input>

        <paper-input id="domain" data-field="" label="Domain registered at SP" value="[[ claims.domain ]]" name\$="[[ claimsNamePrefix ]][domain]" error-message="Please enter domain" auto-validate="" required=""></paper-input>

        <paper-dropdown-menu data-field="choice" id="nameIdPolicy" name\$="[[ claimsNamePrefix ]][nameIdPolicy]" label="Name ID Policy" horizontal-align="left" always-float-label="" disabled="true" on-iron-overlay-closed="dontCloseOverlay"ma ne to
        >
            <paper-listbox id="paperListboxNameIdPolicy" class="dropdown-content filter" attr-for-selected="value" selected="[[ claims.nameIdPolicy ]]" slot="dropdown-content">
                <template is="dom-repeat" items="[[ _nameIdPolicyList ]]">
                    <paper-item value="[[ item.value ]]">[[ item.name ]]</paper-item>
                </template>
            </paper-listbox>
        </paper-dropdown-menu>

        <paper-dropdown-menu data-field="choice" id="confirmationMethod" name\$="[[ claimsNamePrefix ]][confirmationMethod]" label="Confirmation method" horizontal-align="left" always-float-label="" disabled="true" on-iron-overlay-closed="dontCloseOverlay">
            <paper-listbox id="paperListboxConfirmationMethod" class="dropdown-content filter" attr-for-selected="value" selected="[[ claims.confirmationMethod ]]" slot="dropdown-content">
                <template is="dom-repeat" items="[[ _confirmationMethodList ]]">
                    <paper-item value="[[ item.value ]]">[[ item.name ]]</paper-item>
                </template>
            </paper-listbox>
        </paper-dropdown-menu>

        <paper-dropdown-menu data-field="choice" id="authenticationContext" name\$="[[ claimsNamePrefix ]][authenticationContext]" label="Authentication context" horizontal-align="left" always-float-label="" disabled="true" on-iron-overlay-closed="dontCloseOverlay">
            <paper-listbox id="paperListboxAuthenticationContext" class="dropdown-content filter" attr-for-selected="value" selected="[[ claims.authenticationContext ]]" slot="dropdown-content" >
                <template is="dom-repeat" items="[[ _authenticationContextList ]]">
                    <paper-item value="[[ item.value ]]">[[ item.name ]]</paper-item>
                </template>
            </paper-listbox>
        </paper-dropdown-menu>

        <paper-input id="acsUrl" data-field="" label="ACS URL" value="[[ claims.acsUrl ]]" name\$="[[ claimsNamePrefix ]][acsUrl]" error-message="Please enter ACS URL" auto-validate="" required=""></paper-input>

        <paper-toggle-button id="allowCreate" checked\$="[[ claims.allowCreate ]]" name="[[ claimsNamePrefix ]][allowCreate]" disabled="true">Allow create</paper-toggle-button>

        <iron-a11y-keys keys="enter"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-application-form-saml'; }

    static get properties() {
        return {
            application: {
                type: Object,
                value: function () {
                    return {};
                },
            },
            claims: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onClaimsChanged'
            },

            claimsNamePrefix: {
                type: String,
                value: "claims_saml"
            },

            domain: {
                type: String
            },

            _nameIdPolicyList: {
                type: Array,
                value: function () {
                    return [
                        {
                            name: 'Email',
                            value: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'
                        },
                        {
                            name: 'Unspecified',
                            value: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified'
                        },
                        {
                            name: 'Persistent',
                            value: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent'
                        }
                    ];
                }
            },

            _confirmationMethodList: {
                type: Array,
                value: function () {
                    return [
                        {
                            name: 'Bearer',
                            value: 'urn:oasis:names:tc:SAML:2.0:cm:bearer'
                        }
                    ];
                }
            },

            _authenticationContextList: {
                type: Array,
                value: function () {
                    return [
                        {
                            name: 'Password',
                            value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:Password'
                        },
                        {
                            name: 'Password protected transport',
                            value: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'
                        }
                    ];
                }
            }
        };
    }

    _onClaimsChanged(claims) {
        for (let key in claims) {
            return false;
        }

        if(this.application.url_editable) {
            this.$.nameIdPolicy.removeAttribute('disabled');
            this.$.confirmationMethod.removeAttribute('disabled');
            this.$.authenticationContext.removeAttribute('disabled');
        }


        this.set('claims', {
            samlIssuer : this.domain,
            nameIdPolicy : 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
            confirmationMethod : 'urn:oasis:names:tc:SAML:2.0:cm:bearer',
            authenticationContext : 'urn:oasis:names:tc:SAML:2.0:ac:classes:Password',
            allowCreate : false
        });
    }

    dontCloseOverlay(event, a) {
        event.stopPropagation();
        return false;
    }
}
window.customElements.define(AppscoApplicationFormSaml.is, AppscoApplicationFormSaml);
