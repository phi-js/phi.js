<script setup>
import { onMounted, inject } from 'vue'

const emit = defineEmits(['mounted', 'submit', 'change'])
const injectedStory = inject('$_cms_story', null)

onMounted(() => emit('mounted'))

function onFormSubmit($event) {
  // If a 'story-goto' value is present in the form data
  // with either "next", "back" or a page id,
  // navigate accordingly

  // https://stackoverflow.com/a/69986560/3934387
  let data = new FormData($event.target)
  if ($event.submitter) {
    data.append($event.submitter.name, $event.submitter.value)
  }

  let goTo = data.get('story-goto')
  switch (goTo) {
  case 'next':
    injectedStory?.goNext?.()
    break

  case 'back':
    injectedStory?.goBack?.()
    break

  case '':
  case 0:
  case null:
  case undefined:
    /// zzzz
    break

  default:
    injectedStory?.goTo?.(goTo)
    break
  }

  emit('submit', $event)
}

function onFormChange($event) {
  emit('change', $event)
}
</script>

<template>
  <form
    class="LayoutPage"
    @submit.prevent="onFormSubmit"
    @change="onFormChange"
  >
    <div
      v-if="$slots.header"
      class="LayoutPage__header"
    >
      <slot name="header" />
    </div>

    <div class="LayoutPage__contents">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="LayoutPage__footer"
    >
      <slot name="footer" />
    </div>
  </form>
</template>