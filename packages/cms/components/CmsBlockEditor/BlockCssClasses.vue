<script setup>
/*
This component receives a modelValue prop with an ARRAY of selected class names (String)

It wraps a CssClassManager object, and links its value to the globally provided story class list

*/
import { ref, inject, shallowRef, computed, watch } from 'vue'

import { UiItem, UiIcon, UiDialog, UiButton } from '@/packages/ui'
import { VmStatement } from '@/packages/vm'
import { getAvailableStoryClasses } from '../../themes'
import CssClassManager from '../CssClassManager/CssClassManager.vue'

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

/*
The "class" prop of the block may contain VM statements.
e.g.
[
  "some-class",
  {
    "if": "... some condition ..."
    "then": "my-conditional-class"
  }
]

classList is an array of NORMALIZED class objects:

classList: [
  {
    "name": "some-class",
    "condition": "null"
  },
  {
    "name": "my-conditional-class",
    "condition": "... some condition ..."
  }
]
*/
const classList = ref([])
watch(
  () => props.block,
  (incomingBlock) => {
    const blockClasses = Array.isArray(incomingBlock?.props?.class)
      ? incomingBlock.props.class
      : incomingBlock?.props?.class ? [incomingBlock?.props?.class] : []

    classList.value = blockClasses
      .map((classValue) => {
        if (typeof classValue === 'string') {
          return {
            name: classValue,
            condition: null,
          }
        }

        if (classValue?.if && classValue?.then) {
          return {
            name: classValue.then,
            condition: classValue.if,
          }
        }
      })
      .filter((c) => !!c)
  },
  { immediate: true },
)

function emitUpdate() {
  const classArray = classList.value.map((objClass) => {
    if (objClass.condition?.and?.length || objClass.condition?.or?.length) {
      return {
        if: objClass.condition,
        then: objClass.name,
      }
    }

    return objClass.name
  })

  emit('update:block', {
    ...props.block,
    props: {
      ...props.block?.props,
      class: classArray,
    },
  })
}

// const allStoryClasses = getAvailableStoryClasses(injectedStory.value)
const availableClasses = computed(() => sanitizeClassArray(getAvailableStoryClasses(injectedStory.value)))

function sanitizeClassArray(arrClasses) {
  const retval = []
  arrClasses.forEach((objClass) => {
    const className = objClass.name || objClass.id

    if (!Array.isArray(objClass.blocks) || objClass.blocks.includes(props.block?.component)) {
      retval.push({
        ...objClass,
        name: className,
        isSelected: isClassSelected(className),
        variations: Array.isArray(objClass.variations) ? sanitizeClassArray(objClass.variations) : null,
      })
    }
  })

  return retval
}

function isClassSelected(className) {
  return classList.value.findIndex((c) => c.name == className) >= 0
}

function hasCondition(className) {
  const found = classList.value.find((c) => c.name == className)
  return !!found?.condition
}

function addClass(className) {
  if (isClassSelected(className)) {
    return
  }
  classList.value.push({ name: className })
}

function removeClass(className) {
  const foundIndex = classList.value.findIndex((c) => c.name == className)
  if (foundIndex >= 0) {
    classList.value.splice(foundIndex, 1)
  }
}

function toggleClass(className) {
  isClassSelected(className) ? removeClass(className) : addClass(className)
  emitUpdate()
}

function toggleVariation(className, parentDefinition) {
  const foundIndex = classList.value.findIndex((c) => c.name == className)
  if (foundIndex >= 0) {
    classList.value.splice(foundIndex, 1)
  } else {
    // uncheck all variations
    parentDefinition.variations.forEach((sibling) => removeClass(sibling.name))
    addClass(className)
  }

  if (parentDefinition.name) {
    const variationIsSelected = parentDefinition.variations.some((variation) => isClassSelected(variation.name))
    variationIsSelected ? addClass(parentDefinition.name) : removeClass(parentDefinition.name)
  }
  emitUpdate()
}



/* Edit a class condition */
const editingClass = ref()

function openVisibilityEditor(className) {
  const foundClass = classList.value.find((c) => c.name == className)
  if (!foundClass) {
    return
  }

  editingClass.value = { ...foundClass }
  if (!editingClass.value.condition) {
    editingClass.value.condition = { and: [] }
  }
}

function onEditorSubmit() {
  const foundClass = classList.value.find((c) => c.name == editingClass.value?.name)
  if (!foundClass) {
    return
  }
  Object.assign(foundClass, editingClass.value)
  emitUpdate()
}

function onEditorClose() {
  editingClass.value = null
}
</script>

<template>
  <div class="BlockCssClasses">
    <CssClassManager
      v-model="injectedStory.stylesheets"
      @created="toggleClass($event.id)"
    >
      <template #left="{ className }">
        <UiIcon
          class="BlockCssClasses__checkbox"
          :src="isClassSelected(className) ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'"
          @click="toggleClass(className)"
        />
      </template>
      <template #right="{ className }">
        <UiIcon
          v-if="isClassSelected(className)"
          :src="hasCondition(className) ? 'mdi:eye' : 'mdi:eye-outline'"
          @click="openVisibilityEditor(className)"
        />
      </template>
    </CssClassManager>

    <!-- <div class="BlockCssClasses__available">
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
              @click-icon="toggleVariation(variation.name, objClass)"
            />
          </section>
        </fieldset>
        <UiItem
          v-else
          class="BlockCssClasses__item"
          :class="{'BlockCssClasses__item--condition': hasCondition(objClass.name)}"
          :text="objClass.title || objClass.name"
          :subtext="objClass.description"
          :icon="objClass.isSelected ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'"
          @click-icon="toggleClass(objClass.name)"
        >
          <template
            v-if="objClass.isSelected"
            #actions
          >
            <UiIcon
              :src="hasCondition(objClass.name) ? 'mdi:eye' : 'mdi:eye-outline'"
              @click="openVisibilityEditor(objClass.name)"
            />
          </template>
        </UiItem>
      </template>
    </div>
    <UiDialog class="BlockCssClasses__classManager">
      <template #trigger>
        <UiItem
          class="BlockCssClasses__item"
          text="Open class manager"
          icon="mdi:water"
        />
      </template>
      <template #default>
        <CssClassManager v-model="injectedStory.stylesheets" />
      </template>
    </UiDialog> -->



    <UiDialog
      v-slot="{ close }"
      :open="!!editingClass"
      @close="onEditorClose()"
    >
      <form
        method="dialog"
        @submit="onEditorSubmit()"
      >
        <VmStatement
          v-if="editingClass"
          v-model="editingClass.condition"
        />

        <footer>
          <UiButton
            type="submit"
            label="Accept"
          />
          <UiButton
            type="button"
            label="Cancel"
            class="UiButton--cancel"
            @click="close()"
          />
        </footer>
      </form>
    </UiDialog>
  </div>
</template>

<style lang="scss">
.BlockCssClasses {
  &__item {
    --ui-item-padding: 8px 12px;
    border-radius: 4px;
    user-select: none;
    cursor: pointer;
    &:hover { background-color: var(--ui-color-hover); }
  }

  &__classManager {
    .UiDialog__contents {
      padding: 32px 8px 8px 8px;
    }
  }

  &__checkbox {
    width: 32px;
    height: 44px;
    padding: 8px;
  }
}
</style>