<template>
  <div class="FetchEditor">
    <div class="ui-group --block">
      <UiInput label="Method">
        <select
          v-model="innerValue.args.options.method"
          class="ui__input"
          @change="emitInput"
        >
          <option value="get">
            GET
          </option>
          <option value="post">
            POST
          </option>
          <option value="put">
            PUT
          </option>
          <option value="delete">
            DELETE
          </option>
        </select>
      </UiInput>

      <UiInput
        label="URL"
        style="flex: 1"
      >
        <input
          v-model="innerValue.args.url"
          class="ui__input fetch-url"
          type="text"
          placeholder="https:// ... "
          style="width:100%"
          @input="emitInput"
        >
      </UiInput>
    </div>

    <UiInput
      v-show="innerValue.args.options.method != 'get'"
      v-model="innerValue.args.options.body"
      label="Body"
      type="json"
      @input="emitInput"
    />
  </div>
</template>

<script>
import { UiInput } from '../../../../../ui'

export default {
  name: 'FetchEditor',
  components: { UiInput },

  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  data() {
    return { innerValue: {} }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        let incoming = Object.assign(
          { call: 'fetch' },
          newValue ? JSON.parse(JSON.stringify(newValue)) : null,
        )

        incoming.args = Object.assign(
          {
            url: '',
            options: {
              method: 'get',
              body: null,
            },
          },
          typeof incoming.args == 'object' ? incoming.args : null,
        )

        this.innerValue = incoming
      },
    },
  },

  methods: {
    emitInput() {
      this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.innerValue)))
    },
  },
}
</script>