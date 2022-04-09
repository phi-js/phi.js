<script setup>
import { ref, watch, computed } from 'vue'
import { UiInput } from '@/packages/ui/components'
import OptionsEditor from '@/packages/ui/components/UiInputEditor/editors/OptionsEditor.vue'
import StoryPropInput from '../../../../components/CmsStoryEditor/StoryPropInput.vue'

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

const emitUpdate = function () {
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
  <div class="InputSettings UiForm">
    <div class="UiGroup">
      <UiInput
        v-model="block.props.type"
        label="Tipo"
        type="select-native"
        :options="types"
        @update:model-value="emitUpdate"
      />

      <UiInput
        v-if="isSelect"
        v-model="block.props.multiple"
        type="select-native"
        :options="multipleOptions"
        @update:model-value="emitUpdate"
      />
    </div>

    <fieldset>
      <legend>Display</legend>

      <StoryPropInput
        v-model="block.props.label"
        v-model:block="block"
        type="text"
        label="Etiqueta"
        @update:model-value="emitUpdate"
        @update:block="emitUpdate"
      />

      <StoryPropInput
        v-model="block.props.placeholder"
        v-model:block="block"
        type="text"
        label="Placeholder"
        @update:model-value="emitUpdate"
        @update:block="emitUpdate"
      />

      <StoryPropInput
        v-model="block.props.subtext"
        v-model:block="block"
        type="text"
        label="Subtexto"
        @update:model-value="emitUpdate"
        @update:block="emitUpdate"
      />
    </fieldset>

    <fieldset v-if="isSelect">
      <legend>Options</legend>

      <OptionsEditor
        v-model="block.props.options"
        @update:model-value="emitUpdate"
      />
    </fieldset>

    <fieldset>
      <legend>Variable</legend>

      <UiInput
        v-model="block['v-model']"
        type="text"
        @update:model-value="emitUpdate"
      />
    </fieldset>

    <!-- <UiInput
      v-if="block.props.type == 'date' || block.props.type == 'timestamp'"
      label="Selector de hora"
    >
      <select
        v-model="block.props.time"
        class="UiButton"
        @change="emitUpdate"
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
    </UiInput> -->
  </div>
</template>