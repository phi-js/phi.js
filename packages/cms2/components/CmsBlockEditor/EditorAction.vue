<script setup>
import { computed } from 'vue'
import { getProperty, setProperty } from '../../functions'
import { parse } from '../../../vm/lib/utils'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },

  action: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:block'])

const internalModel = computed({
  get() {
    if (props.action['v-model']) {
      return getProperty({ block: props.block }, props.action['v-model'])
    }
    return props.block
  },

  set(newValue) {
    if (props.action['v-model']) {
      const updated = setProperty({ block: props.block }, props.action['v-model'], newValue)
      newValue = updated.block
    }
    emit('update:block', newValue)
  },
})

const actionProps = computed(() => {
  return parse(props.action.props, { block: props.block }, true)
})

</script>

<template>
  <component
    :is="action.component"
    v-if="action.component"
    v-model="internalModel"
    v-bind="{ ...$attrs, ...actionProps}"
  />
</template>