<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '../../../../ui/components'

const props = defineProps({
  modelValue: {
    required: false,
    default: null,
    validator: () => true,
  },
})

const emit = defineEmits(['update:modelValue'])
function emitUpdate() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerModel.value)))
}

const innerModel = ref(null)
watch(
  () => props.modelValue,
  (newValue) => {
    let clone = newValue ? JSON.parse(JSON.stringify(newValue)) : newValue
    innerModel.value = Object.assign({ eval: '' }, clone)
  },
  { immediate: true },
)
</script>

<template>
  <div class="StmtEval">
    <span>function($modelValue) {</span>
    <UiInput
      v-model="innerModel.eval"
      type="code"
      @update:modelValue="emitUpdate"
    />
    <span>}</span>
  </div>
</template>