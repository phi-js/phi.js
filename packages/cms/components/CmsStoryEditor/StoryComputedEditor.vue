<script setup>
import { ref, watch } from 'vue'
import { UiDetails, UiInput, UiItem } from '@/packages/ui'
import { VmStatement } from '@/packages/vm'

const props = defineProps({
  /* An array of computed variable declarations
  [
    {
      "name": "Variable name",
      "statement": { // vm statement.  e.g.:
        {"eval": "return parseInt($modelValue.number1) + parseInt($modelValue.number2)"}
      }
    }
  ]
  */
  modelValue: {
    type: Array,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const computedVariables = ref([])
watch(
  () => props.modelValue,
  (newValue) => computedVariables.value = Array.isArray(newValue) ? newValue.concat([]) : [],
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', [...computedVariables.value])
}

const openDetailIndexes = ref([])

function appendVariable() {
  const varName = window.prompt('Variable name')
  if (!varName) {
    return
  }

  const found = computedVariables.value.find((v) => v.name == varName)
  if (found) {
    alert(`Variable '${varName}' already exists`)
    return
  }

  computedVariables.value.push({
    name: varName,
    statement: { eval: '' },
  })

  emitUpdate()
  openDetailIndexes.value.push(computedVariables.value.length - 1)
}

function deleteVariableAt(i) {
  computedVariables.value.splice(i, 1)
  emitUpdate()
}
</script>

<template>
  <div class="StoryComputedEditor">
    <UiDetails
      v-for="(computation, i) in computedVariables"
      :key="i"
      class="StoryComputedEditor__variable"
      :text="computation.name || '...'"
      :open="openDetailIndexes.includes(i)"
      @delete="deleteVariableAt(i)"
      @close="openDetailIndexes.splice(openDetailIndexes.indexOf(i), 1)"
    >
      <UiInput
        v-model="computedVariables[i].name"
        type="text"
        label="Variable name"
        @update:model-value="emitUpdate()"
      />
      <VmStatement
        v-model="computedVariables[i].statement"
        @update:model-value="emitUpdate()"
      />
    </UiDetails>

    <UiItem
      class="StoryComputedEditor__adder"
      text="Create computed variable"
      icon="mdi:plus"
      tabindex="0"
      @click="appendVariable"
      @keyup.enter="appendVariable"
    />
  </div>
</template>