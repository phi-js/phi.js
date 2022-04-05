<script setup>
import { computed } from 'vue'
import { UiInputJson } from '@/packages/ui/components'

import StmtAndOr from './statements/StmtAndOr.vue'
import StmtOp from './statements/StmtOp.vue'
import StmtCall from './statements/StmtCall.vue'
import StmtChain from './statements/StmtChain/StmtChain.vue'
import StmtEval from './statements/StmtEval.vue'

import useModelSchema from './useModelSchema'

// const StmtAndOr = defineAsyncComponent(() => import('./statements/StmtAndOr.vue'))
// const StmtOp = defineAsyncComponent(() => import('./statements/StmtOp.vue'))
// const StmtCall = defineAsyncComponent(() => import('./statements/StmtCall.vue'))
// const StmtChain = defineAsyncComponent(() => import('./statements/StmtChain/StmtChain.vue'))
// const StmtEval = defineAsyncComponent(() => import('./statements/StmtEval.vue'))

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
    return { component: UiInputJson }
  }

  // if (typeof _modelValue.value.function != 'undefined') {
  //   return { component: StmtFunction }
  // }

  // if (typeof _modelValue.value.switch != 'undefined') {
  //   return { component: StmtSwitch }
  // }

  // if (typeof _modelValue.value.if != 'undefined') {
  //   return { component: StmtIf }
  // }

  // if (typeof _modelValue.value.not != 'undefined') {
  //   return { component: StmtNot }
  // }

  if (typeof _modelValue.value.call != 'undefined') {
    return { component: StmtCall }
  }

  if (typeof _modelValue.value.chain != 'undefined') {
    return { component: StmtChain }
  }

  if (typeof _modelValue.value.op != 'undefined') {
    return { component: StmtOp }
  }

  if (typeof _modelValue.value.eval != 'undefined') {
    return { component: StmtEval }
  }

  if (Array.isArray(_modelValue.value.and) || Array.isArray(_modelValue.value.or)) {
    return { component: StmtAndOr }
  }

  return { component: UiInputJson }
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