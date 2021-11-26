<template>
  <div class="cms-action-http-editor">
    <div class="ui__group">
      <UiField label="Method">
        <select
          class="ui-native"
          v-model="innerValue.method"
          @change="emitInput"
        >
          <option value="get">GET</option>
          <option value="post">POST</option>
          <option value="put">PUT</option>
          <option value="delete">DELETE</option>
        </select>
      </UiField>

      <UiField label="URL">
        <input
          class="ui-native"
          type="text"
          v-model="innerValue.url"
          @input="emitInput"
          placeholder="https:// ... "
        />
      </UiField>
    </div>

    <UiField
      label="Body"
      v-show="innerValue.method != 'get'"
    >
      <UiInputJson
        v-model="innerValue.body"
        @input="emitInput"
      />
    </UiField>
  </div>
</template>

<script>
import { UiField, UiInputJson } from '../../../../../ui';

export default {
  name: 'cms-action-http-editor',
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
        this.innerValue = Object.assign(
          {
            url: '',
            method: 'get',
            body: null,
          },
          newValue ? JSON.parse(JSON.stringify(newValue)) : null
        );
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