<script setup>
import { computed } from 'vue'
import { getProperty, setProperty } from '../../functions'

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
</script>

<template>
  <component
    :is="action.component"
    v-if="action.component"
    v-model="internalModel"
    v-bind="{ ...$attrs, ...action.props}"
  />
</template>