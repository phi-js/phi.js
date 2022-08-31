<script setup>
import { ref, watch } from 'vue'
import CmsPropInput from '../../../../components/CmsPropInput/CmsPropInput.vue'

const props = defineProps({
  /*
  BLOCK object
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
  (newValue) => block.value = {
    props: {},
    ...newValue,
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...block.value })
}
</script>

<template>
  <div class="DataFormSettings">
    <CmsPropInput
      v-model="block.props.acceptLabel"
      label="Accept"
      @update:model-value="emitUpdate()"
    />
    <CmsPropInput
      v-model="block.props.cancelLabel"
      label="Cancel"
      @update:model-value="emitUpdate()"
    />
    <CmsPropInput
      v-model="block.props.deleteLabel"
      label="Delete"
      @update:model-value="emitUpdate()"
    />
    <CmsPropInput
      v-model="block.props.deleteConfirm"
      label="Delete warning message"
      @update:model-value="emitUpdate()"
    />
  </div>
</template>