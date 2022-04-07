<script setup>
/*
This component receives a modelValue prop with an ARRAY of selected class names (String)

It wraps a CssClassManager object, and links its value to the globally provided story class list

*/
import { ref, inject, shallowRef, watchEffect, computed, onUnmounted } from 'vue'
import { UiItem } from '@/packages/ui'
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
const innerClasses = ref([])
watchEffect(() => innerClasses.value = Array.isArray(props.modelValue)
  ? props.modelValue.concat()
  : [])

function emitUpdate() {
  emit('update:modelValue', innerClasses.value.length ? innerClasses.value.concat() : null)
}

function toggleClass(className, booSelected) {
  const foundIndex = innerClasses.value.indexOf(className)
  if (booSelected) {
    if (foundIndex > -1) {
      return
    }
    innerClasses.value.push(className)
  } else {
    if (foundIndex === -1) {
      return
    }
    innerClasses.value.splice(foundIndex, 1)
  }

  emitUpdate()
}

function onClassAdded(objClass) {
  toggleClass(objClass.name, true)
}

const injectedStoryEditor = inject('$_cms_story_builder', {})
const injectedStory = shallowRef(injectedStoryEditor.story)
const storyClasses = ref(injectedStory.value?.css?.classes || [])

function onUpdateStoryClasses() {
  injectedStory.value.css.classes = storyClasses.value
}


let initialStoryClasses = JSON.parse(JSON.stringify(storyClasses.value))

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
  injectedStoryEditor.cancel()
})
onUnmounted(() => unlistenCancel?.())

/*
Class names present in innerClasses but not present in storyClasses
*/
const orphanedClasses = computed(() => innerClasses.value.filter((className) =>
  !storyClasses.value.find((objClass) => objClass.name == className)))
</script>

<template>
  <div class="BlockCssClasses UiForm">
    <UiItem
      v-for="className in orphanedClasses"
      :key="className"
      :text="className"
      @click="toggleClass(className, false)"
    >
      <template #icon>
        <input
          type="checkbox"
          :checked="true"
        >
      </template>
    </UiItem>

    <CssClassManager
      v-model="storyClasses"
      @update:model-value="onUpdateStoryClasses"
      @class-added="onClassAdded"
    >
      <template #trigger="{ objClass }">
        <input
          type="checkbox"
          :checked="innerClasses.includes(objClass.name)"
          @input="toggleClass(objClass.name, $event.target.checked)"
          @click.stop="() => null"
        >
      </template>
    </CssClassManager>
  </div>
</template>