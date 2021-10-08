<template>
  <div class="cms-action-console-editor">
    <textarea
      class="ui-native"
      v-model="innerValue"
      @input="$emit('input', innerValue)"
      placeholder="Texto a mostrar en consola"
      style="display:block; width: 100%"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: 'cms-action-console-editor',

  props: {
    value: {
      required: false,
      default: null,
    },
  },

  data() {
    return {
      innerValue: '',
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.innerValue = newValue || '';
      },
    },
  },
};
</script>