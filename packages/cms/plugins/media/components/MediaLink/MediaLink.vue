<script setup>
import { inject, computed } from 'vue'
import { UiItem } from '@/packages/ui'

const props = defineProps({
  href: {
    type: String,
    required: false,
    default: '',
  },

  target: {
    type: String,
    required: false,
    default: '',
  },

  text: {
    type: String,
    required: false,
    default: '',
  },

  subtext: {
    type: String,
    required: false,
    default: '',
  },

  icon: {
    type: String,
    required: false,
    default: '',
  },

  pageHash: {
    type: String,
    required: false,
    default: null,
  },
})

const injectedStory = inject('$_cms_story', null)
function onClick($event) {
  if (!props.pageHash) {
    return
  }

  $event.preventDefault()

  if (!injectedStory) {
    console.warn('No $_cms_story injection found')
    return
  }
  injectedStory.goTo(props.pageHash)
}

const innerValue = computed(() => ({
  ...props,

  href: props.href || (props.pageHash ? `#/${props.pageHash}` : '#'),
  target: props.target || '_blank',

  text: props.text || props.href || 'Sin título',
  // icon: props.icon || (props.pageHash ? 'mdi:arrow-right-thick' : 'mdi:open-in-new'),
  icon: props.href && props.target == '_blank' ? 'mdi:open-in-new' : props.icon,
}))
</script>

<template>
  <a
    class="MediaLink"
    :href="innerValue.href"
    :target="innerValue.target"
    style="display:block"
    @click="onClick"
  >
    <UiItem
      :text="innerValue.text"
      :subtext="innerValue.subtext"
      :icon="innerValue.icon"
    />
  </a>
</template>