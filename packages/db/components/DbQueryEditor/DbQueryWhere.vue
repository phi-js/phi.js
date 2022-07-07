<script setup>
import { ref, watch } from 'vue'
import { VmStatement } from '@/packages/vm'

const props = defineProps({
  /*
  A WHERE object (vm statement):

  {
    "where": {
      "and": [
        ...
      ]
    }
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },

  schema: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerWhere = ref()
watch(
  () => props.modelValue,
  (newValue) => innerWhere.value = typeof newValue === 'object' && !!newValue
    ? JSON.parse(JSON.stringify(newValue))
    : { and: [] },

  { immediate: true },
)

function emitUpdate() {
  if (Array.isArray(innerWhere.value?.and) && !innerWhere.value.and.length) {
    emit('update:modelValue', null)
    return
  }

  emit('update:modelValue', { ...innerWhere.value })
}
</script>

<template>
  <VmStatement
    v-model="innerWhere"
    class="DbQueryWhere"
    :model-schema="props.schema"
    @update:model-value="emitUpdate()"
  />
</template>