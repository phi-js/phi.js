<script setup>
import { ref, computed, reactive, watch, nextTick } from 'vue'
import { UiInput, UiItem } from '/packages/ui/components'
import VmStatement from '../VmStatement.vue'
import allOperators from '../operators'
import useModelSchema from '../useModelSchema'

const modelSchema = useModelSchema()

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue'])

const innerModel = reactive({})

const fieldSchema = computed(() => {
  if (!innerModel.field) {
    return null
  }
  return modelSchema?.properties?.[innerModel.field]
})

const availableOperators = computed(() => {
  let fieldType = fieldSchema.value?.type || 'string'
  return allOperators.filter((op) => op.type == fieldType || !op.type)
})


const isKnownOperator = computed(() => {
  return (
    availableOperators.value.findIndex((opDef) => opDef.operator == innerModel?.op) >= 0
  )
})

const customArgsComponent = computed(() => {
  let operatorDefinition = availableOperators.value.find((opDef) => opDef.operator == innerModel?.op)
  if (!operatorDefinition) {
    // Fallback: Si hay un esquema con ENUM, mostrar simplemente un picker
    if (fieldSchema.value?.enum) {
      return {
        component: UiInput,
        props: {
          type: 'select',
          multiple: false,
          options: fieldSchema.value.enum,
        },
      }
    }

    return null
  }

  return operatorDefinition?.editor
})


const optionOther = ref()

function emitInput() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerModel)))
}

function onChangeOp() {
  emitInput()
  // Focus "custom" textarea
  if (!innerModel.op) {
    try {
      nextTick(() => optionOther.value.focus())
    } catch (e) {
      // shhh
    }
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    let clone = newValue ? JSON.parse(JSON.stringify(newValue)) : newValue

    Object.assign(
      innerModel,
      {
        op: null,
        field: null,
        args: clone.args,
      },
      innerModel,
      clone,
    )
  },
  { immediate: true },
)
</script>

<template>
  <div class="StmtOp">
    <div class="ui-row --top">
      <div style="flex:3">
        <UiItem
          v-if="fieldSchema"
          v-bind="fieldSchema"
        />
        <input
          v-else
          v-model="innerModel.field"
          type="text"
          class="ui-native op-field-input"
          @input="emitInput"
        >
      </div>

      <div
        class="op-picker"
        style="flex:3"
      >
        <select
          v-model="innerModel.op"
          class="op-picker-select"
          @change="emitInput(); onChangeOp();"
        >
          <option
            v-for="(opDef, i) in availableOperators"
            :key="i"
            :value="opDef.operator"
          >
            {{ opDef.text }}
          </option>

          <option
            v-if="!isKnownOperator"
            :value="innerModel.op"
          >
            Otro:
          </option>
          <option
            v-else
            :value="null"
          >
            -- Custom --
          </option>
        </select>

        <input
          v-show="!isKnownOperator"
          ref="optionOther"
          v-model="innerModel.op"
          type="text"
          class="ui-native op-option-other"
          @input="emitInput"
        >
      </div>

      <div
        class="op-args"
        style="flex:4"
      >
        <component
          :is="customArgsComponent.component"
          v-if="customArgsComponent"
          v-model="innerModel.args"
          v-bind="customArgsComponent.props"
          :field-schema="fieldSchema"
          @input="emitInput"
        />
        <VmStatement
          v-else
          v-model="innerModel.args"
          @input="emitInput"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.StmtOp {
  .op-picker {
    text-align: center;
  }

  .op-picker-select {
    padding: var(--ui-padding);
    border: 0;
    background: transparent;
    font-family: var(--ui-font-secondary);
    font-weight: bold;
  }
}
</style>