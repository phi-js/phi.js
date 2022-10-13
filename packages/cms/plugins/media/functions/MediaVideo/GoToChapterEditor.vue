<script setup>
import { inject, computed, ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'
import { forEachBlock } from '../../../../functions'

const props = defineProps({
  /*
  fn call statement
  {
    call: "MediaVideo.goToChapter"
    args: {
      "ref": ".. name of block 'ref'",
      "chapter": "... chapter name ..."
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
      chapter: '',
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

const availableChapters = computed(() => {
  const currentVideoBlock = videoBlocks.value.find((bl) => bl.ref == innerArgs.value.ref)
  return currentVideoBlock?.props?.chapters || []
})

// Pre-select the first available block
if (!innerArgs.value.ref && videoBlocks.value.length) {
  innerArgs.value.ref = videoBlocks.value[0].ref
  emitUpdate()
}
</script>

<template>
  <div>
    <div v-if="!videoBlocks.length">
      <p>No hay bloques de tipo <strong>Video</strong></p>
    </div>
    <template v-else>
      <UiInput
        v-model="innerArgs.ref"
        type="select-native"
        :options="videoBlocks"
        option-text="$.ref"
        option-value="$.ref"
        @update:model-value="emitUpdate()"
      />
      <UiInput
        v-if="availableChapters.length"
        v-model="innerArgs.chapter"
        type="select-list"
        :options="availableChapters"
        option-text="$.name"
        option-value="$.name"
        @update:model-value="emitUpdate()"
      />
    </template>
  </div>
</template>