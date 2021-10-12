<template>
  <div class="ArrayCallbackEditor">
    <VmExpressionInternal
      v-model="innerModel"
      @input="emitInput"
    />
  </div>
</template>

<script>
import VmExpressionInternal from '../../../VmExpressionInternal.vue';

export default {
  name: 'ArrayCallbackEditor',
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
        let incoming = newValue
          ? JSON.parse(JSON.stringify(newValue))
          : newValue;

        this.innerModel = Object.assign(
          {
            arguments: ['item', 'index'],
            function: null,
          },
          incoming
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