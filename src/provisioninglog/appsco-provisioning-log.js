import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import '../components/components/appsco-date-format.js';
import '../components/components/appsco-list-item.js';
import '../components/account/appsco-account-image.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoProvisioningLog extends mixinBehaviors([
    AppLocalizeBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                font-size: 14px;
                color: var(--primary-text-color);
                @apply --appsco-provisioning-log;
            }
            .provisioning-log {
                width: 100%;
                padding-top: 10px;
                overflow: hidden;
                @apply --provisioning-log-list;
            }
            .log-record {
                width: 100%;
                margin-bottom: 10px;
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            .log-header {
                margin-bottom: 4px;
                border-bottom: 1px solid var(--divider-color);
            }
            .log-record > * {
                padding: 6px 10px;
            }
            .log-header > * {
                padding: 10px;
            }
            .log-record .integration-source {
                width: 20%;
                overflow: hidden;
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            .log-record .integration-status {
                width: 10%;
                overflow: hidden;
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            
            .log-record .account-info {
                width: 20%;
                overflow: hidden;
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            .account-name {
                display: block;
                font-family: 'Roboto', 'Noto', sans-serif;
                font-size: 16px;
                -webkit-font-smoothing: antialiased;
                font-weight: 400;
            }
            .account-email {
                display: block;
                font-size: 12px;
            }
            .role-name, .role-companies {
                display: block;
            }
            .log-record .role {
                width: 20%;
            }
            .log-record .event {
                width: 30%;
                @apply --text-wrap-break;
            }
            .log-record .ip-address {
                width: 10%;
            }
            .log-record .date {
                width: 20%;
            }
            appsco-account-image {
                --account-image: {
                    width: 32px;
                    height: 32px;
                    margin-right: 5px;
                };
            }
            :host .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
            :host .log-progress-bar {
                min-width: 100px;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --appsco-provisioning-log-progress;
            }
            :host .load-more-box {
                width: 120px;
                margin-top: 10px;
                margin-left: auto;
                margin-right: auto;
                padding-top: 4px;
                position: relative;
            }
            :host .load-more-box paper-progress {
                width: 100%;
                position: absolute;
                top: 4px;
                left: 0;
            }
            :host paper-button {
                display: block;
                margin: 10px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
            :host .account-info div {
                overflow: hidden;
                width: 80%;
            }
            :host .account-info div span {
                @apply --text-wrap-break;
            }
        </style>

        <iron-ajax id="ironAjaxLog" url="[[ _auditLogApi ]]" method="POST" headers="[[ _headers ]]" handle-as="json" on-error="_onLogError" on-response="_onLogResponse">
        </iron-ajax>

        <iron-ajax auto="" url="[[ _timezoneListUrl ]]" handle-as="json" on-response="_onTimezoneListResponse">
        </iron-ajax>

        <iron-ajax auto="" url="[[ _countryListUrl ]]" handle-as="json" on-response="_onCountryListResponse">
        </iron-ajax>

        <div class="provisioning-log">

            <paper-progress id="progress" class="log-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ !_logEmpty ]]">

                <template is="dom-if" if="[[ preview ]]">
                    <template is="dom-repeat" items="[[ _logList ]]">
                        <appsco-list-item item="[[ _mapToListItem(item) ]]"></appsco-list-item>
                    </template>
                </template>

                <template is="dom-if" if="[[ !preview ]]">
                    <div class="log-record log-header">
                        <div class="integration-source">Source</div>
                        <div class="account-info">Account</div>
                        <div class="role">Role</div>
                        <div class="event">Event</div>
                        <div class="ip-address">IP Address</div>
                        <div class="date">Date</div>
                        <div class="integration-status">Status</div>
                    </div>

                    <template is="dom-repeat" items="[[ _logList ]]">
                        <div class="log-record">
                            <div class="integration-source">[[ item.integrationName ]]</div>
                            <div class="account-info">
                                <appsco-account-image account="[[ item.account ]]"></appsco-account-image>
                                <div>
                                    <span class="account-name">[[ item.account.name ]]</span>
                                    <span class="account-email">[[ item.account.email ]]</span>
                                </div>
                            </div>
                            <div class="role">
                                <span class="role-name">[[ item.role.name ]]</span>
                                <span class="role-companies">[[ item.role.companies ]]</span>
                            </div>
                            <div class="event">[[ item.event ]]</div>
                            <div class="ip-address">[[ item.ip_address ]]</div>
                            <div class="date">
                                <appsco-date-format date="[[ item.date ]]" options="[[ _dateFormat ]]"></appsco-date-format>
                            </div>
                            <div class="integration-status">[[ item.status ]]</div>
                        </div>
                    </template>
                </template>
            </template>
        </div>

        <template is="dom-if" if="[[ _logEmpty ]]">
            <template is="dom-if" if="[[ _message ]]">
                <p class="message">
                    [[ _message ]]
                </p>
            </template>
        </template>

        <template is="dom-if" if="[[ !_logEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button on-tap="_onLoadMoreAction" id="loadMore">Load More</paper-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-provisioning-log'; }

    static get properties() {
        return {
            auditLogApi: {
                type: String
            },

            size: {
                type: Number,
                value: 10
            },

            loadMore: {
                type: Boolean,
                value: false
            },

            preview: {
                type: Boolean,
                value: false
            },

            _isPublicList: {
                type: Array,
                value: function () {
                    return [
                        {
                            name: 'on',
                            value: true
                        },
                        {
                            name: 'off',
                            value: false
                        }
                    ]
                }
            },

            _loadMore: {
                type: Boolean,
                value: false
            },

            _auditLogApi: {
                type: String,
                computed: '_computeAuditLogApi(auditLogApi, size, _headers)',
                observer: '_onAuditLogApiChanged'
            },

            _nextPageAuditLogApi: {
                type: String
            },

            _logList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _wholeLogList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _totalLogItems: {
                type: Number,
                value: 0
            },

            _timezoneListUrl: {
                type: String
            },

            _countryListUrl: {
                type: String
            },

            _timezoneList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _genderList: {
                type: Array,
                value: function () {
                    return [
                        {
                            name: 'Male',
                            value: 'm'
                        },
                        {
                            name: 'Female',
                            value: 'f'
                        }
                    ];
                }
            },

            /**
             * Country list to get name of country from.
             * Country code = account.country.
             *
             * This is loaded from local data/country-list.json.
             */
            _countryList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _logEmpty: {
                type: Boolean,
                value: false
            },

            /**
             * Message to display instead of log.
             */
            _message: {
                type: String
            },

            language: {
                value: 'en',
                type: String
            },

            _dateFormat: {
                type: Object,
                value: function () {
                    return {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }
                }
            },

            _itemPushList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _filterTerm: {
                type: String,
                value: ''
            },

            _placeholder: {
                type: String,
                value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAMAAACZHrEMAAAAqFBMVEUAAAAnNEEnNEEnNEEnNEEnNEE8rPcnNEEnNEEnNUI8rPc8rPc8rPcnNEEnNEEnNEEnNEEnNEE8rPc8rPc8rPc8rPcnNEE8rPcnNEE8rPcnNEH///88rPeTmqAoPlDJzNBdZ3Hx8/WBiI+us7g0gLUuWno1QU1OtPjk5+kxbZg9TFtswfprc3w6oebX2ds3lNO8wMShpqxQWmWu3fye1vszeKfU7f6Nz/toHOtWAAAAGnRSTlMAnyC/EO+fYEDPYO26r4+AcFA9IIAQ388wUFlk1w8AAASsSURBVHjazNbdqqtADAXg+XEYvajam1JWkFYLIiIb2/d/uHPgwPam7kmM7p7vCRbJJBmzXR4r6z2w8N5WMTe/7FrbAqsKW1/N73DxFJAUTtGZg7m6AFtRH5gnix5CPmbmCK4M2CCU+5cnt9jM5vtG8VDx+8VxFmp2n2ZlFXZRZUbtfMFOLmdtWU7Y0SlTlSVgV2F7cbISuys3FscVOEDhzAZ5wCFCbsQiDhONkMWB7BFZ+qmZb/TtNjdTr0ijyNJ3M70xd70wjT5L37S0om16SRp9lqmlH7QTP40+y4MSHsI0+izHp4ncLPo00STkSOqIpUNSYhe7gJSxJZZ2REpw5gdZIWmSvlFFZtaVSBqJbURSaVadkfYktifSzqtNCkgbiG1AWlhr1AlpLxJ4Ie20vUnoSKDD1kZlFzDMJDCD4fKuURU4vkjgCxzVm3UHFhIBi+Pfx+PDWNFNWtxJ5I6F4Eb5T4bxzMLow8hLYz8bxrJGSR9GPlDlp8OUzAupDyO7lxFcI4mM4IqcudYvPeF0O3w+zPcTrsEkP5R8tfmnAN+NBG7gK+RdwpMEnhBwiVnS//QEYuLrq100dyyYn+EAvnEigWkEXzB/XcH3IKEH+K6ywe5IrANbvfwetHOtn24r2zIDiQ0ABJsGfLQB+JYPp/oW6C9CbiKA/+PNIJoKfA2JNeCrjAXfRGIT+KzxECCxHnxeFmYmoRkC3iBB16cOEgYiA4m0SFCFaY6bJXmYvhUVpoeIgUyjKIwijP4kDD0StGFef2g1t50GgSCABrSBPhj7aHDcGgPZkk0lFlr+/880PDhpaumc4pwvONnN7ly35ks6VAAiw0c84FiADHjgPI9ZLvOx/LfjMrxnz6sULsMDZnUPGigJu6VxYHnUVrb/meCpDEiu3GUyTTsJb4ZAwHkGCbm7TAFKFXeZEhRx7jKgvHWXWYPCHzXTvipOBloi7k97A5pF7jIv2kZDfDrIrECD0T1QPoHWq7tMAZrSMJ85VJRc2/WId4fkag0GGbB44r/eBox44ACB/3o5GH6xb4a/7Yf71m1D0xoK7l3bhApQ8IFpaI6dSHw1EEW6o1lo9QhHyaHtZCJZZJJMdK36GBfBcqvJROxvu/RRROw+OVg/aGo5Iw7zW69DlDPqhiytlLOHspdLUn/62+TUJ7lkP3s8pXFlJdRyjfgrpCJjlGvUYf5dKyVVUaM0Dj+MKakH1Cln15xUhcN1MsMCmKo46+S3V+O+m7VjFYdhIAigU22x2nCglTE+llRxkYBJlf//tbsikKQ4CVtand4XDCPBNnPdzMV2/f70VRwNrpu52dbP0WBhTnl+mKvHubh7PWVqcSvnlJng+tfyKud1If98qNvdurjfMo/0vN6rdbP+XuvsoP1iHV2yg3ZosI6CIitaRxEFbN0wisg6IWCYNAQMk4aAYdIQMEwaAoZJQ8AwaQg7sblh7BaDuQgRB+hsDmbFIVOy5tKEo5ZgTYUFFSaxhuRZywDlhAXVpvTvv+WdklUjRStRrIpEtBSpopWI1jQFOyAkhYeJxXYSnuBGeceNmFnhTFmCFQVhRR+Rac40QhzRWeREIvZGhFJNjh/wS1HnPv+ePgAAAABJRU5ErkJggg=='
            }
        };
    }

    static get importMeta() {
        return import.meta;
    }

    ready() {
        super.ready();

        afterNextRender(this, function() {
            this.loadResources(this.resolveUrl('./../auditlog/data/locales.json'));
            this._timezoneListUrl = this.resolveUrl('./../auditlog/data/timezone-list.json');
            this._countryListUrl = this.resolveUrl('./../auditlog/data/country-list.json');
        });
    }

    _computeAuditLogApi(auditLogApi, size, headers) {
        return (auditLogApi && size && headers && headers.Authorization) ? (auditLogApi + '?limit=' + size) : null;
    }

    _setLoadMoreAction() {
        this._loadMore = (this.loadMore && (this._wholeLogList.length < this._totalLogItems));
    }

    _hideLoadMoreAction() {
        this._loadMore = false;
    }

    _showLoadMoreProgressBar() {
        this.shadowRoot.getElementById('loadMoreProgress').hidden = false;
    }

    _hideLoadMoreActionProgressBar() {
        setTimeout(function() {
            this.shadowRoot.getElementById('loadMoreProgress').hidden = true;
        }.bind(this), 300);
    }

    _onAuditLogApiChanged(auditLogApi) {
        if (auditLogApi) {
            this.loadLog();
        }
    }

    _onCountryListResponse(event, ironRequest) {
        this._countryList = ironRequest.response;
    }

    _onTimezoneListResponse(event, ironRequest) {
        ironRequest.response.forEach(function(zone, i) {
            if (zone.utc) {

                zone.utc.forEach(function(utc, index) {
                    const item = {
                        value: utc,
                        text: utc.split('/')[1]
                    };

                    this.push('_timezoneList', item);
                }.bind(this));
            }
        }.bind(this));
    }

    _formatLogAccountUpdateProfile(item) {
        const data = item.data,
            logItem = {};
        let message = '';

        for (const property in data) {
            let propertyValue = data[property],
                propertyName = property.replace('_updated', ''),
                from = propertyValue.from,
                to = propertyValue.to;

            switch (propertyName) {
                case 'timezone':
                    this._timezoneList.forEach(function(zone, index) {
                        if (zone.value === from) {
                            from = zone.text;
                        }

                        if (zone.value === to) {
                            to = zone.text;
                        }
                    });
                    break;

                case 'country':
                    this._countryList.forEach(function(country, index) {
                        if (country.code === from) {
                            from = country.name;
                        }

                        if (country.code === to) {
                            to = country.name;
                        }
                    });
                    break;

                case 'gender':
                    this._genderList.forEach(function(gender, index) {
                        if (gender.value === from) {
                            from = gender.name;
                        }

                        if (gender.value === to) {
                            to = gender.name;
                        }
                    });
                    break;

                case 'is_public':
                    this._isPublicList.forEach(function(is_public, index) {
                        if (is_public.value === to) {
                            to = is_public.name;
                        }
                    });
                    break;

                default:
            }

            if ('is_public' === propertyName) {
                message += this.localize('public_profile_changed', 'newValue', to);
            } else {
                message += ' ' + this.localize(propertyName) + ' ' + this.localize('account_log_profile_changed', 'fromValue', from, 'toValue', to);
            }
        }

        return message;
    }

    _formatLogApplicationUpdated(item) {
        const data = item.data;
        let message = '';

        for (const property in data) {
            const propertyValue = data[property],
                from = propertyValue.from,
                to = propertyValue.to;

            const propertyName = property.replace('_updated', '');
            message += ' ' + this.localize(propertyName) + ' ' + this.localize('application_updated', 'fromValue', from, 'toValue', to);
        }

        return message;
    }

    _formatLogCompanySettingsUpdated(item) {
        const data = item.data;
        let message = '';

        for (const property in data) {
            const propertyValue = data[property],
                from = propertyValue.from,
                to = propertyValue.to;

            const propertyName = property.replace('_updated', '');
            message += ' ' + this.localize(propertyName) + ' ' + this.localize('log_company_settings_updated', 'fromValue', from, 'toValue', to);
        }

        return message === '' ? "Company settings updated with no change" : message;
    }

    _formatLogCompanyRoleAccountUpdated(item) {
        const data = item.data;
        let message = '';

        for (const property in data) {
            let propertyValue = data[property],
                from = propertyValue.from,
                to = propertyValue.to;

            switch (property) {
                case 'timezone':
                    this._timezoneList.forEach(function(zone, index) {
                        if (zone.value === from) {
                            from = zone.text;
                        }

                        if (zone.value === to) {
                            to = zone.text;
                        }
                    });

                    break;
                case 'country':
                    this._countryList.forEach(function(country, index) {
                        if (country.code === from) {
                            from = country.name;
                        }

                        if (country.code === to) {
                            to = country.name;
                        }
                    });
                    break;
                case 'gender':
                    this._genderList.forEach(function(gender, index) {
                        if (gender.value === from) {
                            from = gender.name;
                        }

                        if (gender.value === to) {
                            to = gender.name;
                        }
                    });
                    break;
                default:
            }

            const propertyName = property.replace('_updated', '');

            message += ' ' + this.localize(propertyName) + ' ' + this.localize('company_role_account_updated', 'account', item.affected_account_display_name, 'fromValue', from, 'toValue', to);
        }

        return message;
    }

    /**
     * Maps log as object dependent on log type.
     *
     * @param {Object} item
     * @returns {{ item: object }}
     */
    formatLogItem(item) {
        const logItem = {
            account: {
                picture_url: item.initiatior_image,
                name: item.initiatior_display_name,
                email: item.initiatior_email
            },
            role: {
                name: this._formatLogInitiatorRole(item),
                companies: this._formatLogInitiatorCompanies(item),
            },
            integrationName: (item.data && item.data.integrationName) ? item.data.integrationName : '',
            event: this._formatLogEvent(item),
            ip_address: item.ip,
            date: item.created_at.date
        };

        return logItem;
    }

    _formatLogInitiatorRole (item) {
        let companyRole = '';
        switch (item.initiator_company_role) {
            case 'COMPANY_ROLE_PARTNER_ADMIN':
                companyRole = 'Partner Admin';
                break;
            case 'COMPANY_ROLE_OWNER':
                companyRole = 'Admin';
                break;
            case 'COMPANY_ROLE_ADMIN':
                companyRole = 'Admin';
                break;
            case 'COMPANY_ROLE_EMPLOYEE':
                companyRole = 'Employee';
                break;
        }

        return companyRole;
    }

    _formatLogInitiatorCompanies (item) {
        const initiatorCompanies = item.initiator_company_names.toString();
        return initiatorCompanies ? initiatorCompanies.replace(/,/g, ", ") : '';
    }

    _formatLogEvent(item) {
        let event = '';
        switch (item.type) {
            case 'account_login_attempt':
                event = this.localize('account_login_attempt', 'application', item.data.application.title);
                break;

            case 'contact_login_attempt':
                event = this.localize('contact_login_attempt', 'application', item.data.application.title);
                break;

            case 'account_update_profile':
                event = this._formatLogAccountUpdateProfile(item);
                break;

            case 'account_updated_profile_image':
                event = this.localize('account_log_profile_image_changed');
                break;

            case 'account_changed_password':
                event = this.localize('account_log_password_changed');
                break;

            case 'account_generated_partner_token':
                event = this.localize('account_log_token_generated');
                break;

            case 'account_enabled_two_fa':
                event = this.localize('account_log_2fa_enabled');
                break;

            case 'account_disabled_two_fa':
                event = this.localize('account_log_2fa_disabled');
                break;

            case 'account_authorized_application':
                event = this.localize('account_log_application_authorized', 'application', item.data.oauth_authorization.oauth_application.title);
                break;

            case 'account_revoked_authorization':
                event = this.localize('account_log_application_revoked', 'application', item.data.oauth_authorization.oauth_application.title);
                break;

            case 'company_role_added':
                event = this.localize('company_role_added', 'account', item.data.account.display_name);
                break;

            case 'company_role_removed':
                event = this.localize('company_role_removed', 'account', item.data.account.display_name);
                break;

            case 'orgunit_created':
                event = this.localize('orgunit_created', 'orgunit', item.data.orgunit.name);
                break;

            case 'orgunit_updated':
                let data = item.data,
                    message = '';

                for (const property in data) {
                    const propertyValue = data[property],
                        from = propertyValue.from,
                        to = propertyValue.to;

                    const propertyName = property.replace('_updated', '');
                    message += this.localize('orgunit_updated', 'property', propertyName, 'fromValue', from, 'toValue', to);
                }

                event = message;

                break;

            case 'org_unit_removed':
                event = this.localize('org_unit_removed', 'orgunit', item.data.orgunit.name);
                break;

            case 'orgunit_added':
                event = this.localize('account_log_role_added_to_orgunit', 'account', item.data.role.account.name, 'orgunit', item.data.orgunit.name);
                break;

            case 'application_added_to_orgunit':
                event = this.localize('application_added_to_orgunit', 'application', item.data.application.title, 'orgunit', item.data.orgunit.name);
                break;

            case 'company_settings_updated':
                event = this._formatLogCompanySettingsUpdated(item);
                break;

            case 'company_logo_updated':
                event = this.localize('log_company_logo_changed');
                break;

            case 'company_role_promoted_to_admin':
                event = this.localize('company_role_promoted_to_admin', 'account', item.affected_account_display_name);
                break;

            case 'company_role_demoted_from_admin':
                event = this.localize('company_role_demoted_from_admin', 'account', item.affected_account_display_name);
                break;

            case 'company_role_account_updated':
                event = this._formatLogCompanyRoleAccountUpdated(item);
                break;

            case 'company_role_account_password_changed':
                event = this.localize('company_role_account_password_changed', 'account', item.affected_account_display_name);
                break;

            case 'company_customers_imported':
                event = this.localize('company_customers_imported', 'num', ""+item.data.importedCustomers, 'account', item.initiatior_display_name);
                break;

            case 'company_roles_imported':
                event = this.localize('company_roles_imported', 'number', item.data.imporeted_roles);
                break;

            case 'account_added_to_orgunit':
                event = this.localize('account_added_to_orgunit', 'account', item.affected_account_display_name, 'orgunit', item.data.orgunit.name);
                break;

            case 'company_role_removed_from_orgunit':
                event = this.localize('company_role_removed_from_orgunit', 'account', item.data.account.display_name, 'orgunit', item.data.org_unit.name);
                break;

            case 'application_remove_from_orgunit':
                event = this.localize('application_removed_from_orgunit', 'application', item.data.application.title, 'orgunit', item.data.name);
                break;

            case 'application_created':
                event = this.localize('application_created', 'application', item.data.application.title);
                break;

            case 'application_updated':
                if(item.data.length === 0) {
                    event = this.localize('application_updated_empty');
                } else {
                    event = this._formatLogApplicationUpdated(item);
                }
                break;

            case 'application_removed':
                event = this.localize('application_removed', 'application', item.data.application.title);
                break;

            case 'application_icon_removed':
                event = this.localize('application_icon_removed', 'application', item.data.application.title, 'account', item.affected_account_display_name);
                break;

            case 'application_shared':
                event = this.localize('application_shared', 'application', item.data.application.title, 'account', item.affected_account_display_name);
                break;

            case 'application_claims_updated':

                if (item.data.application) {
                    event = this.localize('application_claims_updated', 'application', item.data.application.title, 'account', item.affected_account_display_name);
                }
                else {
                    event = this.localize('application_claims_updated_raw');
                }

                break;

            case 'application_icon_claims_updated':

                if (item.data.application) {
                    event = this.localize('application_icon_claims_updated', 'application', item.data.application.title, 'account', item.affected_account_display_name);
                }
                else {
                    event = this.localize('application_icon_claims_updated_raw', 'account', item.affected_account_display_name);
                }

                break;

            case 'subscription_updated':
                event = this.localize('subscription_updated', 'plan', item.data.subscription_plan, 'licences', item.data.appsco_licences);
                break;

            case 'subscription_canceled':
                event = this.localize('subscription_canceled');
                break;

            case 'invoice_sent':
                event = this.localize('invoice_sent', 'invoice', item.data.invoice_id);
                break;

            case 'credit_card_created':

                if (item.data.credit_card.brand) {
                    event = this.localize('credit_card_created', 'brand', item.data.credit_card.brand, 'number', item.data.credit_card.last4);
                }
                else {
                    event = this.localize('credit_card_created_raw');
                }

                break;

            case 'application_password_copy':
                event = this.localize('application_password_copied', 'application', item.data.application.title);
                break;

            case 'application_username_copy':
                event = this.localize('application_username_copied', 'application', item.data.application.title);
                break;

            case 'company_customer_added':
                event = this.localize('customer_added_to_company', 'customer', item.data.customer.name);
                break;

            case 'company_customer_removed':
                event = this.localize('customer_removed_from_company', 'customer', item.data.customer.name);
                break;

            case 'company_group_added':
                event = this.localize('company_group_created', 'group', item.data.group);
                break;

            case 'company_group_removed':
                event = this.localize('company_group_removed', 'group', item.data.group);
                break;

            case 'resource_added_to_company_group':
                event = this.localize('company_resource_added_to_company_group', 'group', item.data.group, 'resource', item.data.application.title);
                break;

            case 'resource_removed_from_company_group':
                event = this.localize('company_resource_removed_from_company_group', 'group', item.data.group, 'resource', item.data.application.title);
                break;

            case 'company_role_added_to_company_group':
                event = this.localize('company_role_added_to_company_group', 'group', item.data.group, 'account', item.data.account.name);
                break;

            case 'company_role_removed_from_company_group':
                event = this.localize('company_role_removed_from_company_group', 'group', item.data.group, 'account', item.data.account.name);
                break;

            case 'company_contact_added_to_company_group':
                event = this.localize('company_contact_added_to_company_group', 'group', item.data.group, 'account', item.data.account.name);
                break;

            case 'company_contact_removed_from_company_group':
                event = this.localize('company_contact_removed_from_company_group', 'group', item.data.group, 'account', item.data.account.name);
                break;

            case 'application_image_changed':
                event = this.localize('application_image_changed', 'resource', item.data.application.title);
                break;

            case 'enforce_two_factor_authentication_enabled':
                event = this.localize('enforce_two_factor_authentication_enabled');
                break;

            case 'enforce_two_factor_authentication_disabled':
                event = this.localize('enforce_two_factor_authentication_disabled');
                break;

            case 'application_access_report_exported':
                event = this.localize('application_access_report_exported');
                break;

            case 'company_log_exported':
                event = this.localize('company_log_exported', 'account', item.initiatior_display_name);
                break;

            case 'company_customers_exported':
                event = this.localize('company_customers_exported');
                break;

            case 'company_contact_created':
                let display_name = item.data.contact.email;
                if(item.data.contact.first_name && item.data.contact.last_name) {
                    display_name = item.data.contact.first_name+" "+item.data.contact.last_name;
                }
                event = this.localize('company_contact_created', 'display_name', display_name);
                break;

            case 'company_role_2fa_reset':
                event = this.localize('company_role_2fa_reset', 'admin', item.initiatior_display_name, 'account', item.data.account.name);
                break;

            case 'company_partner_admin_removed_from_customer':
                event = this.localize('company_partner_admin_removed_from_customer', 'account', item.data.account.name, 'admin', item.initiatior_display_name, 'customer', item.data.customer.name);
                break;

            case 'company_partner_admin_created_in_customer':
                event = this.localize('company_partner_admin_created_in_customer', 'account', item.data.account.name, 'admin', item.initiatior_display_name);
                break;

            case 'managed_user_logged_in':
                event = this.localize('managed_user_logged_in', 'account', item.initiatior_display_name);
                break;

            case 'transfer_token_sent':
                event = this.localize('transfer_token_sent');
                break;

            case 'company_role_partner_admin_created':
                event = this.localize('company_role_partner_admin_created', 'admin', item.initiatior_display_name, 'account', item.data.account.name, 'customer', item.data.customer.name);
                break;

            case 'company_role_partner_admin_removed':
                event = this.localize('company_role_partner_admin_removed', 'admin', item.initiatior_display_name, 'account', item.data.account.name);
                break;

            case 'oauth_application_created':
                event = this.localize('oauth_application_created', 'application', item.data.oauth_application.title);
                break;

            case 'oauth_application_updated':
                event = this.localize('oauth_application_updated', 'application', item.data.oauth_application ?
                    item.data.oauth_application.title : '');
                break;

            case 'oauth_application_removed':
                event = this.localize('oauth_application_removed', 'application', item.data.oauth_application.title);
                break;

            case 'company_policy_breached':
                event = this.localize('company_policy_breached', 'policy', item.data.name);
                break;

            case 'resource_admin_added':
                event = this.localize('resource_admin_added', 'application', item.data.application.title);
                break;

            case 'resource_admin_removed':
                event = this.localize('resource_admin_removed', 'application', item.data.application.title);
                break;

            case 'company_access_on_boarding_resolved':
                event = this.localize(
                    'company_access_on_boarding_resolved',
                    'resolvedBy', item.initiatior_display_name,
                    'user', item.data.access_on_boarding.user.display_name,
                    'application', item.data.access_on_boarding.application_icon.title
                );
                break;

            case 'company_policy_enabled':
                event = this.localize(
                    'company_policy_enabled',
                    'policy',
                    (item.data.policy ? item.data.policy.name : item.data.enabled_policy.name)
                );
                break;

            case 'company_policy_disabled':
                event = this.localize(
                    'company_policy_disabled',
                    'policy',
                    (item.data.policy ? item.data.policy.name : item.data.disabled_policy.name)
                );
                break;

            case 'provisioning_webhook_watcher_initialized':
                event = this.localize(
                    'provisioning_webhook_watcher_initialized',
                    'title', item.data.watcher.title,
                    'action', item.data.watcher.action,
                    'integration', (item.data.integrationName ? item.data.integrationName: "")
                );
                break;
            case 'provisioning_webhook_watcher_sys_processing':
                event = this.localize(
                    'provisioning_webhook_watcher_sys_processing',
                    'title', item.data.watcher.title,
                    'action', item.data.watcher.action,
                    'integration', (item.data.integrationName ? item.data.integrationName: "")
                );
                break;
            case 'provisioning_pst_request_successful':
                event = this.localize(
                    'provisioning_pst_request_successful',
                    'action', item.data.action,
                    'message', item.data.message
                );
                break;
            case 'provisioning_pst_request_failed':
                event = this.localize(
                    'provisioning_pst_request_failed',
                    'action', item.data.action,
                    'message', item.data.message
                );
                break;
            default:
                event = this.localize(item.type);
        }

        return event;
    }

    _mapToListItem(item) {
        return {
            icon: item.account.image ? item.account.image : this._placeholder,
            date: item.date,
            message: item.event
        };
    }

    /**
     * Handles error on get log API request.
     * @param {Object} event Event from error response.
     *
     * @private
     */
    _onLogError(event) {
        this._message = 'We could not load log at the moment. Please contact AppsCo support.';
        this._totalLogItems = 0;
        this._handleEmptyLog();
        this._hideProgressBar();
        this._hideLoadMoreActionProgressBar();
        this._setLoadMoreAction();
    }

    /**
     * Handles response on get log API request.
     * @param {Object} event Event from response.
     *
     * @private
     */
    _onLogResponse(event) {
        const response = event.detail.response;

        this.set('_message', '');

        if (response && response.logs) {
            const logs = response.logs,
                length = logs.length;

            if (length > 0) {
                this._logEmpty = !!this._filterTerm;

                logs.forEach(function(log, i) {
                    const record = this.formatLogItem(logs[i]);
                    record.status = ['provisioning_recipe_integration_inactive', 'provisioning_pst_request_failed', 'provisioning_webhook_watcher_unauthorized'].includes(logs[i].type) ? 'Failed' : 'Success';
                    const pushItem = setTimeout(function () {
                        this.push('_logList', record);
                        this.push('_wholeLogList', record);

                        if (i === (length - 1)) {
                            this.dispatchEvent(new CustomEvent('loaded', {bubbles: true, composed: true}));
                            this._hideProgressBar();
                            this._hideLoadMoreActionProgressBar();
                            this._setLoadMoreAction();
                            this._itemPushList = [];

                            this._logEmpty = false;

                            if (this._filterTerm) {
                                this.filterLogByTerm(this._filterTerm);
                            }
                        }
                    }.bind(this), (i + 1) * 30);
                    this._itemPushList.push(pushItem);
                }.bind(this));
            }
            else {
                this._message = 'There are no asked log records.';
                this._handleEmptyLog();
            }

            this._totalLogItems = response.meta.total;
            this._nextPageAuditLogApi = response.meta.next + '&limit=' + this.size;
        }
    }

    _handleEmptyLog() {
        this._logEmpty = true;
        this._hideProgressBar();
        this._hideLoadMoreActionProgressBar();
        this.dispatchEvent(new CustomEvent('empty-load', { bubbles: true, composed: true }));
    }

    _showProgressBar() {
        this.$.progress.hidden = false;
    }

    _hideProgressBar() {
        setTimeout(function() {
            this.$.progress.hidden = true;
        }.bind(this), 500);
    }

    _onLoadMoreAction() {
        this._showLoadMoreProgressBar();
        this.$.ironAjaxLog.url = this._nextPageAuditLogApi;
        this.$.ironAjaxLog.generateRequest();
    }

    loadLog() {
        const itemPushList = this._itemPushList,
            getAuditLogRequest = this.$.ironAjaxLog;

        if (itemPushList.length > 0) {
            for (const i in itemPushList) {
                clearTimeout(itemPushList[i]);
            }
        }

        this.set('_logList', []);
        this.set('_wholeLogList', []);

        if (getAuditLogRequest.lastRequest) {
            getAuditLogRequest.lastRequest.abort();
        }

        getAuditLogRequest.url = this._auditLogApi;
        getAuditLogRequest.headers = this._headers;
        getAuditLogRequest.generateRequest();
    }

    reloadLog() {
        this.$.ironAjaxLog.body = '';
        this.loadLog();
    }

    filter(filterEventType, filterFromDate, filterToDate, filterAccount, filterTerm) {
        let body = '';

        this._showProgressBar();
        this._hideLoadMoreAction();

        if (filterEventType) {
            body += body === '' ? '' : '&';
            body += encodeURIComponent('event') + '=' + encodeURIComponent(filterEventType);
        }

        if (filterFromDate) {
            body += body === '' ? '' : '&';
            body += encodeURIComponent('from') + '=' + encodeURIComponent(filterFromDate);
        }

        if (filterToDate) {
            body += body === '' ? '' : '&';
            body += encodeURIComponent('to') + '=' + encodeURIComponent(filterToDate);
        }

        if (filterAccount) {
            body += body === '' ? '' : '&';
            body += encodeURIComponent('account') + '=' + encodeURIComponent(filterAccount);
        }

        if (filterTerm) {
            body += body === '' ? '' : '&';
            body += encodeURIComponent('term') + '=' + encodeURIComponent(filterTerm);
        }

        this.$.ironAjaxLog.body = body;
        this.loadLog();
    }

    filterLogByTerm(term) {
        const length = this._wholeLogList.length;

        this._filterTerm = term;

        this._showProgressBar();
        this._hideLoadMoreAction();
        this._logEmpty = false;
        this._message = '';

        if (0 === length) {
            this._hideProgressBar();
            this._logEmpty = true;
            this._message = 'There are no logs to search.';
            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
            return false;
        }

        if (0 === term.length) {
            this.set('_logList', JSON.parse(JSON.stringify(this._wholeLogList)));
            this._hideProgressBar();
            this._setLoadMoreAction();
            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
            return false;
        }

        this.set('_logList', []);

        this._wholeLogList.forEach(function(item, index) {
            if (item.account.name.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
                const oldElem = JSON.parse(JSON.stringify(item));

                this.push('_logList', oldElem);
            }

            if (index === length - 1) {
                if (0 === this._logList.length) {
                    this._logEmpty = true;
                    this._message = 'There are no logs with asked term.';
                }

                this._hideProgressBar();
                this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
            }
        }.bind(this));
    }
}
window.customElements.define(AppscoProvisioningLog.is, AppscoProvisioningLog);
