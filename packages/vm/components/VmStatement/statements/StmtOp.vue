<script setup>
import { ref, unref, computed, reactive, watch, nextTick, onBeforeMount } from 'vue'
import { UiItem } from '@/packages/ui/components'
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

onBeforeMount(() => {
  if (innerModel.op === null) {
    innerModel.op = availableOperators.value?.[0]?.operator
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
  return unref(modelSchema)?.properties?.[innerModel.field]
})

const availableOperators = computed(() => {
  let fieldType = fieldSchema.value?.type || 'string'
  return allOperators.filter((op) => {
    return op.type == fieldType
      || (op.operator.substring(0, 5) === 'enum.' && fieldSchema.value?.enum?.length)
      || (op.operator.substring(0, 5) === 'enum.' && fieldType == 'array')
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
  const fieldName = fieldSchema.value?.info?.text || innerModel.field
  const opName = currentOperator.value?.text || innerModel.op
  return `${fieldName} ${opName} ...`
})
</script>

<template>
  <details class="StmtOp">
    <summary v-text="operationRedaction" />

    <section>
      <div class="StmtOp__field">
        <UiItem
          v-if="fieldSchema?.info"
          v-bind="fieldSchema.info"
        />
        <input
          v-else
          v-model="innerModel.field"
          type="text"
          class="UiInput"
          @input="emitInput"
        >
      </div>

      <div class="StmtOp__op">
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
    </section>
  </details>
</template>