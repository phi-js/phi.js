<script setup>
// import { inject } from 'vue'

import { UiTabs, UiTab } from '@/packages/ui'
import BlockCssClasses from './BlockCssClasses.vue'
import BlockCssStyle from './BlockCssStyle.vue'
// import CssClassManager from '../CssClassManager/CssClassManager.vue'

const props = defineProps({
  /**
   * @model Block object
   */
  modelValue: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

// const injectedStoryBuilder = inject('$_cms_story_builder', { story: null })
</script>

<template>
  <UiTabs
    class="BlockCssEditor"
    name="BlockCssEditor"
  >
    <slot name="default" />

    <UiTab text="Classes">
      <BlockCssClasses
        :block="props.modelValue"
        @update:block="emit('update:modelValue', $event)"
      />

      <!-- <CssClassManager v-model="injectedStoryBuilder.story.value.stylesheets" /> -->
    </UiTab>

    <UiTab text="Properties">
      <BlockCssStyle
        :block="props.modelValue"
        @update:block="emit('update:modelValue', $event)"
      />
    </UiTab>
  </UiTabs>
</template>