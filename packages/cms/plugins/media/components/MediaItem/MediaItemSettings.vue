<script setup>
import { ref, watch } from 'vue'
import { UiInput, UiIconPicker } from '@/packages/ui'
import CmsPropInput from '../../../../components/CmsPropInput/CmsPropInput.vue'

const props = defineProps({
  /**
   * BLOCK object
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref({ props: {} })
watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = { ...newValue }
    if (!innerValue.value.props) {
      innerValue.value.props = {}
    }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...innerValue.value })
}

</script>

<template>
  <div class="ItemSettings">
    <UiInput label="Icon">
      <UiIconPicker
        v-model="innerValue.props.icon"
        @update:model-value="emitUpdate"
      />
    </UiInput>
    <CmsPropInput
      v-model="innerValue.props.text"
      label="Text"
      @update:model-value="emitUpdate"
    />
    <CmsPropInput
      v-model="innerValue.props.subtext"
      label="Subtext"
      @update:model-value="emitUpdate"
    />
  </div>
</template>

<style lang="scss">
.ItemSettings {
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 16px;
}
</style>