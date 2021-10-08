<template>
  <div class="StmtOp">
    <div class="ui-row --top">
      <div style="flex:3">
        <UiItem
          v-if="fieldSchema"
          v-bind="fieldSchema"
        />
        <input
          v-else
          v-model="innerModel.field"
          type="text"
          class="ui-native op-field-input"
          @input="emitInput"
        >
      </div>

      <div
        class="op-picker"
        style="flex:3"
      >
        <select
          v-model="innerModel.op"
          class="op-picker-select"
          @change="emitInput(); onChangeOp();"
        >
          <option
            v-for="(opDef, i) in availableOperators"
            :key="i"
            :value="opDef.operator"
          >
            {{ opDef.text }}
          </option>

          <option
            v-if="!isKnownOperator"
            :value="innerModel.op"
          >
            Otro:
          </option>
          <option
            v-else
            :value="null"
          >
            -- Custom --
          </option>
        </select>

        <input
          v-show="!isKnownOperator"
          v-model="innerModel.op"
          type="text"
          class="ui-native op-option-other"
          @input="emitInput"
        >
      </div>

      <div
        class="op-args"
        style="flex:4"
      >
        <component
          :is="customArgsComponent.component"
          v-if="customArgsComponent"
          v-model="innerModel.args"
          v-bind="customArgsComponent.props"
          :field-schema="fieldSchema"
          @input="emitInput"
        />
        <VmExpressionInternal
          v-else
          v-model="innerModel.args"
          @input="emitInput"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { UiInput, UiItem } from '/packages/ui/components'
import VmExpressionInternal from '../../VmExpressionInternal.vue'

export default {
  name: 'StmtOp',
  components: { UiItem, VmExpressionInternal },
  inject: ['VmExpressionRoot'],

  props: {
    modelValue: {
      type: Object,
      required: false,
      default: null,
    },
  },

  emits: ['update:modelValue'],

  data() {
    return { innerModel: null }
  },

  computed: {
    availableOperators() {
      let allOperators = this.VmExpressionRoot?.operators || []

      let fieldType = this.fieldSchema?.type || 'string'
      return allOperators.filter((op) => op.type == fieldType || !op.type)
    },

    fieldSchema() {
      if (!this.innerModel.field) {
        return null
      }

      return (
        this.VmExpressionRoot.schema &&
        this.VmExpressionRoot.schema.properties[this.innerModel.field]
      )
    },

    isKnownOperator() {
      return (
        this.availableOperators.findIndex((opDef) => opDef.operator == this.innerModel?.op) >= 0
      )
    },

    customArgsComponent() {
      let operatorDefinition = this.availableOperators.find((opDef) => opDef.operator == this.innerModel?.op)
      if (!operatorDefinition) {
        // Fallback: Si hay un esquema con ENUM, mostrar simplemente un picker
        if (this.fieldSchema?.enum) {
          return {
            component: UiInput,
            props: {
              type: 'select',
              multiple: false,
              options: this.fieldSchema.enum,
            },
          }
        }

        return null
      }

      return operatorDefinition?.editor
    },
  },


  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        let clone = newValue ? JSON.parse(JSON.stringify(newValue)) : newValue

        this.innerModel = Object.assign(
          {
            op: null,
            arg1: clone.arg1 || (clone.field ? `{{ ${clone.field} }}` : null),
            arg2: clone.arg2 || clone.args,
            field: null,
            args: clone.args,
          },
          clone,
        )

        if (!this.innerModel.op) {
          this.innerModel.op = this.availableOperators?.[0]?.operator || null
        }
      },
    },
  },

  methods: {
    onChangeOp() {
      // this.innerModel.args = null;
      this.emitInput()

      // Focus "custom" textarea
      if (!this.innerModel.op) {
        try {
          this.$nextTick(() =>
            this.$el.querySelector('input.op-option-other').focus())
        } catch (e) {
          // shhh
        }
      }
    },

    emitInput() {
      this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.innerModel)))
    },
  },
}
</script>

<style lang="scss">
.StmtOp {
  .op-picker {
    text-align: center;
  }

  .op-picker-select {
    padding: var(--ui-padding);
    border: 0;
    background: transparent;
    font-family: var(--ui-font-secondary);
    font-weight: bold;
  }
}
</style>