<template>
  <div class="select-editor">
    <div
      class="option-list"
      :class="{'--native': selectProps.native}"
    >
      <div class="list-bullets">
        <UiIcon
          v-for="n in arrayOptions.length"
          :key="n"
          :value="selectProps.multiple ? 'mdi:checkbox-blank-outline' : 'mdi:radiobox-blank'"
          class="bullet-icon"
        />
      </div>

      <textarea
        v-model="stringOptions"
        class="textarea-options"
        placeholder="Escribe una opción por línea"
        @input="emitInput"
      />
    </div>
  </div>
</template>

<script>
import { UiIcon } from '../../../../../ui'

export default {
  name: 'SelectEditor',
  components: { UiIcon },

  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },

  data() {
    return {
      selectProps: {},
      stringOptions: '',
    }
  },

  computed: {
    arrayOptions() {
      if (!this.stringOptions) {
        return []
      }

      let lines = this.stringOptions.split('\n')
      if (!lines.length) {
        return []
      }

      return lines
        .filter((line) => !!line.trim())
        .map((line) => ({
          text: line.trim(),
          value: this.normalize(line),
        }))
    },
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        if (!newValue) {
          return
        }

        this.selectProps = JSON.parse(JSON.stringify(newValue))
        this.selectProps.native = !!this.selectProps.native
        this.selectProps.multiple = !!this.selectProps.multiple
      },
    },
  },

  mounted() {
    if (this.value && this.value.options && this.value.options.length) {
      this.stringOptions = this.value.options
        .map((option) => option.text)
        .join('\n')
    }

    this.$nextTick(this.resizeTextarea)
  },

  methods: {
    normalize(string) {
      return string
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // normalize('NFD').replace(/[\u0300-\u036f]/g, '') normaliza acentos y dieresis
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
    },

    resizeTextarea() {
      let textarea = this.$el.querySelector('.textarea-options')

      if (!textarea.scrollHeight) {
        textarea.style.height = ''
        return
      }

      textarea.style.boxSizing = 'border-box'
      let offset = textarea.offsetHeight - textarea.clientHeight
      textarea.style.height = '2px'
      textarea.style.height = textarea.scrollHeight + offset + 'px'
    },

    emitInput() {
      this.resizeTextarea()

      this.selectProps.options = this.arrayOptions
      this.$emit('input', JSON.parse(JSON.stringify(this.selectProps)))
    },
  },
}
</script>

<style lang="scss">
.select-editor {
  .select-editor-toolbar {
    border-radius: var(--ui-radius);
    border: 2px dashed rgba(0, 0, 0, 0.1);

    select {
      border: none;
      background: transparent;
      padding: 4px 8px;

      font-family: var(--ui-font-secondary);
      font-size: 0.9em;
      font-weight: 600;
      color: #666;
    }
  }

  .option-list {
    display: flex;

    &.--native {
      .list-bullets {
        display: none;
      }

      textarea {
        padding: var(--ui-padding);
        border: 1px solid transparent;
        border-radius: var(--ui-radius);
        background-color: #fefefe;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
        max-height: 250px;
      }
    }

    .list-bullets {
      padding: 0 var(--ui-padding-horizontal);
      padding-top: 4px;

      .bullet-icon {
        display: block;
        color: var(--ui-color-primary);
        height: 38px;

        font-size: 24px;
      }
    }

    .textarea-options {
      flex: 1;
      background: transparent;
      outline: none;
      border: none;
      display: block;
      resize: none;

      font-family: var(--ui-font-secondary);
      font-size: 1em;

      line-height: 38px;
    }
  }
}
</style>