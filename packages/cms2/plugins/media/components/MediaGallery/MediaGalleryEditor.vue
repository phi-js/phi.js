<template>
  <div class="media-gallery-editor">
    <UiField label="Vista">
      <select
        v-model="innerValue.view"
        @change="emitInput"
      >
        <option value="list">Lista</option>
        <option value="grid">Cuadrícula</option>
        <option value="gallery">Galería</option>
      </select>
    </UiField>

    <UiField
      label="Max. a mostrar en vista previa"
      v-show="innerValue.view == 'gallery'"
    >
      <input
        type="number"
        min="1"
        v-model="innerValue.previewLimit"
        @input="emitInput"
      />
    </UiField>

    <draggable
      class="media-gallery-editor-list"
      handle=".image-preview"
      v-model="innerValue.files"
      @input="emitInput"
    >
      <div
        v-for="(image,i) in innerValue.files"
        :key="i"
        class="editor-list-item"
      >
        <div class="image-preview">
          <img :src="image.preview" />
        </div>
        <div class="image-title-wrapper">
          <input
            class="ui-native"
            type="text"
            v-model="innerValue.files[i].title"
            @input="emitInput"
          />
        </div>
        <UiIcon
          class="image-delete-icon"
          value="mdi:delete"
          title="Eliminar"
          @click.stop="removeImage(i)"
        />
      </div>
    </draggable>

    <UiFileUploader
      :path="path"
      @success="onUploadSuccess"
      @error="onUploadError"
      accepted-files="image/*"
    >
      <div class="gallery-editor-uploader">Subir imágenes</div>
    </UiFileUploader>
  </div>
</template>

<script>
import { UiFileUploader, UiField, UiIcon } from '../../../../../ui';
import draggable from 'vuedraggable';

export default {
  name: 'MediaGalleryEditor',

  components: {
    UiField,
    UiIcon,
    UiFileUploader,
    draggable,
  },

  props: {
    value: {
      type: Object, //block.props (files and vue)
    },

    path: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      innerValue: {},
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.innerValue = JSON.parse(JSON.stringify(newValue));
        if (!Array.isArray(this.innerValue.files) || !this.innerValue.files) {
          this.$set(this.innerValue, 'files', []);
        }
      },
    },
  },

  methods: {
    removeImage(index) {
      if (!confirm('Eliminar esta imagen?')) {
        return;
      }
      this.innerValue.files.splice(index, 1);
      this.emitInput();
    },

    onUploadSuccess(files) {
      files.forEach((file) => {
        if (!file.preview) {
          return;
        }

        this.innerValue.files.push({
          title: file.name,
          url: file.url,
          thumbnail: file.thumbnail,
          preview: file.preview,
        });
      });

      this.emitInput();
    },

    onUploadError(err) {
      alert('Error subiendo archivos');
      console.log('GalleryEditor.vue: Error subiendo archivos', err);
    },

    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerValue)));
    },
  },
};
</script>

<style lang="scss">
.media-gallery-editor {
  .gallery-editor-uploader {
    margin-top: var(--ui-breathe);
    padding: var(--ui-padding);
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed rgba(0, 0, 0, 0.4);
    border-radius: var(--ui-radius);

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  .media-gallery-editor-list {
    .editor-list-item {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;

      .image-preview {
        cursor: move;
        width: 90px;
        height: 60px;
        overflow: hidden;

        display: flex;
        align-items: center;

        img {
          max-width: 100%;
          max-height: 100%;
        }
      }

      .image-title-wrapper {
        flex: 1;
        margin: 0 8px;

        input {
          width: 100%;
        }
      }

      .image-delete-icon {
        font-size: 12px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.4);
        --ui-icon-size: 20px;

        &:hover {
          color: var(--ui-color-danger);
        }
      }
    }
  }
}
</style>