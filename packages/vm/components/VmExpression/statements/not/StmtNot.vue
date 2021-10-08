<template>
  <fieldset class="StmtNot">
    <legend>NOT ( <button
        type="button"
        @click="unnot"
      >unnot</button></legend>
    <VmExpressionInternal
      v-model="innerModel.not"
      @input="emitInput"
    />
  </fieldset>
</template>

<script>
import VmExpressionInternal from '../../VmExpressionInternal.vue';

export default {
  name: 'StmtNot',
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
        this.innerModel =
          newValue && newValue.not
            ? JSON.parse(JSON.stringify(newValue))
            : { not: null };
      },
    },
  },

  methods: {
    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerModel)));
    },

    unnot() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerModel.not)));
    },
  },
};
</script>