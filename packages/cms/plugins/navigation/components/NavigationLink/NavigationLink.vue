<script setup>
import { UiButton } from '../../../../../ui/components'

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

  vm: {
    type: Object,
    required: false,
    default: null,
  },
})

function onClick() {
  if (!props.vm) {
    console.warn('No VM found')
    return
  }

  props.vm.eval({
    call: 'Story.goTo',
    args: props.pageId,
  })
}
</script>

<template>
  <UiButton
    class="NavigationLink"
    :label="props.text || props.pageId"
    :subtext="props.subtext"
    @click="onClick()"
  />
</template>