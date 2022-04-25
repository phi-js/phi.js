<script setup>
/*
This component receives a modelValue prop with an ARRAY of selected class names (String)

It wraps a CssClassManager object, and links its value to the globally provided story class list

*/
import { ref, inject, shallowRef, watchEffect, onUnmounted } from 'vue'
import CssClassManager from '../CssClassManager/CssClassManager.vue'

const props = defineProps({
  /*
  Array of class names
  [
    'some-class',
    'some-class--modifier',
    'some-other-class',
    ...
  ]
  */
  modelValue: {
    type: Array,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

/*
Internal list of classes.  ALWAYS an array
*/
const innerSelection = ref([])
watchEffect(() => {
  innerSelection.value = Array.isArray(props.modelValue)
    ? props.modelValue.concat()
    : []
})

function emitUpdate() {
  emit('update:modelValue', innerSelection.value.length ? innerSelection.value.concat() : null)
}

const injectedStoryEditor = inject('$_cms_story_builder', {})
const injectedStory = shallowRef(injectedStoryEditor.story)

let initialStoryClasses = JSON.parse(JSON.stringify(injectedStory.value?.css?.classes))

const storyClasses = ref(injectedStory.value?.css?.classes || [])

function onUpdateStoryClasses() {
  injectedStory.value.css.classes = storyClasses.value
}

/* Listen for scaffold accepts */
const registerAccept = inject('$_cms_scaffold_accept', () => null)
const unlistenAccept = registerAccept(() => {
  initialStoryClasses = JSON.parse(JSON.stringify(storyClasses.value))
})
onUnmounted(() => unlistenAccept?.())

/* Listen for scaffold cancels */
const registerListener = inject('$_cms_scaffold_cancel', () => null)
const unlistenCancel = registerListener(() => {
  injectedStory.value.css.classes = initialStoryClasses
  storyClasses.value = initialStoryClasses
  injectedStoryEditor.cancel()
})
onUnmounted(() => unlistenCancel?.())
</script>

<template>
  <div class="BlockCssClasses UiForm">
    <CssClassManager
      v-model="storyClasses"
      v-model:selection="innerSelection"
      @update:selection="emitUpdate"
      @update:model-value="onUpdateStoryClasses"
    />
  </div>
</template>