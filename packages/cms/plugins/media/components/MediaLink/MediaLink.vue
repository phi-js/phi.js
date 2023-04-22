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

const $nav = inject('$_cms_navigation', null)
function onClick($event) {
  if (!props.pageHash) {
    return
  }

  $event.preventDefault()

  if (!$nav) {
    console.warn('No $_cms_navigation injection found')
    return
  }
  $nav.goTo(props.pageHash)
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
  <div class="MediaLink">
    <UiItem
      v-bind="innerValue"
      @click="onClick"
    />
  </div>
</template>

<style lang="scss">
.MediaLink {
  --ui-item-padding: 6px 18px;
  border-radius: 4px;
  font-weight: bold;
  color: inherit;

  cursor: pointer;
  &:hover {
    background-color: var(--ui-color-hover, rgba(255,255,255, 0.08));
  }

  // move icon to the right
  .UiItem {
    &__icon {
      color: var(--ui-color-primary);
      order: 1;
    }
  }
}
</style>