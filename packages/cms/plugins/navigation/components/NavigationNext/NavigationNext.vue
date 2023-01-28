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
// function onClick() {
//   if (!injectedStory) {
//     console.warn('No $_cms_story injection found')
//     return
//   }
//   injectedStory.goNext()
// }
</script>

<template>
  <!--
  Careful: if the button is disabled, or hidden via v-if
  based on conditions from injectedStory.nav  (e.g. v-if="injectedStory.nav.value.next")
  the parent <form> onsubmit event will NOT be triggered (!) (<form> in LayoutPage.vue)

  The button's onClick is run FIRST, which in turn calls injectedStory.goNext(), which CHANGES the values of
  injectedStory.nav, which disables/hides the button.  Since the button is disabled/destroyed, onSubmit is NOT called
  --->
  <UiButton
    v-show="!injectedStory?.nav?.value || injectedStory?.nav?.value?.next"
    xxx-v-if="!injectedStory.nav?.value || injectedStory.nav.value.next"
    xxx-disabled="injectedStory.nav?.value && !injectedStory.nav.value.next"
    type="submit"
    class="NavigationNext"
    :icon="props.icon || 'mdi:arrow-right-thick'"
    :label="props.text || 'Next'"
    :subtext="props.subtext"
    xxxx-click="onClick()"
    name="story-goto"
    value="next"
  />
  <!-- instead of an onClick event, the LayoutPage.vue onSubmit handler looks for a "story-goto" value in the form  -->
</template>