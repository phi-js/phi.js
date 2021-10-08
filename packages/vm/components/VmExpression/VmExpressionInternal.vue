<template>
  <component
    :is="editor.component"
    class="VmExpression"
    v-bind="editor.props"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>

<script>
import { UiInput } from '/packages/ui/components'
import { defineAsyncComponent } from 'vue'

const StmtBoo = defineAsyncComponent(() => import('./statements/boo/StmtBoo.vue'))
const StmtCall = defineAsyncComponent(() => import('./statements/call/StmtCall.vue'))
const StmtChain = defineAsyncComponent(() => import('./statements/chain/StmtChain.vue'))
const StmtFunction = defineAsyncComponent(() => import('./statements/function/StmtFunction.vue'))
const StmtIf = defineAsyncComponent(() => import('./statements/if/StmtIf.vue'))
const StmtNot = defineAsyncComponent(() => import('./statements/not/StmtNot.vue'))
const StmtOp = defineAsyncComponent(() => import('./statements/op/StmtOp.vue'))
const StmtSwitch = defineAsyncComponent(() => import('./statements/switch/StmtSwitch.vue'))

export default {
  name: 'VmExpressionInternal',
  inject: ['VmExpressionRoot'],

  props: {
    modelValue: {
      validator: () => true,
      required: false,
      default: null,
    },
  },
  emits: ['update:modelValue'],

  computed: {
    editor() {
      if (this.modelValue === null || typeof this.modelValue != 'object') {
        return { component: UiInput, props: { type: 'json' } }
      }

      if (Array.isArray(this.modelValue)) {
        return { component: UiInput, props: { type: 'json' } }
      }

      if (typeof this.modelValue.function != 'undefined') {
        return { component: StmtFunction }
      }

      if (typeof this.modelValue.switch != 'undefined') {
        return { component: StmtSwitch }
      }

      if (typeof this.modelValue.if != 'undefined') {
        return { component: StmtIf }
      }

      if (typeof this.modelValue.not != 'undefined') {
        return { component: StmtNot }
      }

      if (typeof this.modelValue.call != 'undefined') {
        let fnName = this.modelValue.call

        if (
          fnName &&
          this.VmExpressionRoot.functions[fnName] &&
          this.VmExpressionRoot.functions[fnName].editor
        ) {
          return this.VmExpressionRoot.functions[fnName].editor
        }

        return { component: StmtCall }
      }

      if (typeof this.modelValue.chain != 'undefined') {
        return { component: StmtChain }
      }

      if (typeof this.modelValue.op != 'undefined') {
        return { component: StmtOp }
      }

      if (Array.isArray(this.modelValue.and) || Array.isArray(this.modelValue.or)) {
        return { component: StmtBoo }
      }

      return { component: UiInput, props: { type: 'json' } }
    },
  },
}
</script>