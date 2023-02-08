<script setup>
import { ref, onMounted, inject, provide } from 'vue'

const emit = defineEmits(['mounted', 'submit', 'change'])
const injectedStory = inject('$_cms_story', null)

onMounted(() => emit('mounted'))


const onBeforeSubmit = []
provide('_LayoutPage_onBeforeSubmit', (callable) => onBeforeSubmit.push(callable))

const isSubmitting = ref(false)

async function onFormSubmit($event) {

  if (isSubmitting.value) {
    return
  }
  isSubmitting.value = true

  // // Run all onBeforeSubmit callbacks (one by one)
  // for (let i = 0; i < onBeforeSubmit.length; i++) {
  //   const res = await onBeforeSubmit[i]($event)
  //   if (res === false) {
  //     return false
  //   }
  // }

  // Run all onBeforeSubmit callbacks (concurrently)
  const results = await Promise.allSettled(onBeforeSubmit.map((callback) => callback($event)))
  if (results.some((outcome) => outcome.status == 'rejected' || outcome.value === false)) {
    isSubmitting.value = false
    return false
  }

  isSubmitting.value = false

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