<template>
  <div class="UiInputSpan">
    <div
      v-show="!isOpen"
      class="span-face"
      tabindex="0"
      @click="doOpen"
      @focus="doOpen"
    >
      <slot name="default">
        <span class="ui-clickable">{{ innerValue || placeholder }}</span>
      </slot>
    </div>

    <div
      v-show="isOpen"
      class="span-editor"
    >
      <slot name="editor">
        <input
          v-model="innerValue"
          type="text"
          class="ui-native --autofocus"
          @keydown.esc="cancel()"
          @keydown.enter="accept()"
          @blur="accept()"
        >
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiInputSpan',

  props: {
    modelValue: {
      type: String,
      required: false,
      default: null,
    },

    open: {
      type: Boolean,
      required: false,
      default: false,
    },

    placeholder: {
      type: String,
      required: false,
      default: '????',
    },
  },

  emits: ['update:modelValue', 'update:open'],

  data() {
    return {
      innerValue: null,
      isOpen: false,
    }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.innerValue = newValue
      },
    },

    open: {
      immediate: true,
      handler(newValue) {
        this.isOpen = newValue
      },
    },
  },

  methods: {
    accept() {
      this.$emit('update:modelValue', this.innerValue)
      this.doClose()
    },

    cancel() {
      this.innerValue = this.value
      this.$emit('update:modelValue', this.innerValue)
      this.doClose()
    },

    doClose() {
      this.isOpen = false
      this.$emit('update:open', this.isOpen)
    },

    doOpen() {
      this.isOpen = true
      this.$emit('update:open', this.isOpen)

      this.$nextTick(() => this.$el.querySelector('.--autofocus').select())
    },

    doBlur() {
      this.$el.querySelector('.--autofocus').blur()
    },
  },
}
</script>

<style lang="scss">
.UiInputSpan {
  .span-face {
    cursor: pointer;
    &:hover {
      background-color: #ff8;
    }
  }
}
</style>