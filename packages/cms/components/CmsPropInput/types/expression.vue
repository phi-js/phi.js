<script setup>
import { ref, watch, computed, inject } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'

const injectedFields = inject('$_vm_fields', null)

console.log('injectedFields', injectedFields.value)

const props = defineProps({
  /*
  String containing interpolated variable
  e.g. "{{ hello }}"
  */
  modelValue: {
    type: [String, Object],
    required: false,
    default: null,
  },

  block: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const strExpression = ref('')
const showExpressionInput = ref(false)

const allFields = computed(() => injectedFields?.value || [])

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


const selectOptions = computed(() => {
  return [
    ...allFields.value,
    {
      text: i18n.t('CmsPropInput.CustomExpression'),
      value: 'custom',
    },
  ]
})


const variableName = computed(() => {
  if (showExpressionInput.value) {
    return 'custom'
  }

  if (strExpression.value == '') {
    return ''
  }

  const found = findField(strExpression.value, allFields.value)
  return found ? strExpression.value : 'custom'
})


watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue?.$i18n) {
      newValue = newValue.$i18n?.en || ''
    }
    if (/{{([^}]*?)}}/.test(newValue)) {
      strExpression.value = newValue.replace(/[{}]/g, '')
    }

    if (variableName.value == 'custom') {
      showExpressionInput.value = true
    }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', `{{${strExpression.value}}}`)
}

function onVariablePickerChange($event) {
  if ($event == 'custom') {
    strExpression.value = ''
    showExpressionInput.value = true
  } else {
    strExpression.value = $event || ''
    showExpressionInput.value = false
  }

  emitUpdate()
}

const i18n = useI18n({
  en: {
    'CmsPropInput.SelectVariable': 'Select variable ...',
    'CmsPropInput.DocumentVariables': 'Document variables',
    'CmsPropInput.Other': 'Other',
    'CmsPropInput.CustomExpression': 'Custom expression ...',
    'CmsPropInput.TypeAName': 'Type a variable name',
  },
  es: {
    'CmsPropInput.SelectVariable': 'Escoger ...',
    'CmsPropInput.DocumentVariables': 'Variables del documento',
    'CmsPropInput.Other': 'Otras',
    'CmsPropInput.CustomExpression': 'Expresión ...',
    'CmsPropInput.TypeAName': 'Esribe un nombre de variable',
  },
})
</script>

<template>
  <div>
    <UiInput
      type="select-native"
      class="PropInputExpression__varPicker UiInput"
      :model-value="variableName"
      :options="selectOptions"
      :placeholder="i18n.t('CmsPropInput.SelectVariable')"
      @update:model-value="onVariablePickerChange"
    />

    <UiInput
      v-show="showExpressionInput"
      v-model="strExpression"
      class="PropInputExpression__expression"
      type="text"
      @update:model-value="emitUpdate()"
    />
  </div>
</template>

<style lang="scss">
.PropInputExpression__expression {
  width: 100%;
}
</style>