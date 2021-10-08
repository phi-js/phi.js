<template>
  <div class="select-options-editor">
    <table>
      <tbody>
        <tr
          v-for="(option,i) in options"
          :key="i"
        >
          <td>
            <input
              class="ui-native"
              type="text"
              v-model="options[i].text"
              @input="emitInput"
            />
          </td>
          <td>
            <input
              class="ui-native"
              type="text"
              v-model="options[i].value"
              @input="emitInput"
            />
          </td>
          <td>
            <div
              class="remove-option"
              @mousedown="removeOptionAt(i)"
            >&times;</div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>
            <input
              placeholder="Texto"
              type="text"
              class="ui-native incoming-option-text"
              v-model="newOption.text"
              @input="suggestValue()"
              @keyup.enter="append()"
            />
          </td>
          <td>
            <input
              placeholder="Valor"
              type="text"
              class="ui-native"
              v-model="newOption.value"
              @input="newOption.hasSpecifiedValue = true"
              @keyup.enter="append()"
              @keydown.tab.prevent="append()"
            />
          </td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
export default {
  name: 'select-options-editor',

  props: {
    value: {
      type: Array,
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      options: [],
      newOption: {
        text: '',
        value: '',
        hasSpecifiedValue: false
      }
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.options = JSON.parse(JSON.stringify(newValue));
      }
    }
  },

  mounted() {
    this.focus();
  },

  methods: {
    removeOptionAt(index) {
      this.options.splice(index, 1);
      this.emitInput();
    },

    append() {
      this.newOption.value = this.newOption.value.trim();
      if (!this.newOption.value) {
        alert('Debes especificar un valor');
        return;
      }

      this.options.push({
        text: this.newOption.text,
        value: this.newOption.value
      });

      this.newOption.text = '';
      this.newOption.value = '';
      this.newOption.hasSpecifiedValue = false;

      this.focus();

      this.emitInput();
    },

    suggestValue() {
      if (this.newOption.hasSpecifiedValue) {
        return;
      }
      this.newOption.value = this.newOption.text;
    },

    focus() {
      let field = this.$el.querySelector('.incoming-option-text');
      if (field) {
        field.focus();
      }
    },

    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.options)));
    }
  }
};
</script>

<style lang="scss">
.select-options-editor {
  input {
    width: 100%;
  }

  .remove-option {
    display: block;
    width: 40px;
    height: 40px;
    text-align: center;

    font-size: 28px;
    color: var(--ui-color-danger);
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
  }

  tfoot .ui-native {
    opacity: 0.7;
  }
}
</style>