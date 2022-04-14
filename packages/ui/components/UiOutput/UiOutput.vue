<script setup>
import { shallowRef, watchEffect, computed, defineAsyncComponent } from 'vue'

const availableTypes = {
  date: defineAsyncComponent(() => import('./types/date.vue')),
  image: defineAsyncComponent(() => import('./types/image.vue')),
  upload: defineAsyncComponent(() => import('./types/upload.vue')),
}

const props = defineProps({
  value: {
    validator: () => true,
    required: false,
    default: null,
  },

  schema: {
    type: Object,
    required: false,
    default: null,
  },
})

const innerValue = shallowRef()
const innerSchema = shallowRef()

watchEffect(() => {
  innerSchema.value = props.schema && typeof props.schema == 'object'
    ? props.schema
    : { type: 'string' }

  if (innerSchema.value.type == 'array') {
    innerValue.value = Array.isArray(props.value) ? props.value : props.value !== null ? [props.value] : []
  } else {
    innerValue.value = props.value
  }
})

const customComponent = computed(() => availableTypes[innerSchema.value.type])
</script>

<template>
  <div
    class="UiOutput"
    :class="`UiOutput--type-${innerSchema.type}`"
  >
    <template v-if="innerValue === null">
      <!-- NULL -->
    </template>
    <ul v-else-if="innerSchema.type == 'array'">
      <li
        v-for="(item, i) in innerValue"
        :key="i"
      >
        <UiOutput
          :value="item"
          :schema="innerSchema.items"
        />
      </li>
    </ul>
    <Component
      :is="customComponent"
      v-else-if="customComponent"
      :value="innerValue"
    />
    <template v-else-if="innerSchema.type == 'boolean'">
      <em>{{ innerValue ? 'true' : 'false' }}</em>
    </template>
    <template v-else>
      <span v-text="innerValue" />
    </template>
  </div>
</template>