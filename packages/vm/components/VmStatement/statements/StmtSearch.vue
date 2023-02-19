<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  SEARCH statement
  {
    "search": {
      "string": "",
      "fields": ["field1", "field2", "field2"]
    }
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue'])

const innerModel = ref({})

watch(
  () => props.modelValue,
  (newValue) => {
    innerModel.value = {
      search: {
        string: newValue?.search?.string || '',
        fields: newValue?.search?.fields,
      },
    }
  },
  { immediate: true },
)

function emitInput() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerModel.value)))
}
</script>

<template>
  <UiInput
    v-model="innerModel.search.string"
    class="StmtSearch"
    type="search"
    placeholder="Buscar"
    @update:model-value="emitInput"
  />
</template>

<style lang="scss">
.StmtSearch {
  padding: 8px;
  input {
    width: 100%;
  }
}
</style>