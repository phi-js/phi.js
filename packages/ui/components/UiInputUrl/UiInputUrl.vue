<script setup>
import { UiUpload } from '../UiUpload'

const props = defineProps({
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
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div
    class="UiInputUrl UiInput__element"
    tabindex="0"
  >
    <input
      class="UiInputUrl__input"
      type="text"
      :value="props.modelValue"
      :placeholder="$attrs.placeholder"
      @input="emit('update:modelValue', $event.target.value)"
    >
    <UiUpload
      v-if="endpoint"
      class="UiInputUrl__uploader"
      :endpoint="endpoint"
      v-bind="$attrs"
      :model-value="[]"
      @update:model-value="emit('update:modelValue', $event?.url)"
    />
  </div>
</template>

<style lang="scss">
.UiInputUrl {
  display: flex;
  flex-wrap: nowrap;
  padding: 4px;
  padding-left: 12px;

  &__input {
    flex: 1;
    background: transparent;
    color: inherit;

    border: 0;
    margin: 0;
    padding: 0;
    outline: none;

    font-family: inherit;
    font-size: inherit;
  }

  .UiUpload__button {
    --ui-item-padding: 6px 16px;
    min-height: 0;
  }
}
</style>