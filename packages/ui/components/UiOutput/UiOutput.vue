<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { shallowRef, computed, defineAsyncComponent, watch, useAttrs } from 'vue'

import { injectedTypes } from '.'

const attrs = useAttrs()

const availableTypes = {
  currency: defineAsyncComponent(() => import('./types/currency.vue')),
  date: defineAsyncComponent(() => import('./types/date.vue')),
  email: defineAsyncComponent(() => import('./types/email.vue')),
  geo: defineAsyncComponent(() => import('./types/geo.vue')),
  image: defineAsyncComponent(() => import('./types/image.vue')),
  upload: defineAsyncComponent(() => import('./types/upload.vue')),
  url: defineAsyncComponent(() => import('./types/url.vue')),
}

const props = defineProps({
  value: {
    validator: () => true,
    required: false,
    default: null,
  },

  type: {
    type: String,
    required: false,
    default: null,
  },

  format: {
    type: [Object, String],
    required: false,
    default: null,
  },

  items: {
    type: [Object, String],
    required: false,
    default: null,
  },

  oneOf: {
    type: Array,
    required: false,
    default: null,
  },
})

const innerValue = shallowRef()

watch(
  () => props.value,
  (newValue) => {
    if (props.type == 'array') {
      innerValue.value = Array.isArray(props.value)
        ? props.value
        : props.value !== null && props.value !== undefined
          ? [props.value]
          : []
    } else {
      innerValue.value = newValue
    }
  },
  { immediate: true },
)

const displayValue = computed(() => {
  if (Array.isArray(props.oneOf)) {
    const foundItem = props.oneOf.find((item) => item?.const == props.value)
    if (foundItem?.title) {
      return foundItem.title
    }
  }

  return innerValue.value
})

const customType = computed(() => ({
  component: availableTypes[props.type] || injectedTypes[props.type],
  props: typeof props.format == 'object' && props.format
    ? props.format
    : { format: props.format },
}))

const itemsProp = computed(() => {
  if (typeof props.items == 'object' && props.items) {
    return {
      ...props.items,
      type: props.items?.type || 'text',
    }
  }
  return { type: props.items }
})
</script>

<template>
  <template v-if="innerValue === null">
    <!-- NULL -->
  </template>
  <ul
    v-else-if="props.type == 'array'"
    v-bind="attrs"
    class="UiOutput"
    :class="`UiOutput--array UiOutput--${itemsProp.type}`"
  >
    <li
      v-for="(item, i) in innerValue"
      :key="i"
    >
      <UiOutput
        :value="item"
        v-bind="itemsProp"
      />
    </li>
  </ul>
  <Component
    :is="customType.component"
    v-else-if="customType.component"
    class="UiOutput"
    :class="`UiOutput--${props.type}`"
    v-bind="{ ...attrs, ...customType.props}"
    :value="innerValue"
  />
  <template v-else>
    <span
      v-bind="attrs"
      :class="`UiOutput UiOutput--${props.type || 'text'}`"
      v-text="displayValue"
    />
  </template>
</template>