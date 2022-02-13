<script setup>
import { ref, watch } from 'vue'
import { UiInputJson } from '../../../ui/components'
import BlockClassPicker from './BlockClassPicker.vue'

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

const block = ref()

watch(
  () => props.modelValue,
  (newValue) => {
    block.value = { ...newValue }
    if (!block.value.props) {
      block.value.props = {}
    }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', block.value)
}
</script>

<template>
  <div class="BlockStyleEditor">
    <BlockClassPicker
      v-model="block.props.class"
      @update:model-value="emitUpdate"
    />

    <UiInputJson
      v-model="block.props.style"
      @update:model-value="emitUpdate"
    />
  </div>
</template>