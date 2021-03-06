import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import { AppscoTutorialBehaviour } from './appsco-tutorial-behaviour.js';
import { AppscoCoverBehaviour } from '../components/appsco-cover-behaviour.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import Popper from "popper.js";
import { DisableUpgradeMixin } from "@polymer/polymer/lib/mixins/disable-upgrade-mixin";

class AppscoTutorialShareResources extends mixinBehaviors([
    AppscoTutorialBehaviour,
    AppscoCoverBehaviour
], DisableUpgradeMixin(PolymerElement)) {
    static get template() {
        return html`
        <style>
            :host {
            }
            :host .fail-step,
            :host .step{
                z-index: 9000;
                background-color: var(--header-background-color);
                color: var(--header-text-color);
                border: 1px solid rgba(0,0,0,0.3);

                padding: 10px;
                @apply --shadow-elevation-8dp;
                margin-left:10px;
            }
            .flex-horizontal {
                @apply --layout-horizontal;
            }
            .empty {
                @apply --layout-flex;
            }
        </style>

        <div id="popper-fail-share-resource-tutorial" class="fail-step" hidden="">
            <p>No resources exist in the company.
                <br> Please add some and restart this tutorial.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button>Close</paper-button>
                </div>
            </div>
        </div>

        <div id="step-1" class="step" hidden="">
            <p>Open the company menu to get started.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-2" class="step" hidden="">
            <p>You can share company applications here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-3" class="step" hidden="">
            <p>Select the resource you wish to share.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-4" class="step" hidden="" style="position: absolute">
            <p>To share the selected resource, click here.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-5" class="step" hidden="">
            <p>Select the user you wish to share the resource to.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>

        <div id="step-6" class="step" hidden="">
            <p>To share the resources to the selected user click SHARE.</p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_nextStep">Next</paper-button>
                </div>
            </div>
        </div>
        <div id="step-7" class="step" hidden="">
            <p> You have seen how to share the company resource to the user. <br>
                Open the company menu to continue with the Get started tutorial. </p>
            <div class="flex-horizontal">
                <div class="empty"></div>
                <div>
                    <paper-button on-tap="_readMore">Read more</paper-button>
                    <paper-button on-tap="_nextStep">Done</paper-button>
                </div>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-tutorial-share-resources'; }

    static get properties() {
        return {
            page: {
                type: String
            },

            resourcesPageLoaded: {
                type: Boolean,
                value: false
            },

            resourceShareAccountsLoaded: {
                type: Boolean,
                value: false
            }
        };
    }

    constructor() {
        super();

        this.tutorialId = 'share_resources';
        this.tutorialTitle = 'Share resources';
        this.description = 'Share resources to users';
        this.icon = 'icons:list';
        this.readme = 'https://support.appsco.com/hc/en-gb/articles/360000230631-How-to-share-resources-';
    }

    ready() {
        super.ready();

        this.tutorialId = 'share_resources';
        this.tutorialTitle = 'Share resources';
        this.description = 'Share resources to users';
        this.icon = 'icons:list';
        this.readme = 'https://support.appsco.com/hc/en-gb/articles/360000230631-How-to-share-resources-';

        afterNextRender(this, function() {
            this.init();
        });
    }

    _readMore() {
        window.open(this.readme, '_blank');
    }

    pageChanged() {
        if(this.page !== 'resources' && this.step === 2) {
            this.reset();
        }
    }

    getPopperConfig() {
        return {
            step1: {
                reference: [ '#menuBurger' ],
                coverTarget: [ '#menuBurger' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step2: {
                reference: [ '#menuCompanyResourcesText' ],
                coverTarget: [ '#menuContainer' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step3: {
                reference: [ '#appscoResourcesPage', '#appscoResources', 'appsco-company-resource-item', 'div.select-action' ],
                coverTarget: [ '#appscoResourcesPage', '#appscoResources', 'appsco-company-resource-item', 'div.select-action' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step4: {
                reference: [ '#appscoResourcesPageActions', '#appscoApplicationsActions', '#shareAction' ],
                coverTarget: [ '#appscoResourcesPageActions', '#appscoApplicationsActions', '#shareAction' ],
                popperOptions: {
                    placement: 'left-start'
                }
            },
            step5: {
                reference: [ '#appscoResourcesPage', '#appscoShareResource', 'paper-dialog-scrollable appsco-account-list-item', 'div.select-action' ],
                coverTarget: [ '#appscoResourcesPage', '#appscoShareResource', 'paper-dialog-scrollable appsco-account-list-item' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step6: {
                reference: [ '#appscoResourcesPage', '#appscoShareResource', '#shareResourceConfirmShareButton' ],
                coverTarget: [ '#appscoResourcesPage', '#appscoShareResource', '#shareResourceConfirmShareButton' ],
                popperOptions: {
                    placement: 'right-start'
                }
            },
            step7: {
                reference: [ '#menuBurger' ],
                coverTarget: [ '#menuBurger' ],
                popperOptions: {
                    placement: 'right-start'
                }
            }
        };
    }

    step3(index, item, doneBuildingPopperHandler) {
        const handleFunction = function () {
            const firstApplication = this._querySelector([ '#appscoResourcesPage', '#appscoResources', 'appsco-company-resource-item' ]),
                firstApplicationSelector = this._querySelector( [ '#appscoResourcesPage', '#appscoResources', 'appsco-company-resource-item', 'div.select-action' ]);

            if (this.resourcesPageLoaded && !firstApplication) {
                const cover = this.buildCover(this._querySelector( [ '#appscoResourcesPage', '#appscoResources', 'div.load-more-box' ])),
                    failElement = this._querySelector([ '#appscoTutorial', '#shareResource', '#popper-fail-share-resource-tutorial' ]),
                    closeButton = this._querySelector([ '#appscoTutorial', '#shareResource', '#popper-fail-share-resource-tutorial paper-button' ]),
                    popper = new Popper(this._querySelector(['#appscoResourcesPage', '#appscoResources' ]), failElement, {
                        placement: 'right-start'
                    }),
                    closeListener = function () {
                        cover.destroy();
                        popper.destroy();
                        failElement.hidden = true;
                        closeButton.removeEventListener('click', closeListener);
                        this.reset();
                    }.bind(this);
                closeButton.addEventListener('click', closeListener);

                cover.show();
                failElement.hidden = false;

                return;
            }

            if (!firstApplication || !firstApplicationSelector || !this.resourcesPageLoaded) {
                setTimeout(handleFunction, 200);
                return;
            }

            this.handleStep(index, item, doneBuildingPopperHandler);
        }.bind(this);
        handleFunction();
    }

    step4(index, item, doneBuildingPopperHandler) {
        setTimeout(function() {
            this.handleStep(index, item, doneBuildingPopperHandler);
        }.bind(this), 350);
    }

    step5(index, item, doneBuildingPopperHandler) {
        setTimeout(function() {
            let checkerFunction;
            this._querySelector([ '#appscoResourcesPage', '#appscoShareResource', 'paper-dialog#dialog' ]).setAttribute(
                'no-cancel-on-outside-click', true
            );
            this._querySelector([ '#appscoResourcesPage', '#appscoShareResource',  'paper-dialog#dialog' ]).setAttribute(
                'no-cancel-on-esc-key', true
            );

            checkerFunction = function() {
                const dialog = this._querySelector([ '#appscoResourcesPage', '#appscoShareResource', 'paper-dialog-scrollable appsco-account-list-item' ]);
                if (!dialog || !this.resourcesPageLoaded || !this.resourceShareAccountsLoaded) {
                    setTimeout(checkerFunction, 200);
                    return;
                }
                this.handleStep(index, item, doneBuildingPopperHandler);
            }.bind(this);

            checkerFunction();
        }.bind(this), 700);
    }

    start() {
        this.step = 0;
        this.nextStep();
    }

    _nextStep() {
        this.currentStep.reference.click();
    }

    afterTutorialDone() {
        this
            ._querySelector([ '#appscoResourcesPage', '#appscoShareResource', 'paper-dialog#dialog' ])
            .removeAttribute('no-cancel-on-outside-click');
        this
            ._querySelector([ '#appscoResourcesPage', '#appscoShareResource', 'paper-dialog#dialog' ])
            .removeAttribute('no-cancel-on-esc-key');
    }
}
window.customElements.define(AppscoTutorialShareResources.is, AppscoTutorialShareResources);
