import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

window.AppscoImageQueue = (() => {
    let queue = [];

    let isCalled = false;

    let emptyImageQueue = () => {

        if (queue.length > 0 && !isCalled) {
            isCalled = true;
            setTimeout(() => {
                let callable = queue.shift();
                if(callable) {
                    callable();
                    isCalled = false;
                    emptyImageQueue();
                }
            }, 16)
        }
    }
    return {
        push: (callable) => {
            queue.push(callable);
        },
        next: () => {
            if(isCalled) return;
            emptyImageQueue();
        }
    }
})()

class AppscoApplicationItem extends PolymerElement {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                width: 100%;
                margin: 0 0 10px 0;

                --icon-action-border-radius: 16px;
            }
            :host .item-basic-info {
                padding: 0 10px;
            }
            :host([display-grid]) .item-icon {
                margin: 24px 0 8px 0;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="item" on-tap="_onApplicationAction">
            <iron-image class="item-icon" 
                        placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAI5JREFUeAHt1YEJwCAQBEFN/60KYgMRbGMnHXjs5Ofa5x/h7wu//T3dAAqIL4BAPIChAAXEF0AgHoCfIAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBe4yV0EThqVC64AAAAASUVORK5CYII=" 
                        sizing="cover" preload="" fade="" src="[[ _applicationIcon ]]"
                        loaded="{{ _iconLoaded }}"
            ></iron-image>

            <template is="dom-if" if="[[ !displayGrid ]]">
                <div class="item-info item-basic-info">
                    <span class="info-label item-title">[[ application.title ]]</span>
                    <span class="info-value" hidden\$="[[ !company ]]">[[ _applicationType ]]</span>
                </div>

                <div class="item-info item-additional-info">
                    <template is="dom-if" if="[[ _orgUnits ]]">
                        <div class="info">
                            <span class="info-label">Organization units:&nbsp;</span>
                            <span class="info-value" hidden\$="[[ !company ]]">[[ _orgUnits ]]</span>
                        </div>
                    </template>

                    <template is="dom-if" if="[[ _groups ]]">
                        <div class="info">
                            <span class="info-label">Groups:&nbsp;</span>
                            <span class="info-value">[[ _groups ]]</span>
                        </div>
                    </template>
                </div>
            </template>

            <template is="dom-if" if="[[ displayGrid ]]">
                <div class="resource-title">
                    [[ application.title ]]
                </div>
            </template>

            <div class="actions">
                <template is="dom-if" if="[[ !company ]]">
                    <paper-button on-tap="_onInfo">Info</paper-button>
                </template>

                <paper-button on-tap="_onEdit" disabled\$="[[ !_editable ]]">Edit</paper-button>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-application-item'; }

    static get properties() {
        return {
            company: {
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
                observer: '_onApplicationChanged'
            },

            displayGrid: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _applicationType: {
                type: String,
                computed: '_computeApplicationType(application)'
            },

            _orgUnits: {
                type: String,
                computed: '_computeOrganizationUnits(company, application)'
            },

            _groups: {
                type: String,
                computed: '_computeGroups(company, application)'
            },

            active: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            computedIcon: {
                type: Boolean,
                value: false
            },

            _applicationIcon: {
                type: String,
                computed: '_computeApplicationIcon(company, application)'
            },

            _iconLoaded: {
                type: Boolean,
                observer: '_onIconLoaded'
            },

            _shared: {
                type: Boolean,
                computed: '_computeApplicationShared(company, application)'
            },

            _editable: {
                type: Boolean,
                computed: '_computeApplicationEditable(_shared, application)'
            },
        };
    }

    ready() {
        super.ready();

        beforeNextRender(this, function() {
            this.style.display = 'inline-block';
        });
    }

    _onIconLoaded() {
        window.AppscoImageQueue.next();
    }

    _onApplicationChanged(application) {
        if (this.company) {
            this.active = application.selected;
        }
    }

    _computeApplicationType(application) {
        switch (application.auth_type) {
            case 'rdp':
                return 'Remote Desktop Protocol';
            case 'login':
                return 'Login';
            case 'cc':
                return 'Credit Card';
            case 'softwarelicence':
                return 'Software Licence';
            case 'passport':
                return 'Passport';
            case 'securenote':
                return 'Secure Note';
            case 'none':
                return 'Link';
            case 'open_id':
                return 'Open ID';
            case 'aurora_files':
                return 'Aurora Files';
            default:
                return 'Application';
        }
    }

    _computeOrganizationUnits(company, application) {
        if (company && application.org_units && application.org_units.length > 0) {
            let result = '',
                orgUnits = application.org_units,
                length = orgUnits.length;

            for (let i = 0; i < length; i++) {
                result += orgUnits[i].name;
                result += (i === length -1) ? '' : ', ';
            }
            return result;
        }

        return '';
    }

    _computeGroups(company, application) {
        if (company && application.groups && application.groups.length > 0) {
            let result = '',
                groups = application.groups,
                length = groups.length;

            for (let i = 0; i < length; i++) {
                result += groups[i].name;
                result += (i === length -1) ? '' : ', ';
            }

            return result;
        }

        return '';
    }

    _computeApplicationIcon(company, application) {
        if(this.computedIcon) return '';
        this.computedIcon = true;
        window.AppscoImageQueue.push(() => {
            this.shadowRoot.querySelector('.item-icon').src = company ? application.application_url : application.icon_url;
        });
        return '';
    }

    _computeApplicationShared(company, application) {
        return (!company && !application.owner);
    }

    _computeApplicationEditable(shared, application) {
        return !shared || application.application.user_can_edit;
    }

    _onInfo(event) {
        event.stopPropagation();

        this.dispatchEvent(new CustomEvent('info', {
            bubbles: true,
            composed: true,
            detail: {
                application: this.application
            }
        }));
    }

    _onEdit(event) {
        event.stopPropagation();

        if (this._shared) {
            this.dispatchEvent(new CustomEvent('edit-shared-application', {
                bubbles: true,
                composed: true,
                detail: {
                    application: this.application
                }
            }));
        } else {
            this.dispatchEvent(new CustomEvent('edit', {
                bubbles: true,
                composed: true,
                detail: {
                    application: this.application
                }
            }));
        }
    }

    _onApplicationAction() {
        this.active = !this.active;

        if (this.company) {
            this.application.selected = this.active;
        }

        this.dispatchEvent(new CustomEvent('application', {
            bubbles: true,
            composed: true,
            detail: {
                application: this.application
            }
        }));
    }

    select() {
        this.active = true;
    }

    deselect() {
        this.active = false;
    }
}
window.customElements.define(AppscoApplicationItem.is, AppscoApplicationItem);
