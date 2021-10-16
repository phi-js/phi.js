<template>
  <div class="MediaVideoPicker">
    <div class="MediaVideoPicker__form">
      <input
        class="ui-native"
        type="text"
        :model-value="modelValue"
        placeholder="URL (YouTube o Vimeo)"
        @input="$emit('update:modelValue', $event.target.value)"
      >
    </div>

    <UiVideo :url="modelValue" />
  </div>
</template>

<script>
import { UiVideo } from '../../../../../ui'

export default {
  name: 'MediaVideoPicker',
  components: { UiVideo },
  props: {
    modelValue: {
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