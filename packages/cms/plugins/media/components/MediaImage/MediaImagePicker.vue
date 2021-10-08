<template>
  <div
    class="media-image-picker"
    :class="{'--empty': isEmpty, '--notempty': !isEmpty}"
  >
    <div class="input-url">
      <input
        class="ui-native"
        placeholder="URL"
        type="text"
        :value="value"
        @keyup.enter="$emit('input', $event.target.value)"
        @keyup.esc="$event.target.value = value"
        xxxxinput="$emit('input', $event.target.value)"
      />
    </div>

    <UiFileUploader
      :path="path"
      max-files="1"
      @success="onUploadSuccess"
      @error="onUploadError"
      accepted-files="image/*"
    >
      <div class="image-picker-face">
        <div class="image-picker-overlay">
          <UiIcon value="mdi:upload"></UiIcon>
          <p>Subir imagen</p>
        </div>
        <MediaImage :src="value"></MediaImage>
      </div>
    </UiFileUploader>
  </div>
</template>

<script>
import MediaImage from './MediaImage.vue';
import { UiIcon, UiFileUploader } from '../../../../../ui';

export default {
  name: 'MediaImagePicker',
  components: { MediaImage, UiFileUploader, UiIcon },
  props: {
    path: {
      type: String,
      required: true,
    },

    value: {
      type: String,
      required: false,
      default: null,
    },
  },

  computed: {
    isEmpty() {
      return !this.value || !this.value.trim();
    },
  },

  methods: {
    onUploadSuccess(e) {
      this.$emit('input', e[0].url);
    },

    onUploadError(err) {
      alert('Error subiendo archivo');
      console.log('Error subiendo archivo', err);
    },
  },
};
</script>

<style lang="scss">
.media-image-picker {
  position: relative;

  .input-url {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;

    display: flex;

    input {
      flex: 1;
      margin: 5px;
      background-color: rgba(255, 255, 255, 0.9);
    }
  }

  .image-picker-face {
    position: relative;

    .image-picker-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      color: #fff;
      opacity: 0.7;
      text-shadow: 0 1px 2px #000, 0 0 2px #000, -1px 0 2px #000, 1px 0 2px #000;
    }
  }

  &.--notempty {
    .input-url,
    .image-picker-overlay {
      transition: opacity var(--ui-duration-quick);
      opacity: 0;
    }

    &:hover {
      .input-url,
      .image-picker-overlay {
        opacity: 1;
      }
    }
  }
}
</style>