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
        functions: this.allFunctions,
        operators: this.allOperators,
        schema: this.computedSchema,
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

    plugins: {
      type: Array,
      required: false,
      default: null,
    },
  },
  emits: ['update:modelValue'],


  data() {
    return {}
  },

  computed: {
    allOperators() {
      let retval = opDefinitions

      if (Array.isArray(this.plugins)) {
        this.plugins
          .filter((p) => !!p?.operators)
          .forEach((plugin) => {
            retval = [...retval, ...plugin.operators]
          })
      }

      return retval
    },

    allFunctions() {
      let retval = fnDefinitions

      if (Array.isArray(this.plugins)) {
        this.plugins
          .filter((p) => !!p?.functions)
          .forEach((plugin) => {
            retval = { ...retval, ...plugin.functions }
          })
      }

      return retval
    },

    computedSchema() {
      if (this.VmExpressionSettings && this.VmExpressionSettings.schema) {
        return this.VmExpressionSettings.schema
      }

      return this.modelSchema
    },
  },
}
</script>