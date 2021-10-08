<template>
  <div class="StmtCall">
    <input
      type="text"
      class="ui-native"
      v-model="innerModel.call"
      @input="emitInput"
    />

    <VmExpressionInternal
      v-model="innerModel.args"
      @input="emitInput"
    />
  </div>
</template>

<script>
import VmExpressionInternal from '../../VmExpressionInternal.vue';
export default {
  name: 'StmtCall',
  inject: ['VmExpressionRoot'],
  components: { VmExpressionInternal },

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
        this.innerModel = Object.assign(
          {
            call: null,
            args: {},
          },
          clone
        );
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