<template>
  <div class="MediaVideoPicker">
    <UiInput
      v-if="endpoint"
      type="url"
      :endpoint="endpoint"
      :model-value="modelValue"
      placeholder="Video URL"
      class="MediaVideoPicker__url"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
    <div
      v-else
      class="MediaVideoPicker__form"
    >
      <input
        class="ui-native"
        type="text"
        :value="modelValue"
        placeholder="URL (YouTube o Vimeo)"
        @input="$emit('update:modelValue', $event.target.value)"
      >
    </div>

    <UiVideo :url="modelValue" />
  </div>
</template>

<script>
import { UiVideo, UiInput } from '../../../../../ui'

export default {
  name: 'MediaVideoPicker',
  components: { UiVideo, UiInput },
  props: {
    modelValue: {
      type: String,
      required: false,
      default: null,
    },

    endpoint: {
      type: String,
      required: false,
      default: null,
    },
  },
  emits: ['update:modelValue'],
}
</script>

<style lang="scss">
.MediaVideoPicker {
  &__form {
    input {
      width: 100%;
      border-bottom: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}
</style>