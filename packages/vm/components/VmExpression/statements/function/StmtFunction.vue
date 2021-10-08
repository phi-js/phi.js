<template>
  <div class="StmtFunction">
    <div class="stmt-function-args ui-label">
      function(
      <span
        class="function-arg"
        v-for="(arg,i) in innerModel.arguments"
        :key="i"
      >
        <input
          type="text"
          :placeholder="`arg ${i+1}`"
          v-model="innerModel.arguments[i]"
          @input="emitInput"
        />
      </span>
      ) {
    </div>

    <VmExpressionInternal
      v-model="innerModel.function"
      @input="emitInput"
    />

    <span class="ui-label">}</span>

  </div>
</template>

<script>
import VmExpressionInternal from '../../VmExpressionInternal.vue';
export default {
  name: 'StmtFunction',
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
            arguments: [],
            function: '',
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

<style lang="scss">
.StmtFunction {
  .stmt-function-args {
    .function-arg {
      &::after {
        content: ', ';
      }

      &:last-child::after {
        content: '';
      }
    }

    input {
      width: 80px;
      font-size: 12px;
      text-align: center;
      padding: 0;
      margin: 0;
      border-radius: 3px;
      border: 1px solid #ccc;
    }
  }
}
</style>