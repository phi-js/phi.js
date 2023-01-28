<script setup>
/*
This component receives a Block object and manages its "class" property,
which is an ARRAY of CLASS items

a CLASS item may be:
- string representing a classname.  e.g. "some-header"
- An object, with a VM expression.  e.g. { "if": { ... }, "then": "my-class" }

It wraps a CssClassManager object, and links its value to the globally provided story class list
*/
import { ref, inject, watch, computed } from 'vue'

import { UiIcon, UiDialog, UiButton, UiDetails, UiInput } from '@/packages/ui'
import { VmStatement } from '@/packages/vm'
import CssClassEditor from '../CssClassManager/CssClassEditor.vue'

const props = defineProps({
  block: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:block'])

const injectedStory = inject('_cms_currentStory', {})
const availableClasses = ref(injectedStory.value.stylesheets.filter((sheet) => sheet.type == 'class'))


/*
classList is an array of NORMALIZED array of class objects
as objects with "name" and "condition"

Given an incoming block.props.class:
[
  "my-class",
  {"if": "... some condition ...", "then": "my-conditional-class"} // This implementation doesn't support "else"
]

it's normalized as

classList: [
  {
    "name": "my-class",
    "condition": null
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

const appenderOptions = computed(() => {
  const unused = availableClasses.value.filter((classObj) => !isClassSelected(classObj.id))
  const retval = unused.map((unusedClass) => ({ value: unusedClass.id, text: unusedClass.id }))
  retval.push({ value: 'new', text: 'Create new class ...' })
  return retval
})

function onAppenderChange(selectedValue) {
  if (selectedValue == 'new') {
    return promptNewClassName()
  } else if (selectedValue) {
    appendClass(selectedValue)
  }

}

function promptNewClassName() {
  const className = window.prompt('Type a class name')
  if (!className || !className.trim()) {
    return
  }

  appendClass(className)

  const newSheet = { id: className, type: 'class', src: `.${className } {\n\n}` }
  injectedStory.value.stylesheets.push(newSheet)
  availableClasses.value.push(newSheet)
}




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

function appendClass(className) {
  if (isClassSelected(className)) {
    return
  }
  classList.value.push({ name: className })
  emitUpdate()
}

function removeClass(className) {
  const foundIndex = classList.value.findIndex((c) => c.name == className)
  if (foundIndex >= 0) {
    classList.value.splice(foundIndex, 1)
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

/* Class Editor which changes the injected story's "stylesheets" props */

const injectedStoryDeclarations = computed(() => classList.value.map((objClass) => {
  return availableClasses.value.find((c) => c.id == objClass.name)
}))

function updateStoryDeclaration(sheetDeclaration) {
  const matchingDeclaration = injectedStory.value.stylesheets.find((sheet) => sheet.id == sheetDeclaration.id)
  if (matchingDeclaration) {
    Object.assign(matchingDeclaration, sheetDeclaration)
  }
}
</script>

<template>
  <div class="BlockCssClasses">
    <UiDetails
      v-for="(blockClass, i) in classList"
      :key="blockClass.name"
      :text="blockClass.name"
      @delete="removeClass(blockClass.name)"
    >
      <!-- Class declaration editor (changes injected story's "stylesheets") if a matching declaration exists -->
      <CssClassEditor
        v-if="injectedStoryDeclarations[i]"
        :model-value="injectedStoryDeclarations[i]"
        @update:model-value="updateStoryDeclaration($event)"
      />

      <template #actions>
        <UiIcon
          v-if="isClassSelected(blockClass.name)"
          :src="hasCondition(blockClass.name) ? 'mdi:eye' : 'mdi:eye-outline'"
          @click="openVisibilityEditor(blockClass.name)"
        />
      </template>
    </UiDetails>

    <!-- Class appender -->
    <UiInput
      type="select-native"
      placeholder="Add class"
      :options="appenderOptions"
      @update:model-value="onAppenderChange($event)"
    />

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