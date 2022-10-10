<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useStorySettings, getProperty, setProperty } from '../../functions'
import { parse } from '@/packages/vm/lib/utils'

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

const internalModel = ref()
watchEffect(() => {
  if (props.action['v-model']) {
    internalModel.value = getProperty({ block: props.block }, props.action['v-model'])
  } else {
    internalModel.value = props.block // careful! This is a REFERENCE to props
  }
})

function emitUpdate() {
  if (props.action['v-model']) {
    const updated = setProperty({ block: props.block }, props.action['v-model'], internalModel.value)
    emit('update:block', updated.block)
  } else {
    emit('update:block', internalModel.value)
  }
}

const storySettings = useStorySettings()

const actionProps = computed(() => {
  return parse(
    props.action.props,
    {
      block: props.block,
      $settings: storySettings,
    },
    true,
  )
})
</script>

<template>
  <component
    :is="action.component"
    v-if="action.component"
    v-model="internalModel"
    v-bind="actionProps"
    @update:model-value="emitUpdate"
  />
</template>