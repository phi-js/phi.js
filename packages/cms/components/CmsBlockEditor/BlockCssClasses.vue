<script setup>
/*
This component receives a modelValue prop with an ARRAY of selected class names (String)

It wraps a CssClassManager object, and links its value to the globally provided story class list

*/
import { ref, inject, shallowRef, computed, watch } from 'vue'

import { UiItem } from '@/packages/ui'
import { getAvailableStoryClasses } from '../../themes'

const props = defineProps({
  block: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:block'])

const injectedStoryEditor = inject('$_cms_story_builder', {})
const injectedStory = shallowRef(injectedStoryEditor.story)
const allStoryClasses = getAvailableStoryClasses(injectedStory.value)

/*
Internal list of classes.  Array of class names.
*/
const classList = ref([])
watch(
  () => props.block,
  (incomingBlock) => {
    if (Array.isArray(incomingBlock?.props?.class)) {
      classList.value = incomingBlock.props.class
    } else {
      classList.value = incomingBlock?.props?.class ? [incomingBlock?.props?.class] : []
    }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:block', {
    ...props.block,
    props: {
      ...props.block?.props,
      class: classList.value.concat([]),
    },
  })
}


const availableClasses = computed(() => sanitizeClassArray(allStoryClasses))

function sanitizeClassArray(arrClasses) {
  const retval = []
  arrClasses.forEach((objClass) => {
    const className = objClass.name || objClass.id

    if (!Array.isArray(objClass.blocks) || objClass.blocks.includes(props.block?.component)) {
      retval.push({
        ...objClass,
        name: className,
        isSelected: classList.value.includes(className),
        variations: Array.isArray(objClass.variations) ? sanitizeClassArray(objClass.variations) : null,
      })
    }
  })

  return retval
}

function isClassSelected(className) {
  return classList.value.indexOf(className) >= 0
}

function addClass(className) {
  if (isClassSelected(className)) {
    return
  }
  classList.value.push(className)
}

function removeClass(className) {
  const foundIndex = classList.value.indexOf(className)
  if (foundIndex >= 0) {
    classList.value.splice(foundIndex, 1)
  }
}

function toggleClass(className) {
  isClassSelected(className) ? removeClass(className) : addClass(className)
  emitUpdate()
}

function toggleVariation(className, parentDefinition) {
  const foundIndex = classList.value.indexOf(className)
  if (foundIndex >= 0) {
    classList.value.splice(foundIndex, 1)
  } else {
    // uncheck all variations
    parentDefinition.variations.forEach((sibling) => removeClass(sibling.name))
    classList.value.push(className)
  }

  if (parentDefinition.name) {
    const variationIsSelected = parentDefinition.variations.some((variation) => isClassSelected(variation.name))
    variationIsSelected ? addClass(parentDefinition.name) : removeClass(parentDefinition.name)
  }
  emitUpdate()
}
</script>

<template>
  <div class="BlockCssClasses">
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
          :subtext="objClass.description"
          :icon="objClass.isSelected ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'"
          @click="toggleClass(objClass.name)"
        />
      </template>
    </div>
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