<script setup>
/*
Manages (CRUD) an ARRAY of CSSCLASS objects:
[
  {
    name: 'myClass',
    css: `
      .myClass {
        border: 1px solid red;
      }
    `,

    text,
    subtext,
    description,
  }
]

and a SELECTION.  An array of selected class names
i.e. ['myClass', 'someOtherClass']
*/
import { ref, watch, computed, watchEffect } from 'vue'
import { UiDrawer, UiItem, UiIcon } from '../../../ui'
import CssClassEditor from './CssClassEditor.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: false,
    default: null,
  },

  selection: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'update:selection'])

const arrClasses = ref([])
watchEffect(() => {
  arrClasses.value = props.modelValue?.length ? JSON.parse(JSON.stringify(props.modelValue)) : []
})

function emitUpdate() {
  emit('update:modelValue', [ ...arrClasses.value ])
}

/* Manage selection */
const innerSelection = ref([])
watch(
  () => props.selection,
  (newValue) => {
    innerSelection.value = Array.isArray(newValue) ? newValue.concat() : []
  },
  { immediate: true },
)

// isSelected[class NAME] = true|false
const isSelected = computed(() => {
  const retval = {}
  innerSelection.value.forEach((className) => retval[className] = true)

  return retval
})

function toggleClassName(className) {
  const foundIndex = innerSelection.value.indexOf(className)
  if (foundIndex === -1) {
    innerSelection.value.push(className)
  } else {
    innerSelection.value.splice(foundIndex, 1)
  }

  emit('update:selection', innerSelection.value.concat())
}

function onClassRename({ newName, oldName }) {
  innerSelection.value = innerSelection.value.map((className) => className == oldName ? newName : className)
  emit('update:selection', innerSelection.value.concat())
}



function onDeleteClass(index) {
  const deletedClass = arrClasses.value[index]
  arrClasses.value.splice(index, 1)
  emitUpdate()

  // remove class from selection
  innerSelection.value = innerSelection.value.filter((className) => className != deletedClass.name)
  emit('update:selection', innerSelection.value.concat())
}

const isDrawerOpen = ref([]) // isDrawerOpen[drawer index] = true|false

function createNewClass() {
  const newClass = {
    name: 'new-class',
    css: '.new-class {\n\n}',
  }

  arrClasses.value.push(newClass)
  emitUpdate()
  isDrawerOpen.value[arrClasses.value.length - 1] = true

  // select newly created class
  innerSelection.value.push(newClass.name)
  emit('update:selection', innerSelection.value.concat())
}

/*
Class names present in selection but not present in arrClasses (modelValue)
*/
const orphanedClasses = computed(() => innerSelection.value.filter((className) =>
  !arrClasses.value.find((objClass) => objClass.name == className)))
</script>

<template>
  <div class="CssClassManager UiForm UiForm--wide">
    <template
      v-for="(cssClass, i) in arrClasses"
      :key="i"
    >
      <UiDrawer v-model:open="isDrawerOpen[i]">
        <template #trigger>
          <div
            class="CssClassManager__trigger CssClassItem"
            :class="{'CssClassItem--selected': isSelected[cssClass.name]}"
          >
            <UiIcon
              :src="isSelected[cssClass.name] ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'"
              class="CssClassItem__checkbox ui--clickable"
              @click.stop="toggleClassName(cssClass.name)"
            />
            <UiItem
              :icon="isDrawerOpen[i] ? 'mdi:menu-down' : 'mdi:menu-right'"
              :text="cssClass.text || cssClass.name"
              :subtext="cssClass.text ? '.' + cssClass.name : ''"
              class="ui--clickable"
            >
              <template #actions>
                <UiIcon
                  src="mdi:close"
                  class="CssClassItem__delete ui--clickable"
                  @click="onDeleteClass(i)"
                />
              </template>
            </UiItem>
          </div>
        </template>
        <template #contents>
          <CssClassEditor
            v-model="arrClasses[i]"
            @update:model-value="emitUpdate()"
            @rename="onClassRename"
          />
        </template>
      </UiDrawer>
    </template>

    <UiItem
      icon="mdi:plus"
      text="Add class"
      class="CssClassAdder ui--clickable"
      @click="createNewClass"
    />
  </div>
</template>

<style lang="scss">
.CssClassManager {
  &__trigger {
    display: flex;
    align-items: center;

    .UiItem {
      flex: 1;
    }
  }
}

.CssClassAdder,
.CssClassItem {
  --ui-item-padding: 8px 12px;
}

.CssClassItem {
  display: flex;
  align-items: stretch;

  &--selected {
    background-color: rgba(255,255,255, 0.1);
  }

  .ui--clickable {
    &:hover {
      background-color: rgba(255,255,255, 0.1) !important;
    }
  }

  &__checkbox {
    width: 40px;
  }
}

.CssClassAdder {
  margin-top: 1rem;
}
</style>