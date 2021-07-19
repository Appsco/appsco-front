import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import './appsco-integration-webhook-item.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import '../components/appsco-list-styles.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoIntegrationWebhooks extends mixinBehaviors([
    AppscoListBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host appsco-integration-webhook-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-integration-webhook-item;
            }
        </style>

        <iron-ajax id="getListApiRequest" url="[[ _listApi ]]" on-error="_onGetListError" on-response="_onGetListResponse" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

        <iron-ajax id="getWatcherListApiRequest" url="[[ _watcherListApi ]]" on-response="_onGetWatcherListResponse" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

        <div class="list-container">

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_listEmpty ]]">
                <div class="list">
                    <template is="dom-repeat" items="[[ _listItems ]]" on-dom-change="_onItemsDomChange">

                        <appsco-integration-webhook-item id="appscoListItem_[[ index ]]" item="[[ item ]]" integration="[[ integration ]]" type="[[ type ]]" selectable="[[ selectable ]]" on-item="_onListItemAction" on-select-item="_onSelectListItemAction"></appsco-integration-webhook-item>
                    </template>
                </div>
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

    static get is() { return 'appsco-integration-webhooks'; }

    static get properties() {
        return {
            integration: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _watcherListApi: {
                type: String,
                computed: '_computeWatcherListApi(integration)'
            },

            _watcherList: {
                type: Array,
                value: function () {
                    return [];
                },
                observer: '_onWatcherListChanged'
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
        this.addEventListener('list-loaded', this._getWatcherList);
    }

    _computeWatcherListApi(integration) {
        return integration.meta ? (integration.meta.watchers + '?extended=1') : null;
    }

    _getWatcherList() {
        this._removeUnActiveWebhooks();
        this.$.getWatcherListApiRequest.generateRequest();
    }

    _onWatcherListChanged() {
        this._setWebhooksState();
    }

    addIntegrationWatcher(watcher) {
        let watchers = JSON.parse(JSON.stringify(this._watcherList));

        watchers.push(watcher);
        this.set('_watcherList', watchers);
    }

    removeIntegrationWatcher(watcher) {
        const watchers = JSON.parse(JSON.stringify(this._watcherList)),
            length = watchers.length;

        for (let i = 0; i < length; i++) {
            if (watcher.alias === watchers[i].alias) {
                watchers.splice(i, 1);
                break;
            }
        }

        this.set('_watcherList', watchers);
    }

    reloadWebhooksList() {
        this._generateNewRequest();
    }

    _removeUnActiveWebhooks() {
        const webhooks = JSON.parse(JSON.stringify(this._allListItems)),
            webhooksLength = webhooks.length,
            removeWebhooks = [];
        for (let j = 0; j < webhooksLength; j++) {
            let webhook = webhooks[j];

            if (false === this._isVisible(webhook)) {
                removeWebhooks.push(webhook);
            }
        }

        if (0 < removeWebhooks.length) {
            this.removeItems(removeWebhooks);
        }
    }

    _setWebhooksState() {
        let webhooks = JSON.parse(JSON.stringify(this._allListItems)),
            webhooksLength = webhooks.length,
            modifyWebhooks = [],
            watchers = this._watcherList,
            watchersLength = this._watcherList.length;

        for (let j = 0; j < webhooksLength; j++) {
            let webhook = webhooks[j];
            let registered = false;

            for (let i = 0; i < watchersLength; i++) {
                if (webhook.self === watchers[i].meta.webhook) {
                    webhook.removeWatcherApi = watchers[i].self;
                    this.shadowRoot.getElementById('appscoListItem_' + j).register(watchers[i].url);
                    modifyWebhooks.push(webhook);
                    registered = true;
                    break;
                }
            }
            if (!registered) {
                delete webhook.removeWatcherApi;
                this.shadowRoot.getElementById('appscoListItem_' + j).unregister();
                modifyWebhooks.push(webhook);
            }
        }

        if (0 < modifyWebhooks.length) {
            this.modifyItems(modifyWebhooks);
        }
    }

    _isVisible(webhook) {
        // If From Method is set to null then it is not visible webhook
        return null !== webhook.fromMethod;
    }

    _onGetWatcherListResponse(event) {
        this.set('_watcherList', (event.detail.response && event.detail.response.watchers) ? event.detail.response.watchers : []);
    }
}
window.customElements.define(AppscoIntegrationWebhooks.is, AppscoIntegrationWebhooks);
