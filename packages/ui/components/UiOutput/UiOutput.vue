<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { computed, defineAsyncComponent, useAttrs } from 'vue'

import { injectedTypes } from '.'

const attrs = useAttrs()

const availableTypes = {
  currency: defineAsyncComponent(() => import('./types/currency.vue')),
  date: defineAsyncComponent(() => import('./types/date.vue')),
  datetime: defineAsyncComponent(() => import('./types/datetime.vue')),
  email: defineAsyncComponent(() => import('./types/email.vue')),
  enum: defineAsyncComponent(() => import('./types/enum.vue')),
  geo: defineAsyncComponent(() => import('./types/geo.vue')),
  image: defineAsyncComponent(() => import('./types/image.vue')),
  time: defineAsyncComponent(() => import('./types/time.vue')),
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
})

const customType = computed(() => {
  if (attrs.component && typeof attrs.component == 'object') {
    return {
      component: attrs.component,
      props: attrs.props,
    }
  }

  if (Array.isArray(attrs.enum)) {
    return {
      component: availableTypes.enum,
      props: { options: attrs.enum },
    }
  }

  return {
    component: availableTypes[props.type] || injectedTypes[props.type],
    props: attrs,
  }
})
</script>

<template>
  <Component
    :is="customType.component"
    v-if="customType.component"
    class="UiOutput"
    :class="`UiOutput--${props.type}`"
    v-bind="customType.props"
    :value="props.value"
  />
  <ul
    v-else-if="props.type == 'array'"
    v-bind="attrs"
    class="UiOutput UiOutput--list"
  >
    <li
      v-for="(item, index) in props.value"
      :key="index"
    >
      <UiOutput
        v-bind="attrs.items"
        :value="item"
      />
    </li>
  </ul>
  <template v-else>
    <span
      v-bind="attrs"
      :class="`UiOutput UiOutput--${props.type || 'text'}`"
      v-text="props.value"
    />
  </template>
</template>