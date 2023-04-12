<script setup>
import { computed, inject, useAttrs } from 'vue'
import { UiInput } from '@/packages/ui'

const $nav = inject('$_cms_navigation', null)
const attrs = useAttrs()

function onButtonClick() {
  if (attrs.type != 'submit' && attrs.name == 'story-goto' && attrs.value && $nav?.goTo) {
    $nav.goTo(attrs.value)
  }
}

const buttonIcon = computed(() => {
  if (attrs.icon) {
    return attrs.icon
  }
  if (attrs.name == 'story-goto') {
    return attrs.value == 'back' ? 'mdi:arrow-left-thick' : 'mdi:arrow-right-thick'
  }
  return null
})
</script>

<template>
  <UiInput
    class="InputButton"
    :class="{
      'InputButton--nav': attrs.name == 'story-goto',
      'InputButton--next': attrs.name == 'story-goto' && attrs.value == 'next',
      'InputButton--back': attrs.name == 'story-goto' && attrs.value == 'back',
    }"
    type="button"
    :icon="buttonIcon"
    @click="onButtonClick"
  />
</template>

<style lang="scss">
.InputButton {
  max-width: 300px;

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