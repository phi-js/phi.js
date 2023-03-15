<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  BLOCK object
  {
    component: 'ChartJs',
    props: {
      type: 'bar',
      data: {}
    }
  }
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
  () => block.value = { ...props.modelValue },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...block.value })
}

const availableTypes = [
  { value: 'bar', text: 'Bar' },
  { value: 'pie', text: 'Pie' },
  { value: 'line', text: 'Line' },
  { value: 'polarArea', text: 'Polar Area' },
  { value: 'bubble', text: 'Bubble' },
  { value: 'doughnut', text: 'Doughnut' },
  { value: 'radar', text: 'Radar' },
  { value: 'scatter', text: 'Scatter' },
]
</script>

<template>
  <div class="ChartJsSettings">
    <UiInput
      v-model="block.props.type"
      label="Type"
      type="select-native"
      :options="availableTypes"
      @update:model-value="emitUpdate"
    />

    <UiInput
      v-model="block.props.data"
      label="Data"
      type="json"
      @update:model-value="emitUpdate"
    />
  </div>
</template>