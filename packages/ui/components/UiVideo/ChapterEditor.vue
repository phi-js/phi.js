<script setup>
import { computed, ref, watch } from 'vue'

import UiInput from '../UiInput/UiInput.vue'

const props = defineProps({
  /*
  CHAPTER object
  {
    "name": "loop",
    "start": 20390,
    "end": 24646,
    "jumpTo": 20390,
    "pauseOnEnter": true,

    // new syntax
    "onStart": "pause",
    "onEnd": 20390,  // "pause" | [time in ms.] | null
  },
  */
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const chapter = ref({})

watch(
  () => props.modelValue,
  (newValue) => chapter.value = newValue
    ? JSON.parse(JSON.stringify(newValue))
    : {},
  { immediate: true },
)

function emitInput() {
  emit('update:modelValue', { ...chapter.value })
}

const onStartPickerValue = computed({
  get() {
    if (chapter.value.onStart === 'pause') {
      return chapter.value.onStart
    } else if (parseInt(chapter.value.onStart) >= 0) {
      return 'jump'
    } else {
      return null
    }
  },
  set(newValue) {
    if (newValue === 'pause') {
      chapter.value.onStart = 'pause'
    } else if (newValue === 'jump') {
      chapter.value.onStart = parseInt(chapter.value.onStart) || 0
    } else {
      chapter.value.onStart = null
    }
  },
})

const onEndPickerValue = computed({
  get() {
    if (chapter.value.onEnd === 'pause') {
      return chapter.value.onEnd
    } else if (parseInt(chapter.value.onEnd) >= 0) {
      return 'jump'
    } else {
      return null
    }
  },
  set(newValue) {
    if (newValue === 'pause') {
      chapter.value.onEnd = 'pause'
    } else if (newValue === 'jump') {
      chapter.value.onEnd = parseInt(chapter.value.onEnd) || 0
    } else {
      chapter.value.onEnd = null
    }
  },
})
</script>

<template>
  <div class="ChapterEditor UiForm UiForm--wide">
    <UiInput
      v-model="chapter.start"
      type="timer"
      label="Inicio"
      placeholder="inicio (ms.)"
      @update:model-value="emitInput"
    />

    <UiInput
      v-model="chapter.end"
      type="timer"
      label="Fin"
      placeholder="fin (ms.)"
      @update:model-value="emitInput"
    />

    <UiInput
      v-model="onStartPickerValue"
      type="select-list"
      label="On start"
      :options="[
        {value: 'pause', text: 'Pause'},
        {value: 'jump', text: 'Jump to:'},
      ]"
      @update:model-value="emitInput"
    />
    <UiInput
      v-if="onStartPickerValue == 'jump'"
      v-model="chapter.onStart"
      type="timer"
      label="Target time:"
      @update:model-value="emitInput"
    />

    <UiInput
      v-model="onEndPickerValue"
      type="select-list"
      label="On end"
      :options="[
        {value: 'pause', text: 'Pause'},
        {value: 'jump', text: 'Jump to:'},
      ]"
      @update:model-value="emitInput"
    />
    <UiInput
      v-if="onEndPickerValue == 'jump'"
      v-model="chapter.onEnd"
      type="timer"
      label="Target time:"
      @update:model-value="emitInput"
    />
  </div>
</template>