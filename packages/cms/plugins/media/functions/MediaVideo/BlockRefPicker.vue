<script setup>
import { inject, computed, ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'
import { forEachBlock } from '../../../../functions'

const props = defineProps({
  /*
  fn call statement
  {
    call: ...
    args: {
      "ref": ".. name of block 'ref'",
      ...
    }
  }
  */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerArgs = ref()
watch(
  () => props.modelValue,
  (newValue) => {
    innerArgs.value = {
      ref: '',
      ...newValue.args,
    }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...props.modelValue, args: innerArgs.value })
}

const injectedStory = inject('_cms_currentStory', null)

const videoBlocks = computed(() => {
  const retval = []
  forEachBlock(injectedStory.value, (bl) => {
    if (bl.ref && (bl.component == 'MediaVideo' || bl.component == 'MediaVideoContainer')) {
      retval.push(bl)
    }
  })
  return retval
})

// Pre-select the first available block
if (!innerArgs.value.ref && videoBlocks.value.length) {
  innerArgs.value.ref = videoBlocks.value[0].ref
  emitUpdate()
}
</script>

<template>
  <div v-if="!videoBlocks.length">
    <p>No hay bloques de tipo <strong>Video</strong></p>
  </div>
  <UiInput
    v-else
    v-model="innerArgs.ref"
    type="select-native"
    :options="videoBlocks"
    option-text="$.ref"
    option-value="$.ref"
    @update:model-value="emitUpdate()"
  />
</template>