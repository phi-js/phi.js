<script setup>
import { inject } from 'vue'
import { UiTabs, UiTab, UiInput } from '@/packages/ui'
import { getPluginData } from '../../functions'

const storyFields = inject('$_vm_fields', [])

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const pluginData = getPluginData()
const customSlotComponent = pluginData.getSlotComponent('StoryModelValue')

</script>

<template>
  <div class="CmsStoryVariables">
    <UiTabs>
      <UiTab text="Variables">
        <UiInput
          type="json"
          :model-value="props.modelValue"
          @update:model-value="emit('update:modelValue', $event)"
        />
      </UiTab>
      <UiTab
        v-if="customSlotComponent"
        text="Load data"
      >
        <Component
          :is="customSlotComponent"
          :model-value="props.modelValue"
          @update:model-value="emit('update:modelValue', $event)"
        />
      </UiTab>
      <UiTab text="Directory">
        <pre>storyFields: {{ storyFields }}</pre>
      </UiTab>
    </UiTabs>
  </div>
</template>