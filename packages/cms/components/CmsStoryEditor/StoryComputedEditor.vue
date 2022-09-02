<script setup>
import { ref, watch } from 'vue'
import { UiDetails, UiInput } from '@/packages/ui'
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

function appendVariable() {
  computedVariables.value.push(newVariable.value)
  emitUpdate()
  resetNewVariable()
}

function deleteVariableAt(i) {
  computedVariables.value.splice(i, 1)
  emitUpdate()
}

const newVariable = ref()

function resetNewVariable() {
  newVariable.value = {
    name: '',
    statement: { eval: '' },
  }
}

// initialize
resetNewVariable()
</script>

<template>
  <div
    class="StoryComputedEditor"
  >
    <UiDetails
      v-for="(computation, i) in computedVariables"
      :key="i"
      group="StoryComputedEditor"
      class="StoryComputedEditor__variable"
      :text="computation.name || '...'"
      @delete="deleteVariableAt(i)"
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

    <UiDetails
      v-slot="{ close }"
      group="StoryComputedEditor"
      class="StoryComputedEditor__adder"
      text="Create computed variable"
    >
      <form
        @submit.prevent="appendVariable(); close();"
      >
        <UiInput
          v-model="newVariable.name"
          type="text"
          label="Variable name"
          @update:model-value="emitUpdate()"
        />

        <VmStatement
          v-model="newVariable.statement"
          @update:model-value="emitUpdate()"
        />

        <footer>
          <button
            type="submit"
            class="UiButton"
          >
            Create
          </button>
          <button
            type="button"
            class="UiButton UiButton--cancel"
            @click="resetNewVariable(); close();"
          >
            Cancel
          </button>
        </footer>
      </form>
    </UiDetails>
  </div>
</template>