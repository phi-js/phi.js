<script setup>
/*
This component receives a modelValue prop with an ARRAY of selected class names (String)

It wraps a CssClassManager object, and links its value to the globally provided story class list

*/
import { ref, inject, shallowRef, watchEffect, onUnmounted, computed } from 'vue'

import { UiItem } from '@/packages/ui'
import CssClassManager from '../CssClassManager/CssClassManager.vue'
import { getAvailableStoryClasses } from '../../themes'

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

  block: {
    type: Object,
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

let initialStoryClasses = injectedStory.value?.css?.classes
  ? JSON.parse(JSON.stringify(injectedStory.value.css.classes))
  : null

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

const allStoryClasses = getAvailableStoryClasses(injectedStory.value)
const availableClasses = computed(() => sanitizeClassArray(allStoryClasses))

function sanitizeClassArray(arrClasses) {
  const retval = []
  arrClasses.forEach((objClass) => {
    if (!Array.isArray(objClass.blocks) || objClass.blocks.includes(props.block?.component)) {
      retval.push({
        ...objClass,
        isSelected: innerSelection.value.includes(objClass.name),
        variations: Array.isArray(objClass.variations) ? sanitizeClassArray(objClass.variations) : null,
      })
    }
  })

  return retval
}


function isClassSelected(className) {
  return innerSelection.value.indexOf(className) >= 0
}

function addClass(className) {
  if (isClassSelected(className)) {
    return
  }
  innerSelection.value.push(className)
}

function removeClass(className) {
  const foundIndex = innerSelection.value.indexOf(className)
  if (foundIndex >= 0) {
    innerSelection.value.splice(foundIndex, 1)
  }
}

function toggleClass(className) {
  isClassSelected(className) ? removeClass(className) : addClass(className)
  emitUpdate()
}


function toggleVariation(className, parentDefinition) {

  const foundIndex = innerSelection.value.indexOf(className)
  if (foundIndex >= 0) {
    innerSelection.value.splice(foundIndex, 1)
  } else {
    // uncheck all variations
    parentDefinition.variations.forEach((sibling) => removeClass(sibling.name))
    innerSelection.value.push(className)
  }

  if (parentDefinition.name) {
    const variationIsSelected = parentDefinition.variations.some((variation) => isClassSelected(variation.name))
    variationIsSelected ? addClass(parentDefinition.name) : removeClass(parentDefinition.name)
  }

  emitUpdate()
}

</script>

<template>
  <div class="BlockCssClasses UiForm">
    <div class="BlockCssClasses__available">
      <template
        v-for="objClass in availableClasses"
        :key="objClass.name"
      >
        <fieldset v-if="objClass.variations">
          <legend>
            <div>{{ objClass.title }}</div>
            <small v-if="objClass.subtext">{{ objClass.subtext }}</small>
          </legend>
          <section>
            <UiItem
              v-for="variation in objClass.variations"
              :key="variation.name"
              class="BlockCssClasses__item"
              :icon="variation.isSelected ? 'mdi:radiobox-marked' : 'mdi:radiobox-blank'"
              :text="variation.title || variation.name"
              :subtext="variation.subtext"
              @click="toggleVariation(variation.name, objClass)"
            />
          </section>
        </fieldset>
        <UiItem
          v-else
          class="BlockCssClasses__item"
          :text="objClass.title || objClass.name"
          :subtext="objClass.subtext"
          :icon="objClass.isSelected ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'"
          @click="toggleClass(objClass.name)"
        />
      </template>
    </div>

    <!-- <CssClassManager
      v-model="storyClasses"
      v-model:selection="innerSelection"
      @update:selection="emitUpdate"
      @update:model-value="onUpdateStoryClasses"
    /> -->
  </div>
</template>

<style lang="scss">
.BlockCssClasses {
  &__available {
    padding: 8px 0;
  }

  &__item {
    --ui-item-padding: 4px 12px;
    cursor: pointer;
  }
}
</style>