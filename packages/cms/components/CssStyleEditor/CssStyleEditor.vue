<script setup>
import { ref, watch, computed, provide } from 'vue'
import { UiInput } from '@/packages/ui'

import cssUrl from './types/url.vue'
import cssSpacing from './types/spacing.vue'

provide('_ui_input_types', {
  'css-url': cssUrl,
  'css-spacing': cssSpacing,
})


const props = defineProps({
  /*
  An object describing CSS properties
  {
    "--ui-color-background": "red",
    "padding": "0 0 3px 0",
    "margin": "0 auto 0 auto",
    ...
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },


  /*
  A JSON schema describing the css object.
  It can be overloaded in the "format" property to specify CSS types
  {
    "type": "object",
    "properties": {
      "--ui-color-background": {
        // "format": "color"
        "format": {
          "type": "color",
          "palette": [ ... array of available color strings .... ]
        }
      },
      "padding": {
        "format": "spacing"
      },
      "margin": {
        "format": { // EXTENDED format info
          "type": "spacing",
          "defaultValue": "auto"
        }
      },
    }
  }
  */
  schema: {
    type: Object,
    required: false,
    default: null,
  },


  /* Uploads endpoint */
  uploadUrl: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref()
const schema = ref()

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = { ...newValue }

    if (schema.value?.properties) {
      for (const [propName, propSchema] of Object.entries(schema.value.properties)) {
        if (typeof propSchema.filterInput == 'function') {
          innerValue.value[propName] = propSchema.filterInput(innerValue.value[propName])
        }
      }
    }
  },
  { immediate: true },
)

watch(
  () => props.schema,
  (newValue) => {
    if (newValue) {
      schema.value = newValue
    } else {
      schema.value = { type: 'object', properties: {} }
      for (const propName of Object.keys(innerValue.value)) {
        schema.value.properties[propName] = { type: 'string' }
      }
    }
  },
  { immediate: true, deep: true },
)



function emitUpdate(input) {
  if (typeof input?.filterOutput == 'function') {
    innerValue.value[input.propName] = input.filterOutput(innerValue.value[input.propName])
  }

  emit('update:modelValue', { ...innerValue.value })
}


const inputs = computed(() => {
  const retval = []

  for (const [propName, propSchema] of Object.entries(schema.value.properties)) {
    retval.push({
      props: {
        type: propSchema.format?.type || propSchema.format || propSchema.type || 'text',
        label: propSchema.title,
        ...propSchema.props,
      },
      propName,
      default: propSchema.default,
      filterOutput: propSchema.filterOutput,
    })
  }

  return retval
})
</script>

<template>
  <div class="CssStyleEditor">
    <UiInput
      v-for="(input, i) in inputs"
      :key="i"
      v-bind="input.props"
      :model-value="innerValue[input.propName] || input.default"
      :endpoint="$attrs.endpoint"
      @update:model-value="innerValue[input.propName] = $event; emitUpdate(input)"
    />
  </div>
</template>