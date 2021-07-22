import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '../components/appsco-search.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import * as gestures from '@polymer/polymer/lib/utils/gestures.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoPolicyReportPageFilters extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --layout-vertical;
                @apply --appsco-policy-report-page-filters;

                --paper-dropdown-menu: {
                    width: 100%;
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
            .filter {
                margin-bottom: 10px;
                position: relative;
                box-sizing: border-box;
            }
            .suggested-policies {
                @apply --shadow-elevation-2dp;
                width: 100%;
                min-height: 100px;
                max-height: calc(100vh - 2*64px - 30px - 10px - 3*54px);
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
            .suggested-policies[hidden] {
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
            :host paper-item:hover {
                @apply --paper-item-hover;
            }
            vaadin-date-picker {
                --paper-input-container-label: {
                    font-size: 14px;
                };
                --paper-input-container-input: {
                    font-size: 14px;
                };
            }
        </style>

        <iron-ajax auto="" method="GET" url="[[ _policiesApi ]]" headers="[[ _headers ]]" handle-as="json" on-response="_onPoliciesResponse"></iron-ajax>

        <div class="filter">
            <appsco-search id="appscoSearch" label="Search accounts" on-search="_onSearchRoles" on-search-clear="_onSearchRolesClear"></appsco-search>
        </div>

        <div id="filterPolicy" class="filter">
            <appsco-search id="appscoSearchPolicy" label="Filter by policy" float-label="" on-focus="_onFilterPolicyFocus" on-keyup="_onFilterPolicyKeyup" on-search="_onFilterPolicySearch" on-search-clear="_onClearPolicySearch"></appsco-search>

            <paper-listbox id="filterListPolicies" class="dropdown-content suggested-policies" on-iron-activate="_onFilterByPolicyAction" hidden="">
                <template is="dom-repeat" items="{{ _policiesListDisplay }}">
                    <paper-item value\$="[[ item.policy ]]" name\$="[[ item.name ]]">
                        [[ _format(item.name) ]]
                    </paper-item>
                </template>
            </paper-listbox>
        </div>

        <div class="filter">
            <vaadin-date-picker id="filterDateFrom" label="Date from" on-value-changed="_onFilterDateFrom"></vaadin-date-picker>
        </div>

        <div class="filter">
            <vaadin-date-picker id="filterDateTo" label="Date to" on-value-changed="_onFilterDateTo"></vaadin-date-picker>
        </div>
`;
    }

    static get is() { return 'appsco-policy-report-page-filters'; }

    static get properties() {
        return {
            policiesApi: {
                type: String
            },

            _policiesApi: {
                type: String,
                computed: '_computePoliciesApi(policiesApi)'
            },

            _searchPoliciesApi: {
                type: String,
                computed: '_computeSearchPoliciesApi(_policiesApi, _policyTerm)'
            },

            _policiesList: {
                type: Array,
                value: function () {
                    return [{
                        policy: 'all',
                        name: 'All policies'
                    }];
                }
            },

            _policiesListDisplay: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _policyTerm: {
                type: String,
                value: ''
            },

            _filterTerm: {
                type: String,
                value: ''
            },

            _filterPolicy: {
                type: Object,
                value: function () {
                    return {};
                }
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

            _attached: {
                type: Boolean,
                value: false
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this._attached = true;
    }

    ready() {
        super.ready();

        beforeNextRender(this, function() {
            this._setupDatePicker();
        });

        afterNextRender(this, function() {
            gestures.add(document, 'tap', this._handleDocumentClick.bind(this));
        });
    }

    reset() {
        this.$.appscoSearch.reset();
        this.$.filterListPolicies.selected = 0;
        this._hidePolicyList();
        this._filterFromDate = this._defaultFromDateValue;
        this.$.filterDateFrom.value = this._defaultFromDateValue;
        this._filterToDate = this._defaultToDateValue;
        this.$.filterDateTo.value = this._defaultToDateValue;
    }

    getFilters() {
        return {
            term: this._filterTerm,
            policy: this._filterPolicy,
            dateFrom: this._filterFromDate,
            dateTo: this._filterToDate
        };
    }

    _computePoliciesApi(policiesApi) {
        return (policiesApi ? (policiesApi + '?page=1&extended=1&limit=1000') : null);
    }

    _computeSearchPoliciesApi(policiesApi, term) {
        return (policiesApi && term) ? (policiesApi + '&term=' + term) : null;
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

        if (!this._isInPath(path, this.$.filterPolicy)) {
            this._hidePolicyList();
        }
    }

    _filterPoliciesReport() {
        this.dispatchEvent(new CustomEvent('filter-policies-report', {
            bubbles: true,
            composed: true,
            detail: {
                filters: this.getFilters()
            }
        }));
    }

    _filterRolesByTermAction(term) {
        this._filterTerm = term;
        this._filterPoliciesReport();
    }

    _onSearchRoles(event) {
        this._filterRolesByTermAction(event.detail.term);
    }

    _onSearchRolesClear() {
        this._filterRolesByTermAction('');
    }

    _onPoliciesResponse(event) {
        const response = event.detail.response;

        if (response && response.policies) {
            response.policies.forEach(function(item) {
                this.push('_policiesList', item);
            }.bind(this));

            this.set('_policiesListDisplay', this._policiesList);
            this._setDefaultPolicy();
        }
    }

    _filterPolicyListByTerm(term) {
        const termLength = term.length,
            policies = this._policiesList,
            length = policies.length;

        this.set('_policiesListDisplay', []);

        if (3 > termLength) {
            term = '';
        }

        for (let i = 0; i < length; i++) {
            const policy = policies[i];

            if (policy && 0 <= policy.name.toLowerCase().indexOf(term.toLowerCase())) {
                this.push('_policiesListDisplay', policy);
            }
        }

        if (0 === this._policiesListDisplay.length && 3 <= termLength) {
            this.push('_policiesListDisplay', {
                value: 'no-result',
                name: 'There are no policies with asked term.'
            });
        }
    }

    _setDefaultPolicy() {
        this.$.appscoSearchPolicy.setValue(this._policiesList[0].name);
        this.$.filterListPolicies.selected = 0;
    }

    _showPolicyList() {
        this.$.filterListPolicies.hidden = false;
    }

    _hidePolicyList() {
        const filter = this.$.filterListPolicies,
            search = this.$.appscoSearchPolicy;

        if (0 === search.getValue().length && filter.selectedItem) {
            search.setValue(filter.selectedItem.name);
        }

        this.$.filterListPolicies.hidden = true;
    }

    _onFilterPolicyFocus() {
        this._showPolicyList();
    }

    _onFilterPolicyKeyup(event) {
        if (40 === event.keyCode) {
            event.target.blur();
            this._selectFirstPolicy();
        }
    }

    _onFilterPolicySearch(event) {
        this._filterPolicyListByTerm(event.detail.term);
    }

    _onClearPolicySearch(event) {
        this._filterPolicyListByTerm('');
    }

    _selectFirstPolicy() {
        const policyFilter = this.$.filterListPolicies;

        if (!policyFilter.selectedItem) {
            policyFilter.selected = this._policiesListDisplay[0].value;
        }

        policyFilter.selectedItem.focus();
    }

    _onFilterByPolicyAction(event) {
        const alias = event.detail.item.getAttribute('value'),
            policies = this._policiesListDisplay,
            length = policies.length;

        let selectedPolicy;

        if ('all' === alias) {
            selectedPolicy = {
                alias: 'all',
                name: event.detail.item.getAttribute('name')
            };
        }
        else {
            for (let i = 0; i < length; i++) {
                if (alias === policies[i].policy) {
                    selectedPolicy = policies[i];
                    break;
                }
            }

            selectedPolicy.activated = true;
        }

        this.set('_filterPolicy', selectedPolicy);
        this.$.appscoSearchPolicy.setValue(this._format(selectedPolicy.name));
        this._hidePolicyList();
        this._filterPoliciesReport();
    }

    _format(value) {
        let result = '';

        if (value) {
            result = value;

            if (value.length > 40) {
                result = value.substring(0, 40) + '...';
            }
        }

        return result;
    }

    _setupDatePicker() {
        this._setValidDates();
    }

    _setValidDates() {
        let date = new Date(),
            day = date.getDate(),
            month = date.getMonth(),
            year = date.getFullYear();

        const filterDateFromComponent = this.$.filterDateFrom;

        if (10 > day) {
            day = '0' + day;
        }

        if (0 === month) {
            month = '12';
            year = year - 1;
        }
        else if (10 > month) {
            month = '0' + month;
        }

        filterDateFromComponent.max = year + '-' + month + '-' + day;
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
        } else {
            this._setValidToDate(fromDate);
            fromDate += ' 00:00:00';
        }

        this._filterFromDate = fromDate;

        if (this._attached) {
            this._filterPoliciesReport();
        }
    }

    _onFilterDateTo(event) {
        let toDate = event.detail.value,
            filterDateToComponent = this.$.filterDateTo;

        if (!toDate) {
            toDate = this._defaultToDateValue;
            filterDateToComponent.value = toDate;
        } else {
            toDate += ' 23:59:59';
        }

        this._filterToDate = toDate;

        if (this._attached) {
            this._filterPoliciesReport();
        }
    }
}
window.customElements.define(AppscoPolicyReportPageFilters.is, AppscoPolicyReportPageFilters);
