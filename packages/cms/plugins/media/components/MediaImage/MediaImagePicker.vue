<template>
  <div
    class="MediaImagePicker"
    :class="{'MediaImagePicker--empty': isEmpty, 'MediaImagePicker--notempty': !isEmpty}"
  >
    <MediaImage
      class="MediaImagePicker__image"
      :src="modelValue"
      v-bind="$attrs"
    />

    <div class="MediaImagePicker__infobox">
      <UiInput
        v-if="isEmpty"
        class="MediaImagePicker__uploader"
        type="upload"
        :endpoint="endpoint"
        inline
        auto-proceed
        placeholder="Subir imágen"
        @update:modelValue="$emit('update:modelValue', $event?.url)"
      />
      <UiInput
        v-else
        type="url"
        :endpoint="endpoint"
        :model-value="modelValue"
        placeholder="Image URL"
        @update:modelValue="$emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>

<script>
import MediaImage from './MediaImage.vue'
import { UiInput } from '../../../../../ui'

export default {
  name: 'MediaImagePicker',
  components: { MediaImage, UiInput },
  props: {
    endpoint: {
      type: String,
      required: true,
    },

    modelValue: {
      type: String,
      required: false,
      default: null,
    },
  },
  emits: ['update:modelValue'],

  computed: {
    isEmpty() {
      return !this.modelValue?.trim?.()
    },
  },

  methods: {
    onUploadSuccess(e) {
      this.$emit('update:modelValue', e[0].url)
    },

    onUploadError(err) {
      alert('Error subiendo archivo')
      console.log('Error subiendo archivo', err)
    },
  },
}
</script>

<style lang="scss">
.MediaImagePicker {
  position: relative;

  &__infobox {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    opacity: 0;
    transition: opacity var(--ui-duration-snap);

    background-color: rgba(0,0,0, 0.5);
  }

  &__uploader {
    min-width: 400px;
  }

  &--empty,
  &:hover {
    .MediaImagePicker__infobox {
      opacity: 1;
    }
  }

  &--notempty {
    .MediaImagePicker__infobox {
      padding: var(--ui-padding);
      align-items: flex-start;
      justify-content: flex-end;
    }
  }
}
</style>