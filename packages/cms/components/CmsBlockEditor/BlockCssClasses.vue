<script setup>
/*
This component receives a modelValue prop with an ARRAY of selected class names (String)

It wraps a CssClassManager object, and links its value to the globally provided story class list

*/
import { ref, inject, shallowRef, watch } from 'vue'

import { UiIcon, UiDialog, UiButton } from '@/packages/ui'
import { VmStatement } from '@/packages/vm'
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
          @click.stop.prevent="toggleClass(className)"
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

    <!-- class visibility conditions editor -->
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
  &__checkbox {
    margin-right: 0.5rem;
    width: 36px;
    height: 36px;
  }
}
</style>