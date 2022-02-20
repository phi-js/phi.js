<template>
  <div class="media-file-editor">
    <div class="media-file-wrapper">
      <MediaFile
        class="media-element"
        v-bind="sanitizedValue"
      />
      <UiIcon
        value="mdi:pencil media-file-icon"
        class="ui--clickable"
        @click="isEditing = true"
      />
    </div>

    <div
      v-show="isEditing"
      class="file-editor-form"
    >
      <input
        v-model="innerValue.text"
        type="text"
        class="ui__input"
        placeholder="Titulo"
      >
      <input
        v-model="innerValue.secondary"
        type="text"
        class="ui__input"
        placeholder="Descripción"
      >

      <div class="file-editor-form-footer">
        <button
          type="button"
          class="ui-button --main"
          @click="accept"
        >
          OK
        </button>
        <button
          type="button"
          class="ui-button --cancel"
          @click="cancel"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MediaFile from './MediaFile.vue'
import { UiIcon } from '../../../../../ui'

export default {
  name: 'MediaFileEditor',
  components: { MediaFile, UiIcon },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      innerValue: null,
      isEditing: false,
    }
  },

  computed: {
    isEmpty() {
      return (
        !this.innerValue.href &&
        !this.innerValue.text &&
        !this.innerValue.secondary
      )
    },

    sanitizedValue() {
      return {
        href: this.innerValue.href,
        text: this.innerValue.text || 'Sin título',
        secondary: this.innerValue.secondary,
        icon: this.innerValue.icon || 'mdi:file',
      }
    },
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.innerValue = JSON.parse(JSON.stringify(newValue))
        this.isEditing = this.isEmpty
      },
    },
  },

  methods: {
    accept() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerValue)))
      this.isEditing = false
    },

    cancel() {
      this.innerValue = JSON.parse(JSON.stringify(this.value))
      this.isEditing = false

      if (this.isEmpty) {
        this.$emit('delete')
      }
    },
  },
}
</script>

<style lang="scss">
.media-file-editor {
  .media-file-wrapper {
    display: flex;

    .media-element {
      flex: 1;
    }

    .media-file-icon {
      width: 48px;
    }
  }

  .file-editor-form {
    padding-left: 50px;
    padding-right: 12px;

    input {
      display: block;
      width: 100%;
    }

    .file-editor-form-footer {
      text-align: right;
      margin-top: var(--ui-breathe);
    }
  }
}
</style>