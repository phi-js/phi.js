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
  <div class="UiInputUrl UiGroup" tabindex="0">
    <input
      class="UiInputUrl__input UiInput__element"
      type="text"
      :value="props.modelValue"
      :placeholder="$attrs.placeholder"
      @input="emit('update:modelValue', $event.target.value)"
    />
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