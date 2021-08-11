import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@polymer/paper-styles/shadow.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/components/appsco-search.js';
import './provisioninglog/appsco-provisioning-log.js';
import './auditlog/appsco-audit-log-page-actions.js';
import './lib/mixins/appsco-headers-mixin.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import * as gestures from '@polymer/polymer/lib/utils/gestures.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoProvisioningLogPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppLocalizeBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --content-background-color: #ffffff;

                --paper-dropdown-menu: {
                     width: 100%;
                 };

                --audit-log-list: {
                     padding-top: 2px;
                 };
            }
            paper-dropdown-menu {
                --paper-input-container: {
                     padding-bottom: 0;
                 };
                --paper-input-container-input: {
                     font-size: 14px;
                     cursor: pointer;
                 };
            }
            :host .content-container {
                padding-top: 0;
            }
            appsco-provisioning-log {
                min-width: 730px;
            }
            .filter {
                position: relative;
            }
            paper-listbox {
                @apply --shadow-elevation-2dp;
                width: 100%;
                min-height: 100px;
                max-height: calc(100vh - 2*64px - 20px - 45px - 2*54px);
                overflow-y: auto;
                position: absolute;
                top: 50px;
                left: 0;
                z-index: 10;
                opacity: 1;
                visibility: visible;
                transform: scale(1, 1);
                transform-origin: top center;
                transition: all 0.2s linear;
            }
            paper-listbox[hidden] {
                opacity: 0;
                visibility: hidden;
                transform: scale(1, 0.6);
                transform-origin: top center;
                transition: all 0.1s linear;
            }
            paper-item {
                min-height: initial;
                padding: 8px 10px;
                line-height: 18px;
            }
            vaadin-date-picker {
                --paper-input-container-label: {
                    font-size: 14px;
                };
                --paper-input-container-input: {
                    font-size: 14px;
                };
            }
            :host([tabletScreen900]) {
                --resource-width: 250px;
            }
            :host([tablet-screen]) {
                --resource-width: 250px;
            }
            :host([mobile-screen]) {
                --resource-width: 100%;
            }
        </style>

        <iron-media-query query="(max-width: 900px)" query-matches="{{ tabletScreen900 }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <iron-ajax auto="" method="GET" url="[[ auditLogEventTypesApi ]]" headers="[[ _headers ]]" handle-as="json" on-response="_onEventTypesResponse"></iron-ajax>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">
                <div class="resource-header">
                    Filters
                </div>

                <div class="resource-content filters">
                    <div class="filter">

                        <appsco-search id="filterIntegration" label="Filter by integration" float-label="" on-keyup="_onFilterIntegrationKeyup" on-search="_onFilterIntegrationSearch" on-search-clear="_onClearIntegrationSearch">
                        </appsco-search>
<!--                        <paper-listbox id="suggestedAccounts" class="dropdown-content" attr-for-selected="value" on-iron-activate="_onFilterAccount" hidden="">-->
<!--                                <template is="dom-repeat" items="{{ _accountList }}">-->
<!--                                    <paper-item value="[[ item.value ]]" label="[[ item.text ]]">[[ item.text ]]</paper-item>-->
<!--                                </template>-->
<!--                        </paper-listbox>-->
                    </div>
                    
                    <div class="filter">

                        <appsco-search id="filterAccount" label="Filter log by account" float-label="" on-keyup="_onFilterAccountKeyup" on-search="_onFilterAccountSearch" on-search-clear="_onClearAccountSearch">
                        </appsco-search>
                        <paper-listbox id="suggestedAccounts" class="dropdown-content" attr-for-selected="value" on-iron-activate="_onFilterAccount" hidden="">
                                <template is="dom-repeat" items="{{ _accountList }}">
                                    <paper-item value="[[ item.value ]]" label="[[ item.text ]]">[[ item.text ]]</paper-item>
                                </template>
                        </paper-listbox>
                    </div>

                    <div id="filterEventType" class="filter">

                        <appsco-search id="appscoSearchEventType" label="Filter log by event type" float-label="" on-focus="_onFilterEventTypeFocus" on-keyup="_onFilterEventTypeKeyup" on-search="_onFilterEventTypeSearch" on-search-clear="_onClearEventTypeSearch"></appsco-search>

                        <paper-listbox id="filterListEventTypes" class="dropdown-content" attr-for-selected="value" on-iron-activate="_onFilterEventType" hidden="">
                            <template is="dom-repeat" items="{{ _eventTypeListDisplay }}">
                                <paper-item value="[[ item.value ]]" label="[[ item.text ]]" id="eventType_[[ index ]]">[[ item.text ]]</paper-item>
                            </template>
                        </paper-listbox>
                    </div>

                    <div class="filter">
                        <vaadin-date-picker id="filterDateFrom" label="Date from" on-value-changed="_onFilterDateFrom"></vaadin-date-picker>
                    </div>

                    <div class="filter">
                        <vaadin-date-picker id="filterDateTo" label="Date to" on-value-changed="_onFilterDateTo"></vaadin-date-picker>
                    </div>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <appsco-provisioning-log id="appscoProvisioningLog" authorization-token="[[ authorizationToken ]]" audit-log-api="[[ auditLogApi ]]" size="30" load-more="" on-loaded="_onLogLoaded" on-empty-load="_onLogLoaded"></appsco-provisioning-log>
                </div>
            </div>

        </appsco-content>
