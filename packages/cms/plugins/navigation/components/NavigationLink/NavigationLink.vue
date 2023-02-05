<script setup>
import { inject, computed } from 'vue'
import { UiButton } from '@/packages/ui'

const props = defineProps({
  pageId: {
    type: String,
    required: false,
    default: null,
  },

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
const isVisible = computed(() => {
  if (!injectedStory?.getPageById) { // Happens if this component is called inside CmsStoryEditor
    return true
  }
  // Do not render button if the target page is not valid
  return !!injectedStory.getPageById(props.pageId)
})

const buttonProps = computed(() => {
  return {
    class: [
      'NavigationLink',
      `NavigationLink--${props.pageId}`,
      { 'UiButton--error': !props.pageId },
    ],
    label: props.text || props.pageId,
    subtext: props.subtext,
    icon: props.icon || (
      props.pageId == 'next' ? 'mdi:arrow-right-thick'
        : props.pageId == 'back' ? 'mdi:arrow-left-thick'
          : null
    ),
    type: props.pageId == 'back' ? 'button' : 'submit',
    onClick: props.pageId == 'back' && injectedStory?.getPageById ? () => history.back() : null,
  }
})
</script>

<template>
  <UiButton
    v-if="isVisible"
    name="story-goto"
    :value="props.pageId"
    v-bind="buttonProps"
  />
</template>

<style lang="scss">
.NavigationLink {
  // move icon to the fron
  .UiIcon {
    order: 1;
  }
  // except for "back" buttons
  &--back {
    .UiIcon {
      order: 0;
    }
  }
}
</style>