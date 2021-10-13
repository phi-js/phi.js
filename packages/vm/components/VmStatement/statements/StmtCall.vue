<script setup>
import { ref, watch, computed, defineAsyncComponent } from 'vue'
import functionDefinitions from '../functions'
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
  const candidate = functionDefinitions?.[props.modelValue?.call]?.editor
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
    <input
      v-model="innerModel.call"
      type="text"
      class="ui-native"
      @input="emitUpdate"
    >
    <component
      :is="editor.component"
      v-if="editor"
      v-model="innerModel"
      v-bind="editor.props"
      @update:modelValue="emitUpdate"
    />
    <VmStatement
      v-else
      v-model="innerModel.args"
      @update:modelValue="emitUpdate"
    />
  </div>
</template>