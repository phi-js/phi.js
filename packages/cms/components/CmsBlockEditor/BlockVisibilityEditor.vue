<script setup>
import { ref, watch } from 'vue'
import { VmStatement } from '../../../vm/components'
import { UiInput } from '../../../ui/components'

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
    block.value = newValue
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...block.value })
}

</script>

<template>
  <VmStatement
    v-model="block['v-if']"
    :default="{ and: [] }"
    @update:model-value="emitUpdate"
  />
</template>