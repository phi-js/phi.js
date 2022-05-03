<script setup>
const props = defineProps({
  /*
  An IFRAME STRING (html)
  "<iframe ..... >"
  */
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="IframeEditorFace">
    <textarea
      style="width: 100%; min-height: 80px; white-space: pre-wrap"
      :value="props.modelValue"
      placeholder="Paste your IFrame code here
<iframe ..."
      @input="emit('update:modelValue', $event.target.value)"
    />
    <div
      v-if="props.modelValue.trim()"
      v-html="props.modelValue"
    />
  </div>
</template>