<template>
  <VmExpressionInternal
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>

<script>
import VmExpressionInternal from './VmExpressionInternal.vue'
import fnDefinitions from './definitions/functions/index.js'
import opDefinitions from './definitions/operators/index.js'

export default {
  name: 'VmExpression',
  components: { VmExpressionInternal },
  inject: { VmExpressionSettings: { default: null } },
  provide() {
    return {
      VmExpressionRoot: {
        functions: fnDefinitions,
        operators: opDefinitions,
        schema: this.modelSchema,
      },
    }
  },
  props: {
    modelValue: {
      validator: () => true,
      required: false,
      default: null,
    },

    modelSchema: {
      type: Object,
      required: false,
      default: null,
    },
  },
  emits: ['update:modelValue'],
}
</script>