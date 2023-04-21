<!-- eslint-disable max-len -->
<script setup>
/*
This component receives a Block object and manages its "class" property,
which is an ARRAY of CLASS items.

a CLASS item can be:
- A  string representing a classname.  e.g. "some-header"
- An object, with a VM expression.  e.g. { "if": { ... }, "then": "my-class" }

It wraps a CssClassManager object, and links its value to the globally provided story class list
*/
import { ref, inject, watch, computed } from 'vue'

import { UiIcon, UiDialog, UiButton, UiItem, UiItemFinder } from '@/packages/ui'
import CssEditor from '@/packages/ui/components/CssEditor/CssEditor.vue'
import { cssStringToObject, cssObjectToString } from '@/packages/ui/components/CssEditor/helpers.js'

import { VmStatement } from '@/packages/vm'

const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const injectedStory = inject('_cms_currentStory', {})

const storyClasses = ref(injectedStory.value.stylesheets.filter((sheet) => sheet.type == 'class'))
const sheetsWithClasses = injectedStory.value.stylesheets.filter((sheet) => Array.isArray(sheet.classes))

/*
Hash with info on ALL available classes
{
  "className": {
    name: "className",
    text: "Class name",
    subtext: "Class description",
    icon: "class:icon",
    parent: {
      id: 'story',
      text: 'Custom story classes',
      subtext: 'Classes declared in the story IDK',
    },
  }
}
*/
const hashThemeClasses = computed(() => {
  const retval = {}

  storyClasses.value.forEach((sheet) => {
    retval[sheet.id] = {
      name: sheet.id,
      text: sheet.title || sheet.id,
      subtext: sheet.description,
      icon: sheet.thumbnail,
      parent: {
        id: 'story',
        text: 'Custom CSS classes',
      },
    }
  })

  sheetsWithClasses.forEach((sheet) => {
    sheet.classes.forEach((themeClass) => {
      retval[themeClass.name] = {
        ...themeClass,
        parent: {
          id: sheet.id,
          text: sheet.title,
          subtext: sheet.description,
        },
      }
    })
  })

  return retval
})



/*
blockClassList is an array of NORMALIZED array of class objects
as objects with "name", "condition"

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
  () => props.modelValue,
  (incomingBlock) => {
    const blockClasses = Array.isArray(incomingBlock?.props?.class)
      ? incomingBlock.props.class
      : incomingBlock?.props?.class ? [incomingBlock?.props?.class] : []

    blockClassList.value = blockClasses
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

  return true
}

function removeClass(className) {
  const foundIndex = blockClassList.value.findIndex((c) => c.name == className)
  if (foundIndex >= 0) {
    blockClassList.value.splice(foundIndex, 1)
  }
  emitUpdate()
}


/*
All available classes represented as an item array (which may include children)
[
  {
    name: 'className',
    text: 'Class Name',
    subtext: 'hello',
    icon: 'mdi:water',
    children: [
      ....
    ]
  }
]
*/
const availableClasses = computed(() => {
  const retval = []

  if (storyClasses.value.length) {
    retval.push({
      text: 'Custom classes',
      subtext: 'Classes declared in Story',
      icon: 'mdi:liquid-spot',
      children: storyClasses.value.map((classObj) => {
        return {
          name: classObj.id,
          text: classObj.title || classObj.id,
          subtext: classObj.description,
          icon: classObj.icon || 'mdi:water',
          class: 'BlockCssEditor__finderItem' + (isClassSelected(classObj.id) ? ' BlockCssEditor__finderItem--selected' : ''),
        }
      }),
    })
  }

  sheetsWithClasses.forEach((sheet) => {
    retval.push({
      name: sheet.id,
      text: sheet.title || sheet.id,
      subtext: sheet.description,
      icon: sheet.icon || 'mdi:shape',
      children: sheet.classes.map((classItem) => ({
        ...classItem,
        icon: classItem.icon || 'mdi:water',
        class: 'BlockCssEditor__finderItem' + (isClassSelected(classItem.name) ? ' BlockCssEditor__finderItem--selected' : ''),
      })),
    })
  })

  retval.push({
    name: 'new',
    text: 'Create new class ...',
    icon: 'mdi:water-plus',
  })

  return retval
})

function onSelectItem($event) {
  if ($event?.name == 'new') {
    return promptNewClassName($event.name)
  }

  if ($event?.name) {
    return appendClass($event.name)
  }
}

