<script setup>
import { ref, watch } from 'vue'
import { UiIcon } from '@/packages/ui'
import VmStatement from '../../VmStatement.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const innerValue = ref({})
const isIfStatement = ref(false)

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = JSON.parse(JSON.stringify(newValue))
    isIfStatement.value = innerValue.value?.do?.if !== undefined
  },
  { immediate: true },
)

function accept() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerValue.value)))
}
</script>

<template>
  <div class="StmtChainItem">
    <UiIcon
      class="StmtChainItem__handle"
      src="mdi:drag"
    />

    <VmStatement
      v-model="innerValue"
      class="StmtChainItem__statement"
      @update:model-value="accept()"
    />

    <div class="StmtChainItem__actions">
      <slot name="actions" />
    </div>
  </div>
</template>