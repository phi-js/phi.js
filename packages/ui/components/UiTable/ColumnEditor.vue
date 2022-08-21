<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  Column object
  {
    "title": "Fecha"
    "value": "$.objRecord.date",
    "format": "date",
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref([])

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = newValue ? { ...newValue } : {}
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...innerValue.value })
}
</script>

<template>
  <div class="ColumnEditor">
    <UiInput
      v-model="innerValue.title"
      type="text"
      label="Title"
      @update:model-value="emitUpdate"
    />
    <!-- <UiInput
      v-model="innerValue.format"
      type="text"
      label="Format"
      @update:model-value="emitUpdate"
    /> -->
    <!-- <details>
      <summary>Advanced</summary>
      <section>
        <UiInput
          v-model="innerValue"
          type="json"
          @update:model-value="emitUpdate"
        />
      </section>
    </details> -->
  </div>
</template>