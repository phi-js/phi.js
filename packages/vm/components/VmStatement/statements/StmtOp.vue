<script setup>
import { ref, computed, reactive, watch, nextTick, onBeforeMount, inject } from 'vue'

import { UiDetails } from '@/packages/ui'
import VmStatement from '../VmStatement.vue'
import baseOperators from '../operators'
import useModelSchema from '../useModelSchema'

const modelSchema = useModelSchema()

const injectedOperators = inject('$_vm_operators', [])
const allOperators = baseOperators.concat(injectedOperators)

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue'])

const innerModel = reactive({})
const detailsIsOpen = ref(false)

onBeforeMount(() => {
  if (!innerModel.field || !innerModel.op) {
    detailsIsOpen.value = true
  }

  if (innerModel.op === null) {
    innerModel.op = availableOperators.value?.[0]?.operator
    emitInput()
  }
})

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

const fieldSchema = computed(() => {
  if (!innerModel.field) {
    return null
  }

  let targetSchema = modelSchema.value

  const fieldName = innerModel.field.substring(0, 2) == '$.'
    ? innerModel.field.substring(2)
    : innerModel.field

  const parts = fieldName.split('.')
  const lastPart = parts[parts.length - 1]

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    targetSchema = targetSchema?.properties?.[part]
  }

  return targetSchema?.properties?.[lastPart]
})

const availableOperators = computed(() => {
  let fieldType = fieldSchema.value?.type || 'string'
  return allOperators.filter((op) => {
    return op.type == fieldType
    || (
      op.operator.substring(0, 5) === 'enum.'
      && (
        fieldSchema.value?.enum?.length
        || fieldSchema.value?.oneOf?.length
      )
    )
  })
})

const isKnownOperator = computed(() => {
  return (
    availableOperators.value.findIndex((opDef) => opDef.operator == innerModel?.op) >= 0
  )
})

const customArgsComponent = computed(() => {
  let operatorDefinition = availableOperators.value.find((opDef) => opDef.operator == innerModel.op)
  if (!operatorDefinition) {
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

const currentOperator = computed(() => availableOperators.value.find((opDef) => opDef.operator == innerModel?.op))

const operationRedaction = computed(() => {
  const fieldName = fieldSchema.value?.title || innerModel.field
  const opName = currentOperator.value?.text || innerModel.op
  const stringArgs = argsToString(innerModel.args)
  return {
    text: fieldName,
    subtext: `${opName} ${stringArgs}`,
  }
})

function argsToString(strArgs) {
  if (Array.isArray(strArgs)) {
    if (strArgs.length > 4) {
      return `${strArgs.length} items`
    }
    return strArgs.map((subArg) => argsToString(subArg)).join(', ')
  }

  if (!strArgs || typeof strArgs == 'object') {
    return ''
  }

  return strArgs
}
</script>

<template>
  <UiDetails
    v-model:open="detailsIsOpen"
    class="StmtOp"
    v-bind="operationRedaction"
  >
    <div class="StmtOp__body">
      <div
        v-if="!fieldSchema"
        class="StmtOp__field"
      >
        <input
          v-model="innerModel.field"
          type="text"
          class="UiInput"
          @input="emitInput"
        >
      </div>

      <div
        v-if="availableOperators?.length > 1"
        class="StmtOp__op"
      >
        <select
          v-model="innerModel.op"
          class="UiInput"
          @change="onChangeOp()"
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
            Custom:
          </option>
          <option
            v-else
            :value="null"
          >
            Custom:
          </option>
        </select>

        <input
          v-show="!isKnownOperator"
          ref="optionOther"
          v-model="innerModel.op"
          type="text"
          class="UiInput"
          @input="emitInput"
        >
      </div>

      <div class="StmtOp__arguments">
        <component
          :is="customArgsComponent.component"
          v-if="customArgsComponent?.component"
          v-model="innerModel.args"
          v-bind="customArgsComponent.props"
          :field-schema="fieldSchema"
          @update:model-value="emitInput"
        />
        <VmStatement
          v-else-if="customArgsComponent !== false"
          v-model="innerModel.args"
          @update:model-value="emitInput"
        />
      </div>
    </div>
  </UiDetails>
</template>