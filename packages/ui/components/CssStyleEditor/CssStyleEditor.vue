<script setup>
import { ref, watch, computed, provide } from 'vue'
import { UiInput, UiIcon } from '@/packages/ui'

import CssBackgroundAttachment from './types/background-attachment.vue'
import CssBackgroundSize from './types/background-size.vue'
import cssPosition from './types/position.vue'
import cssRepeat from './types/repeat.vue'
import cssSpacing from './types/spacing.vue'
import cssUnit from './types/unit.vue'
import cssUrl from './types/url.vue'

provide('_ui_input_types', {
  'css-background-attachment': CssBackgroundAttachment,
  'css-background-size': CssBackgroundSize,
  'css-position': cssPosition,
  'css-repeat': cssRepeat,
  'css-spacing': cssSpacing,
  'css-unit': cssUnit,
  'css-url': cssUrl,
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
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref()
const schema = ref()

watch(
  () => props.modelValue,
  (newValue) => innerValue.value = { ...newValue },
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

function emitUpdate() {
  emit('update:modelValue', { ...innerValue.value })
}

const inputs = computed(() => {
  const retval = []
  for (const [propName, propSchema] of Object.entries(schema.value.properties)) {
    retval.push({
      props: {
        type: propSchema.format?.type || propSchema.format || propSchema.type || 'text',
        label: propSchema.title,
        ...propSchema.format?.props,
      },
      propName,
      default: propSchema.default,
    })
  }

  return retval
})
</script>

<template>
  <div class="CssStyleEditor">
    <div
      v-for="(input, i) in inputs"
      :key="i"
      class="CssStyleEditor__property"
    >
      <UiInput
        class="CssStyleEditor__input"
        v-bind="input.props"
        :model-value="innerValue[input.propName] || input.default"
        :endpoint="$attrs.endpoint"
        @update:model-value="innerValue[input.propName] = $event; emitUpdate()"
      />

      <UiIcon
        class="CssStyleEditor__deleter"
        src="mdi:backspace-outline"
        :title="`Reset ${input.props?.label || ''}`"
        @click="innerValue[input.propName] = null; emitUpdate()"
      />
    </div>
  </div>
</template>

<style lang="scss">
.CssStyleEditor {
  &__property {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 1rem;
  }

  &__input {
    flex: 1;
  }

  &__deleter {
    display: block;
    width: 30px;
    height: 30px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }
  }
}
</style>