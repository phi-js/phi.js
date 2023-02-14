<script setup>
import { computed, provide, inject } from 'vue'
import { UiInputJson } from '@/packages/ui/components'

import StmtAndOr from './statements/StmtAndOr.vue'
import StmtAssign from './statements/StmtAssign.vue'
import StmtCall from './statements/StmtCall.vue'
import StmtChain from './statements/StmtChain/StmtChain.vue'
import StmtEval from './statements/StmtEval.vue'
import StmtIf from './statements/StmtIf.vue'
import StmtOp from './statements/StmtOp.vue'
import StmtSearch from './statements/StmtSearch.vue'

import { definedEditors } from './defineStatementEditor.js'

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

  fields: {
    type: Array,
    required: false,
    default: null,
  },

  availableStatements: {
    type: Array,
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


// Provides "fields" to be used by descendant components
const injectedFields = inject('$_vm_fields', null)
if (!injectedFields) {
  provide('$_vm_fields', computed(() => props.fields))
}

// Provides "availableStatements" to be used by descendant components
const availableStatements = inject('$_vm_available_statements', null)
if (!availableStatements) {
  provide('$_vm_available_statements', computed(() => props.availableStatements))
}

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

  // if (typeof _modelValue.value.not != 'undefined') {
  //   return { component: StmtNot }
  // }

  if (typeof _modelValue.value.if != 'undefined') {
    return { component: StmtIf }
  }

  if (typeof _modelValue.value.assign != 'undefined') {
    return { component: StmtAssign }
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

  if (typeof _modelValue.value.search != 'undefined') {
    return { component: StmtSearch }
  }

  if (typeof _modelValue.value.eval != 'undefined') {
    return { component: StmtEval }
  }

  if (Array.isArray(_modelValue.value.and) || Array.isArray(_modelValue.value.or)) {
    return { component: StmtAndOr }
  }

  /* Look for a component specified via defineStatementEditor */
  for (let i = 0; i < definedEditors.length; i++) {
    if (definedEditors[i].fnCheck(_modelValue.value)) {
      return definedEditors[i].objEditor
    }
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