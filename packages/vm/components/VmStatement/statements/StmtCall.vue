<script setup>
import { ref, watch, computed, defineAsyncComponent } from 'vue'
import { registeredFunctions } from '../../../plugins/registerPlugin.js'

import VmStatement from '../VmStatement.vue'

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
    innerModel.value = Object.assign(
      {
        call: null,
        args: {},
      },
      clone,
    )
  },
  { immediate: true },
)

const editor = computed(() => {
  const candidate = registeredFunctions?.[props.modelValue?.call]?.editor
  if (!candidate) {
    return null
  }

  if (typeof candidate.component === 'function') {
    candidate.component = defineAsyncComponent(candidate.component)
  }
  return candidate
})
</script>

<template>
  <div class="StmtCall">
    <component
      :is="editor.component"
      v-if="editor && editor['v-model'] == 'args'"
      v-model="innerModel.args"
      v-bind="editor.props"
      @update:model-value="emitUpdate"
    />

    <component
      :is="editor.component"
      v-else-if="editor"
      v-model="innerModel"
      v-bind="editor.props"
      @update:model-value="emitUpdate"
    />
    <VmStatement
      v-else
      v-model="innerModel.args"
      @update:model-value="emitUpdate"
    />
  </div>
</template>