<template>
  <div class="FetchEditor">
    <div class="ui-group --block">
      <UiField label="Method">
        <select
          class="ui-native"
          v-model="innerValue.args.options.method"
          @change="emitInput"
        >
          <option value="get">GET</option>
          <option value="post">POST</option>
          <option value="put">PUT</option>
          <option value="delete">DELETE</option>
        </select>
      </UiField>

      <UiField
        label="URL"
        style="flex: 1"
      >
        <input
          class="ui-native fetch-url"
          type="text"
          v-model="innerValue.args.url"
          @input="emitInput"
          placeholder="https:// ... "
          style="width:100%"
        />
      </UiField>
    </div>

    <UiField
      label="Body"
      v-show="innerValue.args.options.method != 'get'"
    >
      <UiInputJson
        v-model="innerValue.args.options.body"
        @input="emitInput"
      />
    </UiField>
  </div>
</template>

<script>
import { UiField, UiInputJson } from '../../../../../../ui';

export default {
  name: 'FetchEditor',
  components: { UiField, UiInputJson },

  props: {
    value: {
      required: false,
      default: null,
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
        let incoming = Object.assign(
          { call: 'fetch' },
          newValue ? JSON.parse(JSON.stringify(newValue)) : null
        );

        incoming.args = Object.assign(
          {
            url: '',
            options: {
              method: 'get',
              body: null,
            },
          },
          typeof incoming.args == 'object' ? incoming.args : null
        );

        this.innerValue = incoming;
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