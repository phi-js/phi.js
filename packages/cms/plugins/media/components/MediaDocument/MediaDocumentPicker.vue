<template>
  <div class="media-document-picker">
    <div class="document-picker-header UiGroup">
      <UiFileUploader :path="path" max-files="1" @success="onUploadSuccess" @error="onUploadError">
        <UiInput label="Archivo" style="text-align:left">
          <UiItem
            style="text-align: left"
            icon="mdi:file-word"
            :text="blockProps.label || 'Subir archivo'"
          ></UiItem>
        </UiInput>
      </UiFileUploader>

      <UiInput style="flex:0" label="Visualizador" v-if="!!blockProps.value">
        <select v-model="blockProps.provider" @change="emitInput">
          <option value="google">Google</option>
          <option value="microsoft">Microsoft</option>
        </select>
      </UiInput>
    </div>

    <MediaDocument
      v-if="blockProps.value && !isLoading"
      :value="blockProps.value"
      :provider="blockProps.provider"
    ></MediaDocument>
  </div>
</template>

<script>
import MediaDocument from './MediaDocument.vue';
import { UiItem, UiInput, UiFileUploader } from '../../../../../ui';

export default {
  name: 'MediaDocumentPicker',

  components: {
    MediaDocument,
    UiFileUploader,
    UiItem,
    UiInput,
  },

  props: {
    path: {
      type: String,
      required: true,
    },

    // objeto con las props para <document-viewer>:  {value, provider}
    value: {
      type: Object,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      blockProps: {
        value: null,
        provider: null,
      },
      isLoading: false,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.blockProps = Object.assign(
          this.blockProps,
          { value: null, label: null, provider: 'google' },
          newValue
        );
      },
    },
  },

  methods: {
    onUploadSuccess(e) {
      this.blockProps.label = e[0].name;
      this.blockProps.value = e[0].url;
      this.emitInput();

      // Esperar unos milisegundos para actualizar el iframe correctamente
      this.isLoading = true;
      setTimeout(() => (this.isLoading = false), 800);
    },

    onUploadError(err) {
      alert('Error subiendo archivo');
      console.warn('Error subiendo archivo', err);
    },

    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.blockProps)));
    },
  },
};
</script>