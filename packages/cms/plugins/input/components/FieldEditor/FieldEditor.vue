<template>
  <div class="field-editor">
    <input
      v-if="showLabel"
      type="text"
      class="editor-input --label"
      placeholder="Agregar título"
      v-model="innerValue.label"
      @input="emitInput"
      onfocus="this.select();"
      onmouseup="return false;"
    />

    <!-- Slot predeterminado -->
    <slot></slot>

    <input
      v-if="showMessage"
      type="text"
      class="editor-input --message"
      placeholder="Agregar descripción"
      v-model="innerValue.message"
      @input="emitInput"
      onfocus="this.select();"
      onmouseup="return false;"
    />
  </div>
</template>

<script>
export default {
  name: 'FieldEditor',

  props: {
    value: {
      type: Object,
      required: false,
      default: null,
    },

    showLabel: {
      type: Boolean,
      required: false,
      default: true,
    },

    showMessage: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data() {
    return {
      innerValue: null,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        if (!newValue) {
          newValue = {
            label: '',
            message: '',
          };
        }

        this.innerValue = Object.assign(JSON.parse(JSON.stringify(newValue)), {
          label: newValue.label || '',
          message: newValue.message || '',
        });
      },
    },
  },

  methods: {
    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerValue)));
    },
  },
};
</script>

<style lang="scss">
.field-editor {
  & > .editor-input {
    display: block;
    width: 100%;
    margin: 0;
    padding: 2px 3px;
    border: 0;
    background: transparent;

    &:hover {
      background-color: rgba(255, 255, 136, 0.5);
    }

    &.--label {
      font-family: var(--ui-font-secondary);
      font-size: 13px;
    }

    &.--message {
      font-size: 12px;
    }
  }
}
</style>