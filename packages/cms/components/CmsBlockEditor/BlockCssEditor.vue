<script setup>
import { UiTabs, UiTab } from '@/packages/ui'
import BlockCssClasses from './BlockCssClasses.vue'
import BlockCssStyle from './BlockCssStyle.vue'

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
</script>

<template>
  <UiTabs
    class="BlockCssEditor"
    name="BlockCssEditor"
  >
    <slot name="default" />

    <UiTab text="Properties">
      <BlockCssStyle
        :block="props.modelValue"
        @update:block="emit('update:modelValue', $event)"
      />
    </UiTab>

    <UiTab text="Classes">
      <BlockCssClasses
        :block="props.modelValue"
        @update:block="emit('update:modelValue', $event)"
      />
    </UiTab>
  </UiTabs>
</template>