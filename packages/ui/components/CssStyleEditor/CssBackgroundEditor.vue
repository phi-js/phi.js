<script setup>
import { computed } from 'vue'
import CssStyleEditor from './CssStyleEditor.vue'

const props = defineProps({
  /*
  Object. An Object of css properties
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => {},
  },
})

const emit = defineEmits(['update:modelValue'])

const styleEditorSchema = computed(() => {
  const retval = {
    type: 'object',
    properties: {
      'background-color': { title: 'Color', format: 'color' },
      'background-image': { title: 'Image', format: 'css-url' },
    },
  }

  if (props.modelValue?.['background-image']) {
    Object.assign(
      retval.properties,
      {
        'background-repeat': { title: 'Repeat', format: 'css-repeat' },
        'background-size': { title: 'Size', format: 'css-background-size' },
        'background-position': { title: 'Position', format: 'css-position' },
        'background-attachment': { title: 'Attachment', format: 'css-background-attachment' },
      },
    )
  }

  return retval
})
</script>

<template>
  <CssStyleEditor
    class="CssBackgroundEditor"
    :model-value="props.modelValue"
    :schema="styleEditorSchema"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>