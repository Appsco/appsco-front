import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="appsco-layout-with-cards-styles">
    <template>
        <style>
            :host {
                display: block;
                padding: 10px;
                overflow-y: auto;
                @apply --appsco-layout-with-cards;

                --paper-card: {
                    @apply --layout-vertical;
                    box-sizing: border-box;
                };
                --paper-card-content: {
                    min-height: 90px;
                    box-sizing: border-box;
                };
                --paper-card-actions: {
                    padding: 0;
                    border-color: var(--divider-color);
                };
                --paper-card-header-text: {
                    padding-bottom: 8px;
                    padding-top: 8px;
                    padding-left: 16px;
                    padding-right: 16px;
                    font-size: 18px;
                    color: var(--primary-text-color);
                    border-bottom: 1px solid var(--divider-color);
                };

                --appsco-list-progress-bar: {
                    top: -6px;
                };
            }
            :host .card-actions paper-button {
                width: 100%;
                padding: 6px 0;
                margin: 0;
                border-radius: 0;
                font-weight: normal;
                color: var(--primary-text-color);
            }
            :host .cols-layout {
                @apply --layout-horizontal;
                @apply --layout-wrap;
            }
            :host .cols-layout > * {
                width: 100%;
                margin-bottom: 10px;
            }
            :host .two-cols-layout > *,
            :host .three-cols-layout > * {
                margin-right: 10px;
            }
            :host .two-cols-layout > *:nth-child(2),
            :host .three-cols-layout > *:nth-child(3) {
                margin-right: 0;
            }
            :host .cols-layout .col > * {
                margin-bottom: 10px;
            }
            :host .cols-layout .col > *:last-child {
                margin-bottom: 0;
            }
            :host .two-cols-layout > * {
                width: calc(100% / 2 - 5px);
            }
            :host .three-cols-layout > * {
                width: calc(100% / 3 - 7px);
            }
            :host([medium-screen]) .three-cols-layout > * {
                width: calc(100% / 2 - 5px);
            }
            :host([medium-screen]) .three-cols-layout > *:nth-child(2) {
                margin-right: 0;
            }
            :host([tablet-screen]) .cols-layout > * {
                width: 100%;
                margin-right: 0;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
