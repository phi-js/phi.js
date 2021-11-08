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
    class="UiInputUrl ui__inset"
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
      placeholder="Subir archivo"
      @update:modelValue="emit('update:modelValue', $event?.url)"
    />
  </div>
</template>

<style lang="scss">
.UiInputUrl {
  display: flex;
  overflow: hidden;
  flex-wrap: nowrap;

  &__input {
    flex: 1;
    min-width: 300px;
    border: 0;
    outline: none;
    font-size: 1em;
    font-family: inherit;
    background-color: transparent;
    color: inherit;

    padding: 0 var(--ui-padding-horizontal);

    &::placeholder {
      color: var(--ui-color-fg);
    }
  }

  .UiUpload__files {
    display: none;
  }
}
</style>