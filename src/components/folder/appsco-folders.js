import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import './appsco-folders-item.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import { AppscoListObserverBehavior } from '../components/appsco-list-observer-behavior.js';
import '../components/appsco-list-styles.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-icon-item.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoFolders extends mixinBehaviors([
    AppscoListBehavior,
    AppscoListObserverBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host {
                --folder-item-host: {
                    width: calc(20% - 10px);
                };

                --appsco-list-item: {
                    height: 50px;
                };

                --item-basic-info: {
                    padding: 0;
                    box-sizing: border-box;
                };
                --paper-item-focused: {
                    background-color: white;
                    font-weight: normal;
                };
            }
            :host .list {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                @apply --layout-start;
                margin-right: -10px;
            }
            :host .list-container {
                min-height: auto;
            }
            :host appsco-folders-item {
                margin: 0 10px 10px 0;
                @apply --appsco-folders-item;
            }
            .popup-menu-item-list {
                padding: 0;
            }
            .popup-menu-item {
                align-items: center;                    
                cursor:pointer;
                font-size: 14px;
                height: 40px;
                line-height: 24px;
                min-height: 40px;
                padding: 0 16px;
                position: relative;
                user-select: none;
                width: 168px;
                -webkit-font-smoothing: antialiased;
            }
        </style>

        <iron-ajax id="getListApiRequest" url="[[ _listApi ]]" on-error="_onGetListError" on-response="_onGetListResponse" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

        <div class="list-container">

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_listEmpty ]]">

                <vaadin-context-menu selector="appsco-folders-item">

                    <template>
                        <paper-listbox class="popup-menu-item-list">
                            <paper-icon-item class="popup-menu-item" list-item="[[ target ]]" on-click="_openRenameDialog">
                                <iron-icon icon="create" list-item="[[ target ]]" item-icon="" slot="item-icon"></iron-icon> Rename
                            </paper-icon-item>

                            <paper-icon-item class="popup-menu-item" list-item="[[ target ]]" on-click="_openRemoveDialog">
                                <iron-icon icon="delete" list-item="[[ target ]]" item-icon="" slot="item-icon"></iron-icon> Remove
                            </paper-icon-item>
                        </paper-listbox>
                    </template>

                    <div class="list">
                        <template is="dom-repeat" items="[[ _listItems ]]" on-dom-change="_onItemsDomChange">

                            <appsco-folders-item id="appscoListItem_[[ index ]]" item="[[ item ]]" type="[[ type ]]" request-headers="[[ _headers ]]" preview="[[ preview ]]" selectable="[[ selectable ]]" on-item="_onListItemAction" on-select-item="_onSelectListItemAction"></appsco-folders-item>

                        </template>
                    </div>

                </vaadin-context-menu>
            </template>
        </div>

        <template is="dom-if" if="[[ !_listEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button class="load-more-action" on-tap="_onLoadMoreAction">Load More</paper-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-folders'; }

    static get properties() {
        return {
            preview: {
                type: Boolean,
                value: false
            },

            selectable: {
                type: Boolean,
                value: true
            }
        };
    }

    _openRenameDialog(event) {
        const menuItem = event.target,
            folderItem = menuItem.listItem;

        if (folderItem && folderItem.item) {
            this.dispatchEvent(new CustomEvent('open-rename-folder-dialog', {
                bubbles: true,
                composed: true,
                detail: {
                    folderItem: folderItem.item
                }
            }));
        }
    }

    _openRemoveDialog(event) {
        const menuItem = event.target,
            folderItem = menuItem.listItem;

        if (folderItem && folderItem.item) {
            this.dispatchEvent(new CustomEvent('open-remove-folder-dialog', {
                bubbles: true,
                composed: true,
                detail: {
                    folderItem: folderItem.item
                }
            }));
        }
    }
}
window.customElements.define(AppscoFolders.is, AppscoFolders);
