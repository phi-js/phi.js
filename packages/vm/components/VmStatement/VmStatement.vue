<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { UiInput } from '/packages/ui/components'

const StmtAndOr = defineAsyncComponent(() => import('./statements/StmtAndOr.vue'))
const StmtOp = defineAsyncComponent(() => import('./statements/StmtOp.vue'))
const StmtCall = defineAsyncComponent(() => import('./statements/StmtCall.vue'))
const StmtChain = defineAsyncComponent(() => import('./statements/StmtChain/StmtChain.vue'))

// const StmtFunction = defineAsyncComponent(() => import('../VmExpression/statements/function/StmtFunction.vue'))
// const StmtIf = defineAsyncComponent(() => import('../VmExpression/statements/if/StmtIf.vue'))
// const StmtNot = defineAsyncComponent(() => import('../VmExpression/statements/not/StmtNot.vue'))
// const StmtSwitch = defineAsyncComponent(() => import('../VmExpression/statements/switch/StmtSwitch.vue'))

const props = defineProps({
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
})
const emit = defineEmits(['update:modelValue'])

// Provides "modelSchema" to be used by descendant components
import useModelSchema from './useModelSchema'
useModelSchema()

const editor = computed(() => {
  if (
    props.modelValue === null
    || typeof props.modelValue != 'object'
    || Array.isArray(props.modelValue)
  ) {
    return { component: UiInput, props: { type: 'json' } }
  }

  if (typeof props.modelValue.function != 'undefined') {
    return { component: StmtFunction }
  }

  if (typeof props.modelValue.switch != 'undefined') {
    return { component: StmtSwitch }
  }

  if (typeof props.modelValue.if != 'undefined') {
    return { component: StmtIf }
  }

  if (typeof props.modelValue.not != 'undefined') {
    return { component: StmtNot }
  }

  if (typeof props.modelValue.call != 'undefined') {
    return { component: StmtCall }
  }

  if (typeof props.modelValue.chain != 'undefined') {
    return { component: StmtChain }
  }

  if (typeof props.modelValue.op != 'undefined') {
    return { component: StmtOp }
  }

  if (Array.isArray(props.modelValue.and) || Array.isArray(props.modelValue.or)) {
    return { component: StmtAndOr }
  }

  return { component: UiInput, props: { type: 'json' } }
})

function emitUpdate(newValue) {
  // emit('update:modelValue', JSON.parse(JSON.stringify(newValue)))
  emit('update:modelValue', newValue)
}
</script>

<template>
  <component
    :is="editor.component"
    v-bind="editor.props"
    class="VmStatement"
    :model-value="modelValue"
    @update:modelValue="emitUpdate"
  />
</template>