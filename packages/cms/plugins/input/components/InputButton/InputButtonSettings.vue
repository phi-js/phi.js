<script setup>
import { computed, ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'
import CmsPropInput from '../../../../components/CmsPropInput/CmsPropInput.vue'
import NavigationPagePicker from '../../../navigation/components/NavigationPagePicker/NavigationPagePicker.vue'

const props = defineProps({
  // BLOCK object
  modelValue: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

// internal "block" object (clone of props.modelValue)
const block = ref({ props: {} })
watch(
  () => props.modelValue,
  (newValue) => {
    block.value = JSON.parse(JSON.stringify(newValue))
    if (!block.value.props) {
      block.value.props = {}
    }
  },
  { immediate: true },
)

const emitUpdate = function () {
  emit('update:modelValue', block.value)
}

// Auto-set v-model variable name
const autoSetModel = props.modelValue?.['v-model'] !== undefined && !props.modelValue['v-model']

function onUpdateLabel(newLabel) {
  const oldLabel = block.value.props.label
  block.value.props.label = newLabel

  if (autoSetModel) {
    if (!block.value['v-model'] || block.value['v-model'] == camelize(oldLabel)) {
      block.value['v-model'] = camelize(newLabel)
    }
  }

  emitUpdate()
}

function camelize(str) {
  if (!str) {
    return str
  }

  if (typeof str?.$i18n === 'object') {
    str = str.$i18n[Object.keys(str.$i18n)[0]]
  }
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/[^a-zA-Z0-9]+/g, '')
}

const i18n = useI18n({
  en: {
    'InputButtonSettings.actions.GoToPage': 'Go to page',
    'InputButtonSettings.actions.Submit': 'Submit',
    'InputButtonSettings.Label': 'Label',
    'InputButtonSettings.LoadingLabel': 'Label (while submitting)',
    'InputButtonSettings.Subtext': 'Subtext',
    'InputButtonSettings.Actions': 'Actions',
  },
  es: {
    'InputButtonSettings.actions.GoToPage': 'Ir a página',
    'InputButtonSettings.actions.Submit': 'Enviar formulario',
    'InputButtonSettings.Label': 'Etiqueta',
    'InputButtonSettings.LoadingLabel': 'Etiqueta (mientras envía)',
    'InputButtonSettings.Subtext': 'Subtexto',
    'InputButtonSettings.Actions': 'Acciones',
  },
})

const booActionSubmit = computed({
  get: () => block.value.props.type == 'submit',
  set: (newValue) => block.value.props.type = newValue ? 'submit' : 'button',
})

const booActionNavigate = computed({
  get: () => block.value.props.name == 'story-goto',
  set: (newValue) => block.value.props.name = newValue ? 'story-goto' : '',
})
</script>

<template>
  <div class="InputButtonSettings UiForm">
    <fieldset>
      <legend>{{ i18n.t('InputButtonSettings.Actions') }}</legend>
      <UiInput
        v-model="booActionSubmit"
        type="checkbox"
        :placeholder="i18n.t('InputButtonSettings.actions.Submit')"
        @update:model-value="emitUpdate"
      />

      <div class="InputButtonSettings__navigator">
        <UiInput
          v-model="booActionNavigate"
          type="checkbox"
          :placeholder="i18n.t('InputButtonSettings.actions.GoToPage')"
          @update:model-value="emitUpdate"
        />
        <NavigationPagePicker
          v-if="booActionNavigate"
          v-model="block.props.value"
          @update:model-value="emitUpdate"
        />
      </div>
    </fieldset>

    <CmsPropInput
      v-model:block="block"
      :model-value="block.props.label"
      type="text"
      :label="i18n.t('InputButtonSettings.Label')"
      @update:model-value="onUpdateLabel"
      @update:block="emitUpdate"
    />

    <CmsPropInput
      v-model="block.props.loadingLabel"
      v-model:block="block"
      :disabled="block.props.type != 'submit'"
      :placeholder="block.props.label"
      type="text"
      :label="i18n.t('InputButtonSettings.LoadingLabel')"
      @update:model-value="emitUpdate"
      @update:block="emitUpdate"
    />

    <CmsPropInput
      v-model="block.props.subtext"
      v-model:block="block"
      type="text"
      :label="i18n.t('InputButtonSettings.Subtext')"
      @update:model-value="emitUpdate"
      @update:block="emitUpdate"
    />
  </div>
</template>

<style lang="scss">
.InputButtonSettings {
  &__navigator {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .UiInput--type-checkbox .UiInput__body label {
      padding-right: 12px;
    }
  }
}
</style>