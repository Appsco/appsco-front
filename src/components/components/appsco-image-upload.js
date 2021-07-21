import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import './appsco-loader.js';
import { AppscoUploadImageBehavior } from './appsco-upload-image-behavior.js';
import './appsco-upload-image-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoImageUpload extends mixinBehaviors([AppscoUploadImageBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-upload-image-styles"></style>

        <div class="upload-container">

            <appsco-loader active="[[ _loader ]]" loader-alt="[[ loaderAlt]]" multi-color=""></appsco-loader>

            <template is="dom-if" if="[[ image ]]">
                <iron-image class="item-image" src\$="[[ image ]]" alt="[[ imageAlt ]]" sizing="contain"></iron-image>
            </template>

            <template is="dom-if" if="[[ !previewOnly ]]">
                <label for="imageInput" class\$="item-image-upload [[ _imagePreview ]]">
                    <iron-icon icon="file-upload" class="icon-upload"></iron-icon>
                </label>

                <input type="file" accept="image/*" id="imageInput" name="image" class="upload-file" on-change="_onUploadImage">
            </template>
        </div>

        <template is="dom-if" if="[[ !previewOnly ]]">
            <template is="dom-if" if="[[ image ]]">
                <paper-button class="remove-action" on-tap="_onRemoveImageAction">[[ removeActionText ]]</paper-button>
            </template>
        </template>
`;
    }

    static get is() { return 'appsco-image-upload'; }

    static get properties() {
        return {
            image: {
                type: String,
                notify: true
            },

            loaderAlt: {
                type: String,
                value: 'AppsCo is saving image'
            },

            imageAlt: {
                type: String,
                value: 'AppsCo image'
            },

            _imagePreview: {
                type: String,
                computed: '_computeImagePreviewClass(image)'
            }
        };
    }

    reset() {
        this.set('image', null);
    }

    _computeImagePreviewClass(image) {
        return image ? 'has-image' : 'no-image';
    }

    _setNewImage(file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            this.set('image', e.target.result);
        }.bind(this);

        reader.readAsDataURL(file);
    }

    _fireChangeEvent(response) {
        this.dispatchEvent(new CustomEvent('image-changed', {
            bubbles: true,
            composed: true,
            detail: {
                response: JSON.parse(response)
            }
        }));
    }

    _setStateAfterImageIsRemoved(response) {
        this.set('image', null);
        this._fireChangeEvent(JSON.stringify(response));
        this._hideLoader();
    }
}
window.customElements.define(AppscoImageUpload.is, AppscoImageUpload);
