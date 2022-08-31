<script setup>
import { ref, watch, computed } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'
import useModelSchema from '@/packages/vm/components/VmStatement/useModelSchema.js'
import getSchemaVariables from '@/packages/vm/helpers/getSchemaVariables.js'

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

const modelSchema = useModelSchema()
const schemaVariables = computed(() => getSchemaVariables(modelSchema.value))

const variableName = computed(() => {
  if (showExpressionInput.value) {
    return 'custom'
  }

  if (strExpression.value == '') {
    return ''
  }

  const found = schemaVariables.value.find((schemaVar) => schemaVar.name == strExpression.value)
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

const variableSelectorOptions = computed(() => schemaVariables.value.map((schemaVar) => ({
  value: schemaVar.name,
  text: schemaVar.name,
})))


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
    <select
      class="PropInputExpression__varPicker UiInput"
      :value="variableName"
      @change="onVariablePickerChange($event.target.value)"
    >
      <option
        :value="''"
        v-text="i18n.t('CmsPropInput.SelectVariable')"
      />

      <optgroup :label="i18n.t('CmsPropInput.DocumentVariables')">
        <option
          v-for="opt in variableSelectorOptions"
          :key="opt.value"
          :value="opt.value"
          v-text="opt.text"
        />
      </optgroup>
      <optgroup :label="i18n.t('CmsPropInput.Other')">
        <option
          value="custom"
          v-text="i18n.t('CmsPropInput.CustomExpression')"
        />
      </optgroup>
    </select>

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