<script setup>
/*
el valor de propValue se interpreta internamente asi:

propValue = "Hola"
innerValue = {
  type: 'string',
  value: 'Hola'
}

propValue = 123
innerValue = {
  type: 'number',
  value: 'Hola'
}

propValue = "{{algo}}"
innerValue = {
  type: 'variable',
  value: 'algo'
}

propValue = "{{algo ? 'si' : 'no'}}"
innerValue = {
  type: 'expression',
  value: 'algo ? 'si' : 'no''
}

propValue = "lang(algunaCosa)"
innerValue = {
  type: 'lang',
  value: 'algunaCosa'
}

<CmsPropInput v-model="propValue" />
*/

import { useAttrs, computed, ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '../../../ui'

import useModelSchema from '@/packages/vm/components/VmStatement/useModelSchema.js'
import getSchemaVariables from '@/packages/vm/helpers/getSchemaVariables.js'

const props = defineProps({
  modelValue: {
    validator: () => true,
    required: false,
    default: null,
  },

  block: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue', 'update:block'])
const attrs = useAttrs()

const innerValue = ref()

watch(
  () => props.modelValue,
  () => innerValue.value = parseValue(props.modelValue),
  { immediate: true },
)

function parseValue(incoming) {
  const retval = {
    // type: innerValue.value?.type || attrs?.type || 'text',
    type: 'text',
    value: incoming,
  }

  if (!incoming) {
    return retval
  }

  // if (typeof incoming == 'number') {
  //   retval.type = 'number'
  //   return retval
  // }

  // Variable strings "{{someVarName}}"
  const varName = incoming.match(/{{(.*?)}}/)?.[1]
  if (typeof varName == 'string') {
    retval.type = 'variable'
    retval.value = varName
    return retval
  }

  // Lang strings "lang(comeLangKey)"
  const text = incoming.match(/lang\(([^"]*?)\)/)?.[1]
  if (typeof text == 'string') {
    retval.type = 'lang'
    retval.value = text
    return retval
  }

  return retval
}

const i18n = useI18n({
  en: {
    // 'CmsPropInput.Number': 'Number',
    'CmsPropInput.Text': 'Value',
    'CmsPropInput.Translation': 'Translation',
    'CmsPropInput.Variable': 'Variable',

    'CmsPropInput.SelectVariable': 'Select variable ...',
    'CmsPropInput.DocumentVariables': 'Document variables',
    'CmsPropInput.Other': 'Other',
    'CmsPropInput.CustomVariableName': 'Type variable name ...',
    'CmsPropInput.TypeAName': 'Type a variable name',
  },
  es: {
    // 'CmsPropInput.Number': 'Número',
    'CmsPropInput.Text': 'Valor',
    'CmsPropInput.Translation': 'Traducción',
    'CmsPropInput.Variable': 'Variable',

    'CmsPropInput.SelectVariable': 'Escoger ...',
    'CmsPropInput.DocumentVariables': 'Variables del documento',
    'CmsPropInput.Other': 'Otras',
    'CmsPropInput.CustomVariableName': 'Escribir nombre de variable ...',
    'CmsPropInput.TypeAName': 'Esribe un nombre de variable',
  },
})

function setType(typeName) {
  if (innerValue.value.type == typeName) {
    return false
  }

  // When transforming a value into an variable,
  // only keep the current string value if it matches an existing variable
  if (typeName == 'variable' && innerValue.value.value) {
    const foundVariable = schemaVariables.value.find((schemaVar) => schemaVar.name == innerValue.value.value)
    if (!foundVariable) {
      innerValue.value.value = ''
    }
  }

  innerValue.value.type = typeName
  emitUpdate()
}

function emitUpdate() {
  switch (innerValue.value.type) {
  case 'variable':
    emit('update:modelValue', '{{' + innerValue.value.value + '}}')
    break

  case 'lang':
    emit('update:modelValue', 'lang(' + innerValue.value.value + ')')
    break

  default:
    emit('update:modelValue', innerValue.value.value)
    break
  }
}

const modelSchema = useModelSchema()
const schemaVariables = computed(() => getSchemaVariables(modelSchema.value))

const variableSelectorOptions = computed(() => {
  const retval = schemaVariables.value.map((schemaVar) => ({
    value: schemaVar.name,
    text: schemaVar.name,
  }))

  if (innerValue.value.value) {
    const found = schemaVariables.value.find((schemaVar) => schemaVar.name == innerValue.value.value)
    if (!found) {
      retval.push({
        value: innerValue.value.value,
        text: innerValue.value.value,
      })
    }
  }

  return retval
})

function onVariablePickerChange($event) {
  if ($event == 'custom') {
    const varName = prompt(i18n.t('CmsPropInput.TypeAName'), innerValue.value.value)
    if (!varName) {
      innerValue.value.value = ''
      return false
    }
    innerValue.value.value = varName
  } else {
    innerValue.value.value = $event || ''
  }

  emitUpdate()
}
</script>

<template>
  <UiInput
    v-bind="attrs"
    class="CmsPropInput"
    :class="`CmsPropInput--${innerValue.type}}`"
  >
    <div class="CmsPropInput__body UiGroup">
      <select
        class="CmsPropInput__picker UiInput"
        :value="innerValue.type"
        @change="setType($event.target.value)"
      >
        <!-- <option
          value="number"
          v-text="i18n.t('CmsPropInput.Number')"
        /> -->
        <option
          value="text"
          v-text="i18n.t('CmsPropInput.Text')"
        />
        <option
          value="translation"
          v-text="i18n.t('CmsPropInput.Translation')"
        />
        <option
          value="variable"
          v-text="i18n.t('CmsPropInput.Variable')"
        />
      </select>

      <template v-if="innerValue.type == 'variable'">
        <select
          class="UiInput"
          :value="innerValue.value || ''"
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
              v-text="i18n.t('CmsPropInput.CustomVariableName')"
            />
          </optgroup>
        </select>
      </template>
      <template v-else-if="innerValue.type == 'lang'">
        <UiInput
          v-model="innerValue.value"
          type="text"
          @update:model-value="emitUpdate()"
        />
      </template>
      <template v-else>
        <UiInput
          v-model="innerValue.value"
          xxxx-type="innerValue.type"
          type="text"
          @update:model-value="emitUpdate()"
        />
      </template>
    </div>
  </UiInput>
</template>