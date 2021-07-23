import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import '../account/appsco-account-image.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomerItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles"></style>

        <style>
            :host .customer-icon-container {
                width: 52px;
                height: 52px;
                margin: 0;
                border-radius: 26px;
                background-color: var(--customer-icon-background-color, var(--account-initials-background-color));
                position: relative;
            }
            :host .customer-icon {
                width: 24px;
                height: 24px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;

                --iron-icon-fill-color: var(--primary-text-color, #ffffff);
            }
            :host([mobile-screen]) .item-additional-info {
                display: none;
            }
            :host .item-info {
                padding: 0 10px;
            }
            :host([preview][activated]) {
                font-weight: 500;
                background-color: #e8e8e8;
            }
            .info-label.item-title {
                font-size: 14px;
                cursor: pointer;
                margin: 0;
                padding: 0;
            }
            :host([preview]) {
                display: block;
                margin: 0;
                padding: 5px;
                font-size: 14px;
                box-sizing: border-box;
            }
        </style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>
        
        <template is="dom-if" if="[[ preview ]]">
            <span class="info-label item-title">[[ item.name ]]</span>
        </template>

        <template is="dom-if" if="[[ !preview ]]">
            <div class="item">
                <template is="dom-if" if="[[ selectable ]]">
                    <div class="select-action" on-tap="_onSelectItemAction">
    
                        <div class="customer-icon-container">
                            <iron-icon class="customer-icon" icon="icons:social:domain"></iron-icon>
                        </div>
    
                        <div class="icon-action">
                            <div class="iron-action-inner">
                                <iron-icon icon="icons:check"></iron-icon>
                            </div>
                        </div>
                    </div>
                </template>
    
                <template is="dom-if" if="[[ !selectable ]]">
                    <div class="customer-icon-container">
                        <iron-icon class="customer-icon" icon="icons:social:domain"></iron-icon>
                    </div>
                </template>
    
                <div class="item-info item-basic-info">
                    <span class="info-label group-title">[[ item.name ]]</span>
                    <span class="info-value">[[ item.contact_email ]]</span>
                </div>
    
                <div class="item-info item-additional-info">
                    <div class="info">
                        <span class="info-label">Partner admins:&nbsp;</span>
                        <span class="info-value">[[ _partnerAdminsCount ]]</span>
                    </div>
                    <div class="info">
                        <span class="info-label">Licences:&nbsp;</span>
                        <span class="info-value">[[ _licencesCount ]]</span>
                    </div>
                    <div class="info">
                        <span class="info-label">Status:&nbsp;</span>
                        <template is="dom-if" if="[[ !item.trial_period ]]">
                            <span class="info-value">premium</span>
                        </template>
    
                        <template is="dom-if" if="[[ item.trial_period ]]">
                            <span class="info-value">free</span>
                        </template>
                    </div>
                </div>
    
                <div class="actions">
                    <paper-button on-tap="_onEditItemAction">Edit</paper-button>
                </div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-customer-item'; }

    static get properties() {
        return {
            preview: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            listApi: {
                type: String
            },

            _partnerAdminsCount: {
                type: Number,
                value: 0
            },

            _licencesCount: {
                type: Number,
                value: 0
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }

    ready() {
        super.ready();

        if (!this.item.partner) {
            this.item.partner = this.listApi;
        }
        this._licencesCount = this.item.max_subscription_size;
        this._partnerAdminsCount = this.item.partner_admins;
        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('tap', this._onItemAction);
    }

    reloadInfo() {
    }
}
window.customElements.define(AppscoCustomerItem.is, AppscoCustomerItem);
