<script setup>
import { UiItem } from '../../UiItem'
import bytes from '../../../filters/bytes.js'

const props = defineProps({
  /*
  {
    url,
    thumbnail,
    title,
    name
    size
  }
  */
  value: {
    type: Object,
    required: false,
    default: null,
  },
})
</script>

<template>
  <a
    v-if="props.value"
    class="UiOutputUpload UiUpload__file"
    :title="props.value.name"
    target="_blank"
    :href="props.value.url"
    @click="$event => $event.stopPropagation()"
  >
    <UiItem
      :icon="props.value.thumbnail"
      :text="props.value.title || props.value.name"
      :subtext="bytes(props.value.size)"
    />
  </a>
</template>