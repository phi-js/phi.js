<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  // BLOCK object
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref({
  trackable: false,
  title: '',
})

watch(
  () => props.modelValue,
  () => {
    innerValue.value.trackable = props.modelValue?._plugin_api_storage?.trackable || false
    innerValue.value.title = props.modelValue?._plugin_api_storage?.title || ''
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', {
    ...props.modelValue,
    _plugin_api_storage: innerValue.value,
  })
}
</script>

<template>
  <div class="BlockApiStorage">
    <UiInput
      v-model="innerValue.trackable"
      type="checkbox"
      label="Track data changes"
      @update:model-value="emitUpdate"
    />
    <UiInput
      v-model="innerValue.title"
      type="text"
      label="Column title"
      @update:model-value="emitUpdate"
    />
  </div>
</template>