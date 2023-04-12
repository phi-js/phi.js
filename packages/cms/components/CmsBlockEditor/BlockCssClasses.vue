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
const storyClasses = ref(injectedStory.value.stylesheets.filter((sheet) => sheet.type == 'class'))

const sheetsWithClasses = injectedStory.value.stylesheets.filter((sheet) => Array.isArray(sheet.classes))
/*
Hash of classes provided by themes:
{
  "className": {... ?}
}
*/
const hashThemeClasses = {}
sheetsWithClasses.forEach((sheet) => {
  sheet.classes.forEach((themeClass) => {
    hashThemeClasses[themeClass.name] = {
      ...themeClass,
      theme: sheet.id,
    }
  })
})


/*
blockClassList is an array of NORMALIZED array of class objects
as objects with "name", "condition" and "origin" ("story" | "theme")

Given an incoming block.props.class:
[
  "my-class",
  {"if": "... some condition ...", "then": "my-conditional-class"} // This implementation doesn't support "else"
]

it's normalized as

blockClassList: [
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
const blockClassList = ref([])
watch(
  () => props.block,
  (incomingBlock) => {
    const blockClasses = Array.isArray(incomingBlock?.props?.class)
      ? incomingBlock.props.class
      : incomingBlock?.props?.class ? [incomingBlock?.props?.class] : []

    blockClassList.value = blockClasses
      .map((classValue) => {
        const origin = hashThemeClasses[classValue] ? 'theme' : 'story'

        if (typeof classValue === 'string') {
          return {
            name: classValue,
            condition: null,
            origin,
          }
        }

        if (classValue?.if && classValue?.then) {
          return {
            name: classValue.then,
            condition: classValue.if,
            origin,
          }
        }
      })
      .filter((c) => !!c)
  },
  { immediate: true },
)

const appenderOptions = computed(() => {
  const unused = storyClasses.value.filter((classObj) => !isClassSelected(classObj.id))
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
  storyClasses.value.push(newSheet)
}


function emitUpdate() {
  const classArray = blockClassList.value.map((objClass) => {
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
  return blockClassList.value.findIndex((c) => c.name == className) >= 0
}

function hasCondition(className) {
  const found = blockClassList.value.find((c) => c.name == className)
  return !!found?.condition
}

function appendClass(className) {
  if (isClassSelected(className)) {
    return
  }
  blockClassList.value.push({ name: className })
  emitUpdate()
}

function removeClass(className) {
  const foundIndex = blockClassList.value.findIndex((c) => c.name == className)
  if (foundIndex >= 0) {
    blockClassList.value.splice(foundIndex, 1)
  }
  emitUpdate()
}

function toggleClass(className) {
  return isClassSelected(className)
    ? removeClass(className)
    : appendClass(className)
}


/* Edit a class condition */
const editingClass = ref()

function openVisibilityEditor(className) {
  const foundClass = blockClassList.value.find((c) => c.name == className)
  if (!foundClass) {
    return
  }

  editingClass.value = { ...foundClass }
  if (!editingClass.value.condition) {
    editingClass.value.condition = { and: [] }
  }
}

function onEditorSubmit() {
  const foundClass = blockClassList.value.find((c) => c.name == editingClass.value?.name)
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

/*
injectedStoryDeclarations: {
  className1: {...stylesheet definition },
  className2: {...stylesheet definition },
  ...
}
*/
const injectedStoryDeclarations = computed(() => {
  const retval = {}
  blockClassList.value.forEach((objClass) => {
    const found = storyClasses.value.find((c) => c.id == objClass.name)
    if (found) {
      retval[found.id] = found
    }
  })
  return retval
})

function updateStoryDeclaration(sheetDeclaration) {
  const matchingDeclaration = injectedStory.value.stylesheets.find((sheet) => sheet.id == sheetDeclaration.id)
  if (matchingDeclaration) {
    Object.assign(matchingDeclaration, sheetDeclaration)
  }
}

const blockClassesFromStory = computed(() => blockClassList.value.filter((cls) => cls.origin == 'story'))
</script>

<template>
  <div class="BlockCssClasses">
    <!-- theme classes -->
    <div class="UiForm">
      <fieldset
        v-for="theme in sheetsWithClasses"
        :key="theme.id"
        class="BlockCssClasses__fieldset"
      >
        <legend v-text="theme.title" />

        <div
          v-for="themeClass in theme.classes"
          :key="themeClass.name"
          class="ThemeClassItem outset"
          :class="{'ThemeClassItem--selected': isClassSelected(themeClass.name)}"
        >
          <input
            :id="`checkbox_${themeClass.name}`"
            type="checkbox"
            :checked="isClassSelected(themeClass.name)"
            @input="toggleClass(themeClass.name)"
          >
          <label :for="`checkbox_${themeClass.name}`">
            <h3>{{ themeClass.text }}</h3>
            <small>{{ themeClass.subtext }}</small>
          </label>
          <UiIcon
            class="ThemeClassItem__visibilityIcon"
            :src="hasCondition(themeClass.name) ? 'mdi:eye' : 'mdi:eye-outline'"
            @click="openVisibilityEditor(themeClass.name)"
          />
        </div>
      </fieldset>
    </div>


    <!-- Classes from Story -->
    <UiDetails
      v-for="(blockClass) in blockClassesFromStory"
      :key="blockClass.name"
      :text="blockClass.name"
      class="BlockCssClasses__class outset"
      @delete="removeClass(blockClass.name)"
    >
      <!-- Class declaration editor (changes injected story's "stylesheets") if a matching declaration exists -->
      <CssClassEditor
        v-if="injectedStoryDeclarations[blockClass.name]"
        :model-value="injectedStoryDeclarations[blockClass.name]"
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
      class="BlockCssClasses__adder"
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

<style lang="scss">
.BlockCssClasses {
  display: flex;
  flex-direction: column;
  gap: 5px;

  &__adder,
  &__class summary {
    font-size: 0.85rem;
    font-weight: bold;
  }

  &__adder select {
    width: 100%;
    border-radius: 5px;
    border: 2px dashed rgba(153, 153, 153, 0.5333333333);
    outline: none !important;
    cursor: pointer;
  }

  .UiForm {
    padding: 0;
    margin-bottom: 1em;
  }

  &__fieldset {
    padding: 6px 11px !important;
  }
}

.ThemeClassItem {
  display: flex;
  align-items: center;
  user-select: none;
  padding: 0 12px;
  margin-bottom: 5px;

  cursor: pointer;
  &:hover {
    background-color: var(--ui-color-hover);
  }

  label {
    flex: 1;
    padding: 9px 11px;
  }

  * {
    cursor: inherit;
  }

  &__visibilityIcon {
    opacity: 0.3;
  }

  &--selected &__visibilityIcon {
    opacity: 1;
  }
}
</style>