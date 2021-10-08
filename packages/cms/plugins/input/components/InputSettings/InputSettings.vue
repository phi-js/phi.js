<template>
  <div class="input-settings">
    <!-- <UiInput
      xxxxv-if="showTypePicker"
      type="select"
      label="Tipo"
      :options="types"
      v-model="block.props.type"
      @input="input"
    ></UiInput> -->

    <UiField label="Tipo">
      <select
        class="ui-native"
        v-model="block.props.type"
        @change="input"
      >
        <option
          v-for="type in types"
          :key="type.value"
          :value="type.value"
        >{{ type.text}}</option>
      </select>
    </UiField>

    <!-- <UiField
      v-if="block.props.type == 'select'"
      label="Opciones"
    >
      <SelectOptionsEditor
        v-model="block.props.options"
        @input="input"
      ></SelectOptionsEditor>
    </UiField> -->
    <UiField
      v-if="block.props.type == 'date' || block.props.type == 'timestamp'"
      label="Selector de hora"
    >
      <select
        class="ui-native"
        v-model="block.props.time"
        @change="input"
      >
        <option :value="undefined">Desactivado</option>
        <option value="12">AM/PM</option>
        <option value="24">24 horas</option>
      </select>
      <!-- !!! se debe usar @change en vez de @input, de lo contrario el cambio no es reactivo (?!) -->
      <!--
      <input
        type="checkbox"
        v-model="block.props.time"
        @change="input"
      />
      -->
    </UiField>

    <UiInput
      type="text"
      label="Etiqueta"
      v-model="block.props.label"
      @input="input"
    ></UiInput>

    <UiInput
      type="text"
      label="Subtexto"
      v-model="block.props.message"
      @input="input"
    ></UiInput>

    <UiInput
      type="text"
      label="Placeholder"
      v-model="block.props.placeholder"
      @input="input"
    ></UiInput>
  </div>
</template>

<script>
import BlockModel from '../../../../mixins/BlockModel.js';
import { UiField, UiInput } from '../../../../../ui';
// import SelectOptionsEditor from './SelectOptionsEditor.vue';

export default {
  name: 'InputSettings',
  mixins: [BlockModel],
  components: { UiField, UiInput },

  props: {
    showTypePicker: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      types: [
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
      ],
    };
  },
};
</script>