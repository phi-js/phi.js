<template>
  <div class="WindowDialogEditor">
    <label class="ui-label">{{ innerModel.call }}</label>

    <UiField label="Mensaje">
      <input
        type="text"
        class="ui-native"
        v-model="innerModel.args.message"
        @input="emitInput"
      >
    </UiField>

    <UiField
      label="Valor predeterminado"
      v-if="innerModel.call == 'window.prompt'"
    >
      <input
        type="text"
        class="ui-native"
        v-model="innerModel.args.placeholder"
        @input="emitInput"
      >
    </UiField>
  </div>
</template>

<script>
import { UiField } from '../../../../../../ui';

export default {
  name: 'WindowDialogEditor',
  components: { UiField },

  props: {
    value: {
      required: false,
      default: null,
    },
  },

  data() {
    return {
      innerModel: null,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        let clone = newValue ? JSON.parse(JSON.stringify(newValue)) : newValue;
        if (typeof clone != 'object') {
          clone = {};
        }

        this.innerModel = {
          call: clone.call,
          args: Object.assign(
            {
              message: '',
              placeholder: '',
            },
            clone.args
          ),
        };
      },
    },
  },

  methods: {
    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerModel)));
    },
  },
};
</script>