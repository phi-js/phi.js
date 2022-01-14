<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui/components'
// import SelectOptionsEditor from '../SelectOptionsEditor/SelectOptionsEditor.vue'

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
    text: 'Select',
    value: 'select',
  },
  {
    icon: 'mdi:checkbox-blank-outline',
    text: 'Checkbox',
    value: 'checkbox',
  },
  {
    icon: 'mdi:calendar',
    text: 'Fecha',
    value: 'timestamp',
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
</script>

<template>
  <div class="InputSettings">
    <UiInput
      v-model="block.props.type"
      label="Tipo"
      type="select-native"
      :options="types"
      @update:modelValue="input"
    />

    <UiInput
      v-if="block.props.type == 'select'"
      label="Opciones"
    >
      OOPS
      <!-- <SelectOptionsEditor
        v-model:options="block.props.options"
        @update:modelValue="input"
      /> -->
    </UiInput>

    <UiInput
      v-if="block.props.type == 'date' || block.props.type == 'timestamp'"
      label="Selector de hora"
    >
      <select
        v-model="block.props.time"
        class="ui-native"
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
  </div>
</template>