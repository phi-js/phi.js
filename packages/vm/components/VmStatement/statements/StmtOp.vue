<script setup>
import { ref, computed, watch, nextTick, onBeforeMount, inject } from 'vue'

import { UiDetails } from '@/packages/ui'
import VmStatement from '../VmStatement.vue'
import baseOperators from '../operators'

import useVmI18n from '../../../i18n'
const i18n = useVmI18n()

const availableFields = inject('$_vm_fields')
const injectedOperators = inject('$_vm_operators', [])
const allOperators = baseOperators.concat(injectedOperators)

const props = defineProps({

  /*
  OP Object
  {
    "field": "some.field.name",
    "op": "string.eq",
    "args": "Hello"
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
    let clone = newValue ? JSON.parse(JSON.stringify(newValue)) : newValue

    innerModel.value = {
      op: null,
      field: null,
      args: clone?.args,
      ...clone,
    }
  },
  { immediate: true },
)


const detailsIsOpen = ref(false)
onBeforeMount(() => {
  if (!innerModel.value.field || !innerModel.value.op) {
    detailsIsOpen.value = true
  }

  if (innerModel.value.op === null) {
    innerModel.value.op = availableOperators.value?.[0]?.operator
    emitInput()
  }
})



function findField(targetValue, availableFields) {
  if (!availableFields || !availableFields.length) {
    return null
  }

  for (let field of availableFields) {
    if (field.value == targetValue) {
      return field
    }

    if (field?.children?.length) {
      const foundChild = findField(targetValue, field.children)
      if (foundChild) {
        return foundChild
      }
    }
  }
  return null
}

const currentField = computed(() => {
  return findField(innerModel.value.field, availableFields?.value)
})

const translatedOperators = computed(() => {
  return allOperators.map((op) => ({
    ...op,
    text: i18n.t(`StmtOp.operator.${op.operator}.title`, null, ''),
    subtext: i18n.t(`StmtOp.operator.${op.operator}.description`, null, ''),
  }))
})

const availableOperators = computed(() => {
  if (!currentField.value?.type) {
    return translatedOperators.value
  }

  return translatedOperators.value.filter((op) => {
    return op.type == currentField.value?.type
    || (
      op.operator.substring(0, 5) === 'enum.'
      && (currentField.value?.enum?.length || currentField.value?.oneOf?.length)
    )
  })
})

const isKnownOperator = computed(() => {
  return (
    availableOperators.value.findIndex((opDef) => opDef.operator == innerModel.value?.op) >= 0
  )
})

const customArgsComponent = computed(() => {
  let operatorDefinition = availableOperators.value.find((opDef) => opDef.operator == innerModel.value.op)
  if (!operatorDefinition) {
    return null
  }

  return operatorDefinition?.editor
})


const optionOther = ref()

function emitInput() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerModel.value)))
}

function onChangeOp() {
  emitInput()

  // Focus "custom" textarea
  if (!innerModel.value.op) {
    try {
      nextTick(() => optionOther.value.focus())
    } catch (e) {
      // shhh
    }
  }
}

const currentOperator = computed(() => availableOperators.value.find((opDef) => opDef.operator == innerModel.value?.op))

const operationRedaction = computed(() => {
  const fieldName = currentField.value?.text || innerModel.value.field
  const opName = currentOperator.value?.text ? currentOperator.value?.text + ' ' : ''
  const stringArgs = argsToString(innerModel.value.args)
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
        v-if="!currentField"
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
          xxxxfield-schema="fieldSchema"
          :field="currentField"
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