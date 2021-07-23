import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '../components/appsco-date-format.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomerDetails extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: none;
                @apply --layout-vertical;
            }
            :host .details-info {
                margin: 6px 0;
                @apply --details-container;
            }
            :host .details-label {
                color: var(--secondary-text-color);
                @apply --paper-font-body1;
                @apply --details-label;
            }
            :host .details-value {
                color: var(--primary-text-color);
                @apply --paper-font-subhead;
                @apply --details-value;
            }
            :host .status-value {
                text-transform: capitalize;
            }
            :host .flex {
                @apply --layout-flex;
                @apply --paper-font-common-nowrap;
            }
        </style>

        <div class="details-info" hidden\$="[[ !customer.created_at ]]">
            <div class="details-label">Customer since</div>
            <appsco-date-format class="details-value" date="[[ customer.created_at.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;, &quot;hour&quot;: &quot;2-digit&quot;, &quot;minute&quot;: &quot;2-digit&quot;}"></appsco-date-format>
        </div>

        <div class="details-info">
            <div class="details-label">Status</div>
            <template is="dom-if" if="[[ customer.active ]]">
                <div class="details-value status-value">Premium</div>
            </template>

            <template is="dom-if" if="[[ !customer.active ]]">
                <div class="details-value status-value">Free</div>
            </template>
        </div>

        <div class="details-info" hidden\$="[[ !customer.contact_email ]]">
            <div class="details-label">Contact</div>
            <div class="details-value">[[ customer.contact_email ]]</div>
        </div>
`;
    }

    static get is() { return 'appsco-customer-details'; }

    static get properties() {
        return {
            customer: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onCustomerChanged'
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 500
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 100
                }
            }
        };
    }

    _onCustomerChanged() {
        this._showDetails();
    }

    _showDetails() {
        this.style.display = 'block';
        this.playAnimation('entry');
    }
}
window.customElements.define(AppscoCustomerDetails.is, AppscoCustomerDetails);
