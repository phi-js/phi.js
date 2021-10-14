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

  default: {
    validator: () => true,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue'])

// Provides "modelSchema" to be used by descendant components
import useModelSchema from './useModelSchema'
useModelSchema()


//
const _modelValue = computed({
  get() {
    return props.modelValue || props.default
  },

  set(newValue) {
    emitUpdate(JSON.stringify(newValue) == JSON.stringify(props.default) ? null : newValue)
  },
})

function emitUpdate(newValue) {
  // emit('update:modelValue', JSON.parse(JSON.stringify(newValue)))
  emit('update:modelValue', newValue)
}

const editor = computed(() => {
  if (
    _modelValue.value === null
    || typeof _modelValue.value != 'object'
    || Array.isArray(_modelValue.value)
  ) {
    return { component: UiInput, props: { type: 'json' } }
  }

  if (typeof _modelValue.value.function != 'undefined') {
    return { component: StmtFunction }
  }

  if (typeof _modelValue.value.switch != 'undefined') {
    return { component: StmtSwitch }
  }

  if (typeof _modelValue.value.if != 'undefined') {
    return { component: StmtIf }
  }

  if (typeof _modelValue.value.not != 'undefined') {
    return { component: StmtNot }
  }

  if (typeof _modelValue.value.call != 'undefined') {
    return { component: StmtCall }
  }

  if (typeof _modelValue.value.chain != 'undefined') {
    return { component: StmtChain }
  }

  if (typeof _modelValue.value.op != 'undefined') {
    return { component: StmtOp }
  }

  if (Array.isArray(_modelValue.value.and) || Array.isArray(_modelValue.value.or)) {
    return { component: StmtAndOr }
  }

  return { component: UiInput, props: { type: 'json' } }
})
</script>

<template>
  <component
    :is="editor.component"
    v-bind="editor.props"
    v-model="_modelValue"
    class="VmStatement"
  />
</template>