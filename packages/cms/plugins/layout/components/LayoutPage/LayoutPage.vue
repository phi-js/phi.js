<script setup>
import { ref, onMounted, inject, provide } from 'vue'

const injectedStory = inject('$_cms_story', null)

const props = defineProps({
  onSubmit: {
    type: [Function, Array],
    required: false,
    default: null,
  },
})

const emit = defineEmits(['mounted', 'change'])

onMounted(() => emit('mounted'))

const onBeforeSubmit = []
provide('_LayoutPage_onBeforeSubmit', (callable) => onBeforeSubmit.push(callable))

const isSubmitting = ref(false)

async function onFormSubmit($event) {
  if (isSubmitting.value) {
    return
  }

  const startTime = new Date()
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

  // Run @submit
  if (props.onSubmit) {
    const arrCallbacks = Array.isArray(props.onSubmit) ? props.onSubmit : [props.onSubmit]
    const results = await Promise.allSettled(arrCallbacks.map((callback) => callback($event)))
    if (results.some((outcome) => outcome.status == 'rejected' || outcome.value === false)) {
      isSubmitting.value = false
      return false
    }
  }

  /*
  Duration padding
  When a form submit happens TOO fast, the user may be left without a sense of confirmation.
  submitting a form is important! The user should now the thing ran.  Reacting INSTANTLY fast MAY not be the best experience
  Make sure the form stays in "submitting" state for ... half a second?
  */
  if (onBeforeSubmit.length) {
    const durationPadding = 400
    const endTime = new Date()
    const duration = endTime - startTime //in ms
    if (duration < durationPadding) {
      await new Promise((resolve) => setTimeout(resolve, durationPadding - duration))
    }
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
}

function onFormChange($event) {
  emit('change', $event)
}
</script>

<template>
  <form
    class="LayoutPage"
    :class="{'LayoutPage--submitting': isSubmitting}"
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