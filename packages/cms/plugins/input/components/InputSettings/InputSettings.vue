<script setup>
import { ref, watch, computed } from 'vue'
import { UiInput } from '@/packages/ui/components'
import OptionsEditor from '@/packages/ui/components/UiInputEditor/editors/OptionsEditor.vue'

const props = defineProps({
  modelValue: {
    type: Object, // block object
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const block = ref({ props: {} })
watch(
  () => props.modelValue,
  (newValue) => block.value = JSON.parse(JSON.stringify(newValue)),
  { immediate: true },
)

const isSelect = computed(() => block.value?.props?.type && block.value.props.type.substring(0, 6) == 'select')

const input = function() {
  emit('update:modelValue', block.value)
}

const types = [
  {
    icon: 'mdi:form-textbox',
    text: 'Text',
    value: 'text',
  },
  {
    icon: 'mdi:form-textarea',
    text: 'Textarea',
    value: 'textarea',
  },
  {
    icon: 'mdi:form-dropdown',
    text: 'Select (dropdown)',
    value: 'select',
  },
  {
    icon: 'mdi:format-list-bulleted',
    text: 'Select (list)',
    value: 'select-list',
  },
  {
    icon: 'mdi:form-dropdown',
    text: 'Select (buttons)',
    value: 'select-buttons',
  },
  {
    icon: 'mdi:checkbox-blank-outline',
    text: 'Checkbox',
    value: 'checkbox',
  },
  {
    icon: 'mdi:calendar',
    text: 'Fecha',
    value: 'date',
  },
  {
    icon: 'mdi:numeric',
    text: 'Número',
    value: 'number',
  },
  {
    icon: 'mdi:form-textbox-password',
    text: 'Contraseña',
    value: 'password',
  },
  {
    icon: 'mdi:paperclip',
    text: 'Archivo',
    value: 'file',
  },
  {
    icon: 'mdi:paperclip',
    text: 'Botón',
    value: 'button',
  },
]

const multipleOptions = [
  {
    text: 'Único',
    value: false,
  },
  {
    text: 'Múltiple',
    value: true,
  },
]
</script>

<template>
  <div class="InputSettings">
    <div class="ui-row --tight --bottom">
      <UiInput
        v-model="block.props.type"
        label="Tipo"
        type="select-native"
        :options="types"
        @update:modelValue="input"
      />

      <UiInput
        v-if="isSelect"
        v-model="block.props.multiple"
        type="select-native"
        :options="multipleOptions"
        @update:modelValue="input"
      />
    </div>

    <fieldset>
      <legend>Display</legend>

      <UiInput
        v-model="block.props.label"
        type="text"
        label="Etiqueta"
        @update:modelValue="input"
      />

      <UiInput
        v-model="block.props.placeholder"
        type="text"
        label="Placeholder"
        @update:modelValue="input"
      />

      <UiInput
        v-model="block.props.subtext"
        type="text"
        label="Subtexto"
        @update:modelValue="input"
      />
    </fieldset>

    <fieldset v-if="isSelect">
      <legend>Options</legend>

      <OptionsEditor
        v-model="block.props.options"
        @update:modelValue="input"
      />
    </fieldset>

    <UiInput
      v-if="block.props.type == 'date' || block.props.type == 'timestamp'"
      label="Selector de hora"
    >
      <select
        v-model="block.props.time"
        class="ui__input"
        @change="input"
      >
        <option :value="undefined">
          Desactivado
        </option>
        <option value="12">
          AM/PM
        </option>
        <option value="24">
          24 horas
        </option>
      </select>
    </UiInput>
  </div>
</template>

<style lang="scss">
.InputSettings {
  fieldset {
    border: 1px inset #666;
    border-radius: var(--ui-radius);
    margin: 24px 0;
    padding: 4px 4px 12px 8px;

    legend {
      font-family: var(--ui-font-secondary);
      font-size: 12px;
      padding: 0 12px;
      opacity: 0.7;
    }
  }
}
</style>