`;
    }

    static get is() { return 'appsco-provisioning-log-page'; }

    static get properties() {
        return {
            companyApi: {
                type: String
            },

            auditLogApi: {
                type: String
            },

            auditLogEventTypesApi: {
                type: String,
                computed: '_computeAuditLogEventTypesApi(companyApi)'
            },

            _searchAccountsApi: {
                type: String,
                computed: '_computeSearchAccountsApi(companyApi, _accountTerm)'
            },

            _eventTypeList: {
                type: Array,
                value: function () {
                    return [
                        this._defaultEventType
                    ];
                }
            },

            _defaultEventType: {
                type: Object,
                value: function () {
                    return {
                        value: '',
                        text: 'All event types'
                    }
                }
            },

            _eventTypeListDisplay: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _eventTypeListResponse: {
                type: Array
            },

            _accountList: {
                type: Array,
                value: function () {
                    return []
                }
            },

            _logListForExport: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _accountTerm: {
                type: String,
                value: ''
            },

            _filterAccount: {
                type: String,
                value: ''
            },

            _filterAccountDisplay: {
                type: String,
                value: ''
            },

            _filterEventType: {
                type: String,
                value: ''
            },

            _filterIntegrationType: {
                type: String,
                value: ''
            },

            _filterFromDate: {
                type: String,
                value: ''
            },

            _defaultFromDateValue: {
                type: String,
                value: ''
            },

            _filterToDate: {
                type: String,
                value: ''
            },

            _defaultToDateValue: {
                type: String,
                value: ''
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen900: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
            },

            _attached: {
                type: Boolean,
                value: false
            },

            _eventTypesUrl: {
                type: String,
                value: function() {
                    return this.resolveUrl('./components/components/data/event-types.json');
                }
            },

            _appLocalizeEventTypesLoaded: {
                type: Boolean,
                value: false
            },

            language: {
                value: 'en',
                type: String
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen, tabletScreen900)',
            '_hideFilters(mobileScreen)',
            '_processEventTypes(_eventTypeListResponse, _appLocalizeEventTypesLoaded)'
        ];
    }

    static get importMeta() {
        return import.meta;
    }

    ready() {
        super.ready();

        this.pageLoaded = false;
        this._attached = true;
        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };

        beforeNextRender(this, function() {
            this.loadResources(this._eventTypesUrl);
            if (this.mobileScreen || this.tabletScreen || this.tabletScreen900) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._setupDatePicker();
            gestures.addListener(document.documentElement, 'tap', this._handleDocumentClick.bind(this));
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('app-localize-resources-loaded', this.onAppLocalizeResourcesLoaded.bind(this));
        this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
        this.toolbar.addEventListener('export-audit-log', this._onExportAuditLogAction.bind(this));
    }

    onAppLocalizeResourcesLoaded(event) {
        if (event.detail.url.toString().indexOf(this._eventTypesUrl) > -1) {
            this._appLocalizeEventTypesLoaded = true;
        }
    }

    _updateScreen() {
        this.updateStyles();
    }

    _hideFilters(mobile) {
        if (mobile) {
            this.hideResource();
        }
    }

    hideResource() {
        this.$.appscoContent.hideSection('resource');
    }

    _onLogLoaded() {
        this._pageLoaded();
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    initializePage() {
        if (this.pageLoaded) {
            this.$.filterAccount.setValue(this._filterAccountDisplay);
            this._filterLog();
        }
    }

    resetPage() {
        this.$.filterAccount.reset();
        this._hideAccountList();
        this.$.suggestedAccounts.selected = 0;
        this.$.appscoSearchEventType.reset();
        this._hideEventTypeList();
        this.$.filterListEventTypes.selected = 0;
        this._filterFromDate = this._defaultFromDateValue;
        this.$.filterDateFrom.value = this._defaultFromDateValue;
        this._filterToDate = this._defaultToDateValue;
        this.$.filterDateTo.value = this._defaultToDateValue;
    }

    _isInPath(path, element) {
        path = path || [];

        for (let i = 0; i < path.length; i++) {
            if (path[i] == element) {
                return true;
            }
        }

        return false;
    }

    _handleDocumentClick(event) {
        const path = dom(event).path;

        if (!this._isInPath(path, this.$.filterEventType)) {
            this._hideEventTypeList();
        }
        if (!this._isInPath(path, this.$.filterAccount)) {
            this._hideAccountList();
        }
    }

    _computeAuditLogEventTypesApi(companyApi) {
        return companyApi ? companyApi + '/log/events' : null;
    }

    _computeSearchAccountsApi(companyApi, term) {
        return (companyApi && term) ? companyApi + '/directory/roles?extended=1&limit=50&term=' + term : null;
    }

    _setupDatePicker() {
        this._setValidDates();
    }

    _setValidDates() {
        const date = new Date(),
            filterDateFromComponent = this.$.filterDateFrom,
            filterDateToComponent = this.$.filterDateTo;

        let day = date.getDate(),
            month = date.getMonth(),
            year = date.getFullYear(),
            fromMonth = month,
            fromYear = year;

        if (10 > day) {
            day = '0' + day;
        }

        if (0 === month) {
            fromMonth = '12';
            fromYear = year - 1;
        }
        else if (10 > month) {
            fromMonth = '0' + month;
        }

        this._defaultFromDateValue = fromYear + '-' + fromMonth + '-' + day;

        month += 1;

        if (10 > month) {
            month = '0' + month;
        }

        this._defaultToDateValue = year + '-' + month + '-' + day;

        this._filterFromDate = this._defaultFromDateValue + ' 00:00:00';
        this._filterToDate = this._defaultToDateValue + ' 23:59:59';

        filterDateFromComponent.value = this._defaultFromDateValue;
        filterDateFromComponent.max = this._defaultToDateValue;
        filterDateToComponent.value = this._defaultToDateValue;

        this._defaultFromDateValue = this._defaultFromDateValue + ' 00:00:00';
        this._defaultToDateValue = this._defaultToDateValue + ' 23:59:59';
    }

    _setValidToDate(date) {
        this.$.filterDateTo.min = date ? date.split(' ')[0] : null;
    }

    _onFilterDateFrom(event) {
        let fromDate = event.detail.value;
        const filterDateFromComponent = this.$.filterDateFrom;

        if (!fromDate) {
            fromDate = this._defaultFromDateValue;
            filterDateFromComponent.value = fromDate;
        }

        this._setValidToDate(fromDate);
        this._filterFromDate = fromDate + ' 00:00:00';

        if (this._attached) {
            this._filterLog();
        }
    }

    _onFilterDateTo(event) {
        let toDate = event.detail.value;
        const filterDateToComponent = this.$.filterDateTo;

        if (!toDate) {
            toDate = this._defaultToDateValue;
            filterDateToComponent.value = toDate;
        }

        this._filterToDate = toDate + ' 23:59:59';

        if (this._attached) {
            this._filterLog();
        }
    }

    _onFilterEventType(event) {
        this._filterEventType = event.detail.selected;
        this.$.appscoSearchEventType.setValue(event.detail.item.label);
        this._filterLog();
        this._hideEventTypeList();
    }

    _formatEventType(item) {
        const localized = this.localize(item);

        if (!localized) {
            return false;
        }

        return {
            value: item,
            text: localized
        };
    }

    _formatApplication(item) {
        if (typeof item.data.application == 'undefined') {
            return '';
        }
        if (typeof item.data.application.title !== 'undefined') {
            return item.data.application.title;
        }
        if (typeof item.data.application.application_template !== 'undefined' && typeof item.data.application.application_template.title !== 'undefined') {
            return item.data.application.application_template.title;
        }
        return '';
    }

    _onEventTypesResponse(event) {
        const response = event.detail.response;

        if (response && response.length > 0) {
            let eventTypeList = [];
            response.forEach((event) => {
                if(event.startsWith('provisioning_')) {
                    eventTypeList.push(event);
                }
            })
            this.set('_eventTypeListResponse', eventTypeList);
        }
    }

    _processEventTypes(_eventTypeListResponse, _appLocalizeEventTypesLoaded) {
        if (!_eventTypeListResponse || !_appLocalizeEventTypesLoaded) {
            return;
        }
        this.set('_eventTypeList', []);
        _eventTypeListResponse.forEach(function(item, index) {
            const eventType = this._formatEventType(item);
            if (eventType) {
                this.push('_eventTypeList', eventType);
            }
        }.bind(this));

        const listSorted = this._eventTypeList.sort(this._sortEventTypesByText);

        listSorted.unshift(this._defaultEventType);
        this.set('_eventTypeListDisplay', listSorted);
        this._setDefaultEventType();
    }

    _sortEventTypesByText(typeA, typeB) {
        return typeA.text < typeB.text ? -1 : typeA.text > typeB.text ? 1 : 0;
    }

    _setDefaultEventType() {
        this.$.appscoSearchEventType.setValue(this._eventTypeList[0].text);
        this.$.filterListEventTypes.selected = 0;
    }

    _filterEventTypeListByTerm(term) {
        const termLength = term.length,
            eventTypes = this._eventTypeList,
            length = eventTypes.length;

        this.set('_eventTypeListDisplay', []);

        if (3 > termLength) {
            term = '';
        }

        const termDecoded = decodeURIComponent(term.toLowerCase()).trim();

        for (let i = 0; i < length; i++) {
            const eventType = eventTypes[i];

            if (eventType && eventType.text.toLowerCase().indexOf(termDecoded) >= 0) {
                this.push('_eventTypeListDisplay', eventType);
            }
        }

        if (0 === this._eventTypeListDisplay.length && 3 < termLength) {
            this.push('_eventTypeListDisplay', {
                value: 'no_result',
                text: 'There is no log record of asked event type.'
            });
        }
    }

    _showEventTypeList() {
        this.$.filterListEventTypes.hidden = false;
    }

    _hideEventTypeList() {
        const eventTypeFilter = this.$.filterListEventTypes,
            appscoEventTypeSearch = this.$.appscoSearchEventType;

        if (0 === appscoEventTypeSearch.getValue().length && eventTypeFilter.selectedItem) {
            this.$.appscoSearchEventType.setValue(eventTypeFilter.selectedItem.label);
        }

        this.$.filterListEventTypes.hidden = true;
    }

    _onFilterEventTypeFocus() {
        this._showEventTypeList();
    }

    _onFilterEventTypeKeyup(event) {
        const keyCode = event.keyCode;

        if (40 === keyCode) {
            event.target.blur();
            this._selectFirstEventType();
        }

    }

    _onFilterEventTypeSearch(event) {
        this._filterEventTypeListByTerm(event.detail.term);
    }

    _onClearEventTypeSearch(event) {
        this._filterEventTypeListByTerm('');
    }

    _selectFirstEventType() {
        const eventTypeFilter = this.$.filterListEventTypes;

        if (!eventTypeFilter.selectedItem) {
            eventTypeFilter.selected = this._eventTypeListDisplay[0].value;
        }

        eventTypeFilter.selectedItem.focus();
    }

    _onFilterAccountSearch(event) {
        this._filterAccountListByTerm(event.detail.term);
    }

    _getAccountsByTerm() {
        return new Promise(function(resolve, reject) {
            const request = document.createElement('iron-request'),
                options = {
                    url: this._searchAccountsApi,
                    method: 'GET',
                    handleAs: 'json',
                    headers: this._headers
                };

            request.send(options).then(function() {
                if (request.response) {
                    resolve(request.response.company_roles);
                }
            }, function() {
                reject(request.response.message);
            });
        }.bind(this));
    }

    _filterAccountListByTerm(term) {
        this._accountTerm = term;
        this.set('_accountList', []);

        this._getAccountsByTerm().then(function(accounts) {
            accounts.forEach(function(elem, index) {
                this.push('_accountList', {
                    value: elem.account.self,
                    text: elem.account.display_name
                });
            }.bind(this));
        }.bind(this));
    }

    exportToCSV() {
        this.set('_logListForExport', []);
        const request = document.createElement('iron-request'),
            options = {
                url: this.auditLogApi + '/export',
                method: 'POST',
                handleAs: 'text',
                body: {
                    "from": this._filterFromDate,
                    "to": this._filterToDate,
                    "event": this._filterEventType,
                    "account": this._filterAccount
                },
                headers: this._headers
            };
        request.send(options).then(function(response) {
            if (response.response) {
                const responseObject = JSON.parse(response.response);
                const logs = responseObject.logs;
                logs.forEach(function(log, i) {
                    const record = this._formatLogItem(logs[i]),
                        exportRecord = [
                            this._formatDate(record.date),
                            record.event_type.text,
                            record.account.name + " - " + record.account.email,
                            record.role.name,
                            record.event,
                            record.application,
                            record.ip_address
                        ];
                    this.push('_logListForExport', exportRecord);
                }.bind(this));

                this._setCSVReportHeader();
                this._printCSV();
                this.dispatchEvent(new CustomEvent('export-company-log-finished', { bubbles: true, composed: true }));
            }
        }.bind(this));
    }

    _formatDate(date) {
        const dateString = new Date(date).toString();
        return dateString.split('GMT')[0];
    }

    _setCSVReportHeader () {
        const header = ['Date', 'Event type', 'Account', 'Role', 'Event', 'Application', 'IP Address'];
        this._logListForExport.unshift(header);
    }

    _printCSV() {
        let csvContent = "data:text/csv;charset=utf-8,";
        const logs = this._logListForExport;

        logs.forEach(function(logElement){
            let log = logElement.join(",");
            csvContent += log + "\r\n";
        });

        const encodedUri = encodeURI(csvContent),
            link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "company_log.csv");
        document.body.appendChild(link);

        if (link.click) {
            link.click();
        }
        else if (document.createEvent) {
            const clickEvent = document.createEvent('MouseEvents');

            clickEvent.initEvent('click', true, true);
            link.dispatchEvent(clickEvent);
        }

        document.body.removeChild(link);
    }

    _formatLogItem(log) {
        const logItem = this.$.appscoProvisioningLog.formatLogItem(log);
        logItem.event_type = this._formatEventType(log.type);
        logItem.application = this._formatApplication(log);
        return logItem;
    }

    _onFilterAccount(event) {
        this._filterAccount = event.detail.selected;
        this._filterAccountDisplay = event.detail.item.label;
        this.$.filterAccount.setValue(this._filterAccountDisplay);
        this._filterLog();
        this._hideAccountList();
    }

    _onClearAccountSearch () {
        this.$.filterAccount.reset();
        this.$.suggestedAccounts.selected = 0;
        this._filterAccount = '';
        this._filterLog();
    }

    _onFilterAccountKeyup() {
        this._showAccountList();
    }

    _showAccountList () {
        this.$.suggestedAccounts.hidden = false;
    }

    _hideAccountList() {
        this.$.suggestedAccounts.hidden = true;
    }

    reloadLog() {
        this.$.appscoProvisioningLog.reloadLog();
    }

    _filterLog() {
        this.$.appscoProvisioningLog.filter(this._filterEventType, this._filterFromDate, this._filterToDate, this._filterAccount, this._filterIntegrationType);
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    _onExportAuditLogAction() {
        this._showProgressBar();
        this.exportToCSV();
    }

    _onFilterIntegrationSearch(event) {
        this._filterIntegrationType = event.detail.term;
        this._filterLog();
    }

    _onClearIntegrationSearch () {
        this._filterIntegrationType = '';
        this._filterLog();
    }
}
window.customElements.define(AppscoProvisioningLogPage.is, AppscoProvisioningLogPage);
