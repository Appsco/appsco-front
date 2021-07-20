import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/neon-animation/animations/transform-animation.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-icon-item.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';
import './appsco-application-item.js';
import { AppscoDragHTMLElementBehavior } from '../components/appsco-drag-html-element-behavior.js';
import '../components/appsco-list-styles.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DisableUpgradeMixin } from "@polymer/polymer/lib/mixins/disable-upgrade-mixin";

class AppscoApplications extends mixinBehaviors([
    AppscoDragHTMLElementBehavior,
    Appsco.HeadersMixin
], DisableUpgradeMixin(PolymerElement)) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host([display-grid]) appsco-application-item {
                width: auto;
                margin: 0 10px 10px 0;
                position: relative;
                @apply --appsco-applications-item;
            }
            *[draggable="true"] {
                -moz-user-select: none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                user-select: none;
                /* Required to make elements draggable in old WebKit */
                -khtml-user-drag: element;
                -webkit-user-drag: element;
                cursor: move;
            }
        </style>

        <div class="list-container">
            <iron-ajax auto="" id="applicationsApiRequest" url="[[ _currentUrl ]]" on-error="_onError" on-response="_onResponse" headers="[[ _headers ]]"></iron-ajax>

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_applicationsEmpty ]]">

                <vaadin-context-menu selector="appsco-application-item">

                    <template>
                        <paper-listbox class="popup-menu-item-list">
                            <paper-icon-item class="popup-menu-item" list-item="[[ target ]]" on-click="_openMoveToDialog">
                                <iron-icon icon="folder" list-item="[[ target ]]" item-icon="" slot="item-icon"></iron-icon>
                                Move to
                            </paper-icon-item>
                        </paper-listbox>
                    </template>

                    <div class="list" company\$="[[ company ]]">
                        <template is="dom-repeat" items="{{ _applications }}" initial-count="20">
                            <appsco-application-item id="appscoApplicationItem_[[ index ]]" class="application-item drag-item" application="{{ item }}" company="[[ company ]]" display-grid\$="[[ displayGrid ]]" on-application="_onApplicationAction" draggable="true" data-drag-item="[[ item ]]"></appsco-application-item>
                        </template>
                    </div>

                </vaadin-context-menu>

            </template>
        </div>

        <template is="dom-if" if="[[ !_applicationsEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button on-tap="_loadMoreApps" id="loadMore">Load More</paper-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-applications'; }

    static get properties() {
        return {
            /**
             * Indicates if user manages company applications or not.
             */
            company: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            applicationsApi: {
                type: String,
                notify: true,
                observer: '_onApplicationsApiChanged'
            },

            currentFolder: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            displayStyle: {
                type: String,
                value: '',
                observer: '_onDisplayStyleChanged'
            },

            displayGrid: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _searchApplicationsApi: {
                type: String
            },

            /**
             * Number of application items to load and present
             */
            size: {
                type: Number,
                value: 10
            },

            loadMore: {
                type: Boolean,
                value: false
            },

            isOnCompany: {
                type: Boolean,
                value: false
            },

            _loadMore: {
                type: Boolean,
                value: false
            },

            _applications: {
                type: Array,
                notify: true
            },

            _allApplications: {
                type: Array
            },

            _searchedApplications: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _applicationsEmpty: {
                type: Boolean,
                value: true
            },

            _message: {
                type: String,
                value: ''
            },

            _currentUrl: {
                type: String,
                notify: true
            },

            _next: {
                type: String
            },

            _totalApplications: {
                type: Number,
                value: 0
            },

            _renderedIndex: {
                type: Number,
                value: -1
            },

            /**
             * Search term.
             */
            _filterTerm: {
                type: String,
                value: ''
            },

            /**
             * Term length to start search
             */
            minSearchTermLength: {
                type: Number,
                value: 2
            },

            _loaders: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _personalDashboardAllowed: {
                type: Boolean,
                value: true,
                computed: '_computePersonalDashboardAllowed(account)'
            },

            /**
             * Search term.
             */
            _filterOrgunit: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _sort: {
                type: Object,
                value: function () {
                    return {};
                }
            },
        };
    }

    static get observers() {
        return [
            '_setSearchApplicationsApi(applicationsApi, _sort)',
            '_applicationsCountChanged(_applications.length, _applicationsEmpty)'
        ];
    }

    ready() {
        super.ready();

        beforeNextRender(this, function() {
            if (this.applicationsApi && this.applicationsApi !== '' &&
                (this._personalDashboardAllowed || this.isOnCompany == true)) {
                this._currentUrl = this._computeListApi(this.applicationsApi, this.size, this._sort);
            }
        });
    }

    initializeResourcesDragBehavior() {
        setTimeout(function() {
            this.initializeDragBehavior();
        }.bind(this), 500);
    }

    setDisplayStyle(displayStyle) {
        this.set('displayStyle', displayStyle);
    }

    setSort(sort) {
        for (let key in sort) {
            if (sort[key] !== this._sort[key]) {
                this.set('_sort', sort);
                this._loadApplications();
                break;
            }
        }
    }

    _computePersonalDashboardAllowed(account) {
        return account && account.native_company
            ? account.native_company.personal_dashboards_allowed
            : true;
    }

    _setSearchApplicationsApi(api, sort) {
        this._searchApplicationsApi = this._computeSearchListApi(api, sort);
    }

    _onDisplayStyleChanged(newValue) {
        this.displayGrid = ('grid' === newValue);
    }

    _onApplicationsApiChanged(api) {
        if (!api) {
            return;
        }
        this._clearApplications();
        this._loadApplications();
    }

    _loadApplications() {
        if (this._personalDashboardAllowed || this.isOnCompany == true) {
            this._clearApplications();

            this.shadowRoot.getElementById('paperProgress').hidden = false;
            this._loadMore = false;

            this._currentUrl = this._computeListApi(this.applicationsApi, this.size, this._sort);
            this.dispatchEvent(new CustomEvent('show-page-progress-bar', { bubbles: true, composed: true }));
        }
    }

    _loadMoreApps () {
        if (this._personalDashboardAllowed || this.isOnCompany == true) {
            this.shadowRoot.getElementById('loadMoreProgress').hidden = false;
            this._currentUrl = this._next;
        }
    }

    _onError() {
        this._message = 'We couldn\'t load applications at the moment. Please try again in a minute.';
        this._handleEmptyLoad();
    }

    _handleEmptyLoad() {
        this._applicationsEmpty = true;
        this.dispatchEvent(new CustomEvent('empty-load', { bubbles: true, composed: true }));
        this._hideProgressBar();
    }

    _clearApplications() {
        this._clearLoaders();
        this.set('_allApplications', []);
        this.set('_applications', []);
    }

    _clearLoaders() {
        for (let idx in this._loaders) {
            clearTimeout(this._loaders[idx]);
        }
        this.set('_loaders', []);
    }

    _onResponse(e) {
        if (!e.detail.response) {
            return false;
        }

        let response = e.detail.response,
            icons = response.icons ? response.icons : response.applications,
            meta = response.meta;

        this._loadMore = this._applications.length + icons.length < meta.total;
        this._totalApplications = meta.total;
        this._next = this._computeNextPageListApi(meta.next, this.size, this._sort);
        if (meta.total === 0) {
            this._message = 'There are no applications';
            this._handleEmptyLoad();
            return;
        }

        this._applicationsEmpty = false;
        this._message = '';

        if (meta.page.toString() === '1') {
            this.set('_allApplications', icons);
            this.set('_applications', icons);
        } else {
            this.push('_allApplications', ...icons);
            this.push('_applications', ...icons);
        }

        this.dispatchEvent(new CustomEvent('loaded', {
            bubbles: true,
            composed: true,
            detail: {
                applications: e.detail.response.icons
            }
        }));

        this._hideLoadMoreProgressBar();
        this._hideProgressBar();

        if (this._filterOrgunit.selected) {
            this._filterByOrgunit();
        }
    }

    _computeListApi(listApi, size, sort) {
        return (listApi && size) ?
            ((listApi + '?page=1&extended=1&limit=' + size) +
                ((sort && sort.orderBy && 'undefined' !== typeof sort.ascending) ?
                    ('&order_by=' + sort.orderBy + '&ascending=' + (sort.ascending ? 1 : 0)) :
                    '')) :
            null;
    }

    _computeNextPageListApi(nextPageApi, size, sort) {
        return (nextPageApi && size) ?
            ((nextPageApi + '&limit=' + size) +
                ((sort && sort.orderBy && 'undefined' !== typeof sort.ascending) ?
                    ('&order_by=' + sort.orderBy + '&ascending=' + (sort.ascending ? 1 : 0)) :
                    '')) :
            null;
    }

    _computeSearchListApi(listApi, sort) {
        return listApi ?
            ((listApi + '?page=1&limit=100&extended=1') +
                ((sort && sort.orderBy && 'undefined' !== typeof sort.ascending) ?
                    ('&order_by=' + sort.orderBy + '&ascending=' + (sort.ascending ? 1 : 0)) :
                    '') +
                '&term=') :
            null;
    }

    _onApplicationAction(event) {
        const _applications = JSON.parse(JSON.stringify(this._applications)),
            _length = _applications.length,
            allApplications = JSON.parse(JSON.stringify(this._allApplications)),
            allLength = allApplications.length,
            selectedApplication = event.detail.application;

        for (let j = 0; j < _length; j++) {
            if (selectedApplication.self === _applications[j].self) {
                _applications[j].selected = selectedApplication.selected;
                break;
            }
        }

        for (let k = 0; k < allLength; k++) {
            if (selectedApplication.self === allApplications[k].self) {
                allApplications[k].selected = selectedApplication.selected;
                break;
            }
        }

        this.set('_applications', _applications);
        this.set('_allApplications', allApplications);
    }

    getFirstSelectedApplication() {
        const _applications = JSON.parse(JSON.stringify(this._applications)),
            _length = _applications.length;

        for (let j = 0; j < _length; j++) {
            if (_applications[j].selected) {
                return _applications[j];
            }
        }

        return false;
    }

    getSelectedApplications() {
        const allApplications = JSON.parse(JSON.stringify(this._allApplications)),
            allLength = allApplications.length,
            selectedApplications = [];

        for (let i = 0; i < allLength; i++) {
            if (allApplications[i].selected) {
                selectedApplications.push(allApplications[i]);
            }
        }

        return selectedApplications;
    }

    addApplications(applications) {
        const length = applications.length,
            currentApplications = JSON.parse(JSON.stringify(this._applications)) || [],
            allApplications = JSON.parse(JSON.stringify(this._allApplications)),
            allLength = allApplications.length;

        this._applicationsEmpty = false;
        this._message = '';
        this._renderedIndex = length - 1;

        for (let i = 0; i < length; i++) {
            const application = applications[i];

            if (0 === allLength) {
                if (this.company) {
                    application.selected = false;
                }

                currentApplications.push(application);
                allApplications.push(application);
                this._totalApplications++;
            }
            else {
                for (let j = 0; j < allLength; j++) {
                    if (allApplications[j].self === application.self) {
                        break;
                    }
                    else if (j === allLength - 1) {
                        if (this.company) {
                            application.selected = false;
                        }

                        currentApplications.unshift(application);
                        allApplications.unshift(application);

                        this._totalApplications++;
                    }
                }
            }
        }
        this.set('_applications', currentApplications);
        this.set('_allApplications', allApplications);
    }

    modifyApplications(applications) {
        const _applications = JSON.parse(JSON.stringify(this._applications)),
            _length = _applications.length,
            allApplications = JSON.parse(JSON.stringify(this._allApplications)),
            allLength = allApplications.length,
            lengthModify = applications.length;

        for (let i = 0; i < lengthModify; i++) {
            const application = applications[i];

            for (let j = 0; j < _length; j++) {
                if (application.self === _applications[j].self) {
                    _applications[j] = application;
                    break;
                }
            }

            for (let k = 0; k < allLength; k++) {
                if (application.self === allApplications[k].self) {
                    application.selected = allApplications[k].selected;
                    allApplications[k] = application;
                    break;
                }
            }
        }

        this.set('_applications', _applications);
        this.set('_allApplications', allApplications);
    }

    reloadApplications() {
        this.set('_currentUrl', null);
        this._loadApplications();
    }

    removeApplications(applications) {
        const _applications = JSON.parse(JSON.stringify(this._applications)),
            _length = _applications.length,
            allApplications = JSON.parse(JSON.stringify(this._allApplications)),
            allLength = allApplications.length,
            lengthModify = applications.length;

        for (let i = 0; i < lengthModify; i++) {
            const application = applications[i];

            for (let j = 0; j < _length; j++) {
                if (application.self === _applications[j].self) {
                    _applications.splice(j, 1);
                    j--;
                    break;
                }
            }

            for (let k = 0; k < allLength; k++) {
                if (application.self === allApplications[k].self) {
                    allApplications.splice(k, 1);
                    k--;
                    break;
                }
            }

            this._totalApplications--;
        }

        this.set('_applications', _applications);
        this.set('_allApplications', allApplications);

        this.dispatchEvent(new CustomEvent('applications-removed', {
            bubbles: true,
            composed: true,
            detail: {
                applications: applications
            }
        }));

        if (0 === this._applications.length) {
            this._message = 'You have removed all applications. Please add new ones.';
            this._handleEmptyLoad();
        }
    }

    getFirstApplication() {
        return (this._applications.length > 0) ? this._applications[0] : {};
    }

    getAllApplications() {
        return this._applications;
    }

    selectAllApplications(select) {
        const allApplications = JSON.parse(JSON.stringify(this._allApplications)),
            allLength = allApplications.length;

        for (let j = 0; j < allLength; j++) {
            const application = allApplications[j];

            application.selected = select;

            allApplications[j] = {};
            allApplications[j] = application;
        }
    }

    setOrgunit(orgunit) {
        const _applications = JSON.parse(JSON.stringify(this._applications)),
            _length = _applications.length,
            allApplications = JSON.parse(JSON.stringify(this._allApplications)),
            allLength = allApplications.length;

        for (let i = 0; i < _length; i++) {
            let application = _applications[i],
                orgunits = application.org_units,
                length = orgunits.length;

            for (let j = 0; j < length; j++) {

                if (orgunit.alias === orgunits[j].alias) {
                    _applications[i].org_units[j].name = orgunit.name;
                    break;
                }
            }
        }

        for (let j = 0; j < allLength; j++) {
            let application = allApplications[j],
                orgunits = application.org_units,
                length = orgunits.length;

            for (let k = 0; k < length; k++) {
                if (orgunit.alias === orgunits[k].alias) {
                    allApplications[j].org_units[k].name = orgunit.name;
                    break;
                }
            }
        }

        this.set('_applications', _applications);
        this.set('_allApplications', allApplications);
    }

    _setSearchApplicationsResult() {
        this._applicationsEmpty = (0 === this._searchedApplications.length);

        if (this._applicationsEmpty) {
            this._message = 'There are no applications with asked term.';
        }
        else {
            this.set('_applications', this._searchedApplications);
            this._hideLoadMoreAction();
            this._message = '';
        }
    }

    filterByStatus(api, status) {
        this._getApplications(this._computeListApi(api, 100, this._sort)).then(function(applications) {
            const applicationsLength = applications.length;

            this._clearApplications();
            this._hideLoadMoreAction();
            this._totalApplications = applicationsLength;
            this._setSearchApplicationsApi(api, this._sort);

            if (0 === applicationsLength) {
                this._message = 'There are no applications.';
                this._handleEmptyLoad();
                return false;
            }

            this.set('_allApplications', applications);

            if (this._filterTerm.length >= this.minSearchTermLength) {
                this._filterByTerm();
                return false;
            }

            this._applicationsEmpty = false;
            this._message = '';

            applications.forEach(function(el, index) {
                this._loaders.push(setTimeout( function() {
                    if (this.company) {
                        el.selected = false;
                    }

                    this.push('_applications', el);

                    if (index === applicationsLength - 1) {
                        this.dispatchEvent(new CustomEvent('loaded', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                applications: applications
                            }
                        }));
                    }
                }.bind(this), (index + 1) * 30 ));
            }.bind(this));
            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
        }.bind(this));
    }

    filterByTerm(term) {
        this._filterTerm = term;
        this._filterByTerm();
    }

    filterByOrgunit(orgunitData) {
        this._filterOrgunit = orgunitData;
        this._filterByOrgunit();
    }

    _getApplications(api) {
        return new Promise(function(resolve, reject) {
            const request = document.createElement('iron-request'),
                options = {
                    url: api,
                    method: 'GET',
                    handleAs: 'json',
                    headers: this._headers
                };

            request.send(options).then(function() {
                if (request.response) {
                    resolve(this.company ? request.response.applications : request.response.icons);
                }

            }.bind(this), function() {
                reject(request.response.message);
            });
        }.bind(this));
    }

    _filterByTerm() {
        const term = this._filterTerm,
            length = this._allApplications.length,
            filterOrgunit = this._filterOrgunit;

        if (term.length < this.minSearchTermLength) {
            this.set('_searchedApplications', []);

            if (filterOrgunit.selected) {
                this._filterByOrgunit();
            }
            else {
                this._message = '';
                this._applicationsEmpty = false;
                this.set('_applications', JSON.parse(JSON.stringify(this._allApplications)));
                this._setLoadMoreAction();
            }
            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
            return false;
        }

        this._showProgressBar();
        this._hideLoadMoreAction();

        this._getApplications(this._searchApplicationsApi + term).then(function(applications) {
            const applicationsLength = applications.length;

            this.set('_searchedApplications', applications);
            this._setSearchApplicationsResult();

            if (this._applicationsEmpty) {
                this.set('_searchedApplications', []);
                this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
                return false;
            }

            if (filterOrgunit.selected) {
                this._filterByOrgunit();
            }
            else {
                this.set('_applications', []);

                applications.forEach(function(elem, index) {
                    for (let i = 0; i < length; i++) {
                        const application = this._allApplications[i];

                        if (elem.self === application.self) {
                            this.push('_applications', application);
                            break;
                        }
                        else {
                            if (i === length - 1) {
                                this.push('_applications', elem);
                            }
                        }
                    }

                    if (index === applicationsLength - 1) {
                        this._hideProgressBar();
                        this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
                    }
                }.bind(this));
            }
        }.bind(this));
    }

    _filterByOrgunit() {
        const filterOrgunit = this._filterOrgunit,
            orgunit = filterOrgunit.orgUnit,
            selected = filterOrgunit.selected,
            filterTerm = this._filterTerm,
            allLength = this._allApplications.length;

        this._showProgressBar();
        this._applicationsEmpty = false;
        this._message = '';

        if (!selected) {
            this._setLoadMoreAction();
            !filterTerm.length ?
                this.set('_applications', JSON.parse(JSON.stringify(this._allApplications))) :
                this._setSearchApplicationsResult();
            this.set('_filterOrgunit', {});
        }
        else {
            this._hideLoadMoreAction();
            this.set('_applications', []);

            if (this._searchedApplications.length > 0) {
                let searchedApplications = this._searchedApplications,
                    searchedApplicationsLength = searchedApplications.length,
                    responseApplications = [],
                    responseApplicationsLength;

                for (let i = 0; i < searchedApplicationsLength; i++) {
                    let application = searchedApplications[i],
                        orgunits = application.org_units,
                        orgunitsLength = orgunits.length;

                    for (let j = 0; j < allLength; j++) {
                        const app = this._allApplications[j];

                        if (application.self === app.self) {
                            responseApplications.push(app);
                            break;
                        }
                        else {
                            if (j === allLength - 1) {
                                responseApplications.push(application);
                            }
                        }
                    }
                }

                responseApplicationsLength = responseApplications.length;

                for (let k = 0; k < responseApplicationsLength; k++) {
                    let application = responseApplications[k],
                        orgunits = application.org_units,
                        orgunitsLength = orgunits.length;

                    for (let j = 0; j < orgunitsLength; j++) {
                        if (orgunits[j].alias === orgunit.alias) {
                            this.push('_applications', application);
                            break;
                        }
                    }
                    if (k === responseApplicationsLength -1) {
                        this._hideProgressBar();
                    }
                }
            }
            else {
                for (let i = 0; i < allLength; i++) {
                    let application = this._allApplications[i],
                        orgunits = application.org_units,
                        orgunitsLength = orgunits.length;

                    for (let j = 0; j < orgunitsLength; j++) {
                        if (orgunits[j].alias === orgunit.alias) {
                            this.push('_applications', application);
                            break;
                        }
                    }

                    if (i === allLength -1) {
                        this._hideProgressBar();
                    }
                }
            }
            if (this._applications.length === 0) {
                this._message = 'There are no applications within ' + orgunit.name +' organization unit.';
                this._handleEmptyLoad();
            }
        }
    }

    loadResourcesForGroup(group) {
        this._showProgressBar();
        this._loadMore = false;
        this._clearApplications();
        this.set('_searchedApplications', []);

        this._currentUrl = this._computeListApi(group.meta.applications, this.size, this._sort);
    }

    _setLoadMoreAction() {
        this._loadMore = this._allApplications.length < this._totalApplications;
    }

    _hideLoadMoreAction() {
        this._loadMore = false;
    }

    _showProgressBar() {
        this.shadowRoot.getElementById('paperProgress').hidden = false;
    }

    _hideProgressBar() {
        setTimeout(function() {
            this.shadowRoot.getElementById('paperProgress').hidden = true;
        }.bind(this), 300);
    }

    _showLoadMoreProgressBar() {
        this.shadowRoot.getElementById('loadMoreProgress').hidden = false;
    }

    _hideLoadMoreProgressBar() {
        setTimeout(function() {
            this.shadowRoot.getElementById('loadMoreProgress').hidden = true;
        }.bind(this), 300);
    }

    _openMoveToDialog(event) {
        const menuItem = event.target,
            applicationItem = menuItem.listItem;

        if (applicationItem && applicationItem.application) {
            this.dispatchEvent(new CustomEvent('open-move-to-folder-dialog', {
                bubbles: true,
                composed: true,
                detail: {
                    applicationIcon: applicationItem.application,
                    currentFolder: this.currentFolder
                }
            }));
        }
    }

    _applicationsCountChanged(count, applicationsEmpty) {
        const applicationsLength = this._applications && this._applications.length ? this._applications.length : 0;
        this.dispatchEvent(new CustomEvent('applications-count-changed', {
            bubbles: true,
            composed: true,
            detail: {
                count: this._applicationsEmpty ? 0 : applicationsLength
            }
        }));
    }

    initialize() {
        this._applicationsEmpty = (0 === this._totalApplications);

        if (this._applicationsEmpty) {
            this._message = 'There are no applications.';
        }
    }

    reset() {
        this._message = '';
        this._applicationsEmpty = false;
        this.set('_applications', JSON.parse(JSON.stringify(this._allApplications)));
        this.set('_searchedApplications', []);
        this._filterTerm = '';
        this._filterOrgunit = {};

        if (this.company) {
            this.selectAllApplications(false);
        }
    }
}
window.customElements.define(AppscoApplications.is, AppscoApplications);
