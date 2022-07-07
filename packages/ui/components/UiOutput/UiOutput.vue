<script setup>
import { shallowRef, watchEffect, computed, defineAsyncComponent } from 'vue'

const availableFormats = {
  date: defineAsyncComponent(() => import('./formats/date.vue')),
  image: defineAsyncComponent(() => import('./formats/image.vue')),
  upload: defineAsyncComponent(() => import('./formats/upload.vue')),
  location: defineAsyncComponent(() => import('./formats/location.vue')),
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
    innerValue.value = Array.isArray(props.value)
      ? props.value
      : props.value !== null
        ? [props.value]
        : []

    return
  }

  innerValue.value = props.value

  // If "oneOf", use option title as innerValue
  if (innerSchema.value?.oneOf?.length) {
    const foundItem = innerSchema.value.oneOf.find((item) => item?.const == props.value)
    if (foundItem) {
      innerValue.value = foundItem.title
    }
  }

  if (innerSchema.value.type == 'boolean') {
    if (innerValue.value === true) {
      innerValue.value = 'true'
    } else if (innerValue.value === false) {
      innerValue.value = 'false'
    }
  }

  // Sanitize urls
  if (['url', 'uri', 'uri-reference', 'iri', 'iri-reference'].includes(innerSchema.value.format)) {
    if (innerValue.value.substring(0, 4) != 'http') {
      innerValue.value = 'https://' + innerValue.value
    }
  }
})

const customComponent = computed(() => availableFormats[innerSchema.value.format])
</script>

<template>
  <div
    class="UiOutput"
    :class="`UiOutput--format-${innerSchema.format}`"
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
      :schema="innerSchema"
    />
    <template v-else-if="innerSchema.format == 'url' || innerSchema.format == 'link'">
      <a
        :href="innerValue"
        target="_blank"
        v-text="innerValue"
      />
    </template>
    <template v-else-if="innerSchema.format == 'email'">
      <a
        :href="'mailto:'+innerValue"
        target="_blank"
        v-text="innerValue"
      />
    </template>
    <template v-else>
      <span v-text="innerValue" />
    </template>
  </div>
</template>