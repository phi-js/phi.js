<script setup>
import { inject } from 'vue'
import { UiButton } from '../../../../../ui/components'

const props = defineProps({
  icon: {
    type: String,
    required: false,
    default: null,
  },

  text: {
    type: String,
    required: false,
    default: null,
  },

  subtext: {
    type: String,
    required: false,
    default: null,
  },
})

const injectedStory = inject('$_cms_story', null)

function onClick() {
  if (!injectedStory) {
    console.warn('No $_cms_story injection found')
    return
  }

  injectedStory.goBack()
}
</script>

<template>
  <UiButton
    class="NavigationBack"
    :icon="props.icon || 'mdi:arrow-left-thick'"
    :label="props.text || 'Back'"
    :subtext="props.subtext"
    @click="onClick()"
  />
</template>