function promptNewClassName() {
  const classTitle = window.prompt('Type a class name')
  if (!classTitle || !classTitle.trim()) {
    return
  }

  const className = classTitle.replace(/[^a-zA-Z0-9.\-_]/g, '')
  if (!className) {
    return
  }

  appendClass(className)

  const newSheet = { id: className, title: classTitle, type: 'class', src: `.${className } {\n\n}` }
  injectedStory.value.stylesheets.push(newSheet)
  storyClasses.value.push(newSheet)

  editingClassName.value = className
  isPickerOpen.value = false

  return true
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

  emit('update:modelValue', {
    ...props.modelValue,
    props: {
      ...props.modelValue?.props,
      class: classArray,
    },
  })
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
editableStylesheets: {
  className1: {...stylesheet definition },
  className2: {...stylesheet definition },
  ...
}
*/
const editableStylesheets = computed(() => {
  const retval = {}
  blockClassList.value.forEach((objClass) => {
    const found = storyClasses.value.find((c) => c.id == objClass.name)
    if (found) {
      retval[found.id] = found
    }
  })

  // Pseudo class "element.style", to be relayed to block.props.style
  retval['element.style'] = {
    id: 'element.style',
    title: 'Element style',
    src: cssObjectToString({
      'element.style': props.modelValue?.props?.style && typeof props.modelValue?.props?.style === 'object'
        ? props.modelValue.props.style
        : {},
    }),
  }

  return retval
})

function updateEditableStylesheet(className, newSrc) {
  if (className === 'element.style') {
    const objElementStyle = cssStringToObject(newSrc)

    if (objElementStyle && objElementStyle['element.style'] && Object.keys(objElementStyle['element.style']).length >= 0) {
      emit('update:modelValue', {
        ...props.modelValue,
        props: {
          ...props.modelValue?.props,
          style: objElementStyle['element.style'],
        },
      })
    } else {
      emit('update:modelValue', {
        ...props.modelValue,
        props: {
          ...props.modelValue?.props,
          style: undefined,
        },
      })
    }
    return
  }

  const matchingDeclaration = injectedStory.value.stylesheets.find((sheet) => sheet.id == className)
  if (matchingDeclaration) {
    matchingDeclaration.src = newSrc
  }
}

const editingClassName = ref(null)
const isPickerOpen = ref(false)

/*
All classes present in the block, normalized and organized into GROUPS:
[
  {
    text: 'Custom classes',
    subtext: 'Classes declared in the story',
    children: [
      {
        name: 'className',
        condition: null,

        // Data hydrated from class definition
        text: 'Class Name',
        subtext: 'Class description',
        icon: 'class_icon'
      }
    ]
  }
]
*/
const blockClassGroups = computed(() => {
  const distinctGroups = {} // distinctGroups[groupId] = { ...group data }

  blockClassList.value.forEach((blockClass) => {
    if (!hashThemeClasses.value[blockClass.name]) {
      return
    }

    const classInfo = hashThemeClasses.value[blockClass.name]
    if (!classInfo?.parent?.id) {
      return
    }

    if (typeof distinctGroups[classInfo.parent.id] === 'undefined') {
      distinctGroups[classInfo.parent.id] = { ...classInfo.parent }
      distinctGroups[classInfo.parent.id].children = []
    }

    distinctGroups[classInfo.parent.id].children.push({ ...classInfo, parent: undefined })
  })

  return Object.values(distinctGroups)
})

const blockHasStyle = computed(() => {
  if (!props.modelValue?.props?.style) {
    return false
  }

  if (typeof props.modelValue.props.style !== 'object') {
    return false
  }

  return Object.keys(props.modelValue.props.style).length > 0
})

</script>

<template>
  <div class="BlockCssEditor">
    <template v-if="editingClassName && editableStylesheets[editingClassName]">
      <CssEditor
        :model-value="editableStylesheets[editingClassName].src"
        @update:model-value="$event => updateEditableStylesheet(editingClassName, $event)"
        @back="editingClassName = null"
      >
        <template #header>
          <UiItem
            class="BlockCssEditor__headerItem"
            :text="editableStylesheets[editingClassName].title || editableStylesheets[editingClassName].id"
            icon="mdi:arrow-left-thick"
            @click-icon="editingClassName = null"
          />
        </template>
      </CssEditor>
    </template>
    <template v-else>
      <fieldset
        v-for="(classGroup, i) in blockClassGroups"
        :key="i"
        class="BlockCssEditor__fieldset"
      >
        <legend>{{ classGroup.text }}</legend>
        <UiItem
          v-for="(classItem) in classGroup.children"
          :key="classItem.name"
          :text="classItem.text"
          :subtext="classItem.subtext"
          :icon="editableStylesheets[classItem.name] ? 'mdi:arrow-right-thick' : ''"
          class="BlockCssEditor__classItem"
          @click="editingClassName = classItem.name"
        >
          <template #actions>
            <UiIcon
              class="BlockCssEditor__classIcon"
              :src="hasCondition(classItem.name) ? 'mdi:eye' : 'mdi:eye-outline'"
              @click="openVisibilityEditor(classItem.name)"
            />
            <UiIcon
              class="BlockCssEditor__classIcon"
              src="mdi:close"
              @click="removeClass(classItem.name)"
            />
          </template>
        </UiItem>
      </fieldset>

      <!-- class visibility conditions editor -->
      <UiDialog
        v-slot="{ close }"
        :open="!!editingClass"
        :close-button="false"
        @close="onEditorClose()"
      >
        <form
          class="BlockCssEditor__dialog"
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

      <!-- Class picker -->
      <UiDialog v-model:open="isPickerOpen">
        <template #trigger>
          <UiItem
            class="BlockCssEditor__adder"
            text="Add class"
            icon="mdi:plus"
          />
        </template>
        <template #default="{ close }">
          <UiItemFinder
            v-if="isPickerOpen"
            :items="availableClasses"
            @select-item="$event => onSelectItem($event) && close()"
          />
        </template>
      </UiDialog>

      <!-- Element styles link -->
      <UiItem
        class="BlockCssEditor__adder"
        text="Element style"
        icon="mdi:arrow-right-thick"
        @click="editingClassName = 'element.style'"
      >
        <template
          v-if="blockHasStyle"
          #actions
        >
          <UiIcon
            src="mdi:circle-medium"
            style="font-size: 24px; color:lightgreen;"
          />
        </template>
      </UiItem>
    </template>
  </div>
</template>