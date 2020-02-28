import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior
 */
export const AppscoUploadImageBehavior = {

    properties: {
        authorizationToken: {
            type: String,
            value: ''
        },

        imageSettingsApi: {
            type: String
        },

        previewOnly: {
            type: Boolean,
            value: false
        },

        _computedAuthorizationHeader: {
            type: Object,
            computed: '_computeAuthorizationHeader(authorizationToken)'
        },

        _loader: {
            type: Boolean,
            value: false
        }
    },

    _computeAuthorizationHeader: function (authorizationToken) {
        return ('token ' + authorizationToken).toString();
    },

    _showLoader: function() {
        this._loader = true;
    },

    _hideLoader: function() {
        this._loader = false;
    },

    _validateImageFile: function(file) {
        const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png'],
            fileType = file.type;

        let valid = true;

        if (file.size > 1048576) {
            this.dispatchEvent(new CustomEvent('image-upload-error', {
                bubbles: true,
                composed: true,
                detail: 'Image size must be less than 1MB.'
            }));
            valid = false;
        }
        else {
            for (let i = 0; i < validFileTypes.length; i++) {
                if (validFileTypes[i] === fileType) {
                    valid = true;
                    break;
                }
                else {
                    valid = false;
                }

                if (i === (validFileTypes.length - 1) && !valid) {
                    this.dispatchEvent(new CustomEvent('image-upload-error', {
                        bubbles: true,
                        composed: true,
                        detail: 'Allowed file types are: jpg, jpeg and png.'
                    }));
                }
            }
        }

        return valid;
    },

    _setObjectAttribute: function(object, attribute, value) {
        this[object][attribute] = value;

        const objectClone = JSON.parse(JSON.stringify(this[object]));

        this.set(object, {});
        this.set(object, objectClone);
    },

    _onUploadImage: function(event) {
        const input = event.target;

        if (input.files && input.files[0]) {
            const file = input.files[0],
                formData = new FormData(),
                request = new XMLHttpRequest();

            this._showLoader();

            /** To ensure that on-change event will be triggered even if user tries to upload same image again */
            this.shadowRoot.querySelector('input[type="file"]').value = null;

            if (!this._validateImageFile(file)) {
                this._hideLoader();
                return false;
            }

            formData.append('file', file, file.name);

            request.onreadystatechange = function()
            {
                if (request.readyState === 4 && request.status === 200) {
                    this._setNewImage(file);
                    this._fireChangeEvent(request.response);
                    this._hideLoader();
                }
            }.bind(this);

            request.open('POST', this.imageSettingsApi, true);
            request.setRequestHeader('Authorization', this._computedAuthorizationHeader);
            request.send(formData);
        }
    },

    _onRemoveImageAction: function(event) {
        event.stopPropagation();

        const request = document.createElement('iron-request'),
            options = {
                url: this.imageSettingsApi,
                method: 'DELETE',
                handleAs: 'json',
                headers: {
                    'Authorization': this._computedAuthorizationHeader
                }
            };

        this._showLoader();

        request.send(options).then(function() {

            if (200 === request.status) {
                this._setStateAfterImageIsRemoved(request.response);
            }
        }.bind(this));
    }
};
