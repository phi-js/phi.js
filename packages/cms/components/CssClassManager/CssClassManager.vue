<script setup>
/*
Given an array of STYLESHEETS,
this component will CRUD manage those with type=class
[
  {
    id: 'highlihgtedTexts',
    src: '.highlihgtedTexts {\n}\n\n.highlihgtedTexts h2 {\n  color: var(--ui-color-primary);\n  font-weight: 600;\n  font-size: 3em;\n}',
    type: 'class',
  },
  {
    id: 'my-group',
    src: '.my-group {\n  margin: 2rem 0;\n  border-radius: 5px;\n  background-color: var(--ui-color-z1);\n  padding: 12px 16px;\n}\n\n.my-group h3 {\n  font-weight: 600;\n}',
    type: 'class',
  },
  ...
]
*/
import { ref, watch } from 'vue'
import { UiDetails } from '@/packages/ui'
import CssClassEditor from './CssClassEditor.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'created'])

const arrClasses = ref([])
watch(
  () => props.modelValue,
  (newValue) => arrClasses.value = newValue.filter((sheet) => sheet.type == 'class'),
  { immediate: true },
)

function emitUpdate() {
  const targetValue = props.modelValue.filter((sheet) => sheet.type != 'class')
  targetValue.push(...arrClasses.value)
  emit('update:modelValue', targetValue)
}

function onDeleteClass(index) {
  if (!confirm(`Delete class '${arrClasses.value[index].id}'?`)) {
    return
  }

  arrClasses.value.splice(index, 1)
  emitUpdate()
}

const isCreatorOpen = ref(false)

const newClass = ref({
  id: 'new-class',
  src: '.new-class {\n  \n}',
  type: 'class',
})

function onCreatorSubmit() {
  const created = { ...newClass.value }
  arrClasses.value.push(created)
  emitUpdate()
  emit('created', created)
  resetCreator()
}

function resetCreator() {
  isCreatorOpen.value = false
  newClass.value = {
    id: 'new-class',
    src: '.new-class {\n  \n}',
    type: 'class',
  }
}
</script>

<template>
  <div class="CssClassManager">
    <template
      v-for="(cssClass, i) in arrClasses"
      :key="i"
    >
      <UiDetails
        class="CssClassManager__classItem"
        group="CssClassManager"
        @delete="onDeleteClass(i)"
      >
        <template #summary>
          <div class="CssClassManager__summary">
            <slot
              name="left"
              :className="cssClass.id"
            />
            <div class="CssClassManager__info">
              <h3
                v-if="cssClass.title || cssClass.id"
                class="CssClassManager__text"
                v-text="cssClass.title || cssClass.id"
              />
              <p
                v-if="cssClass.description"
                class="CssClassManager__subtext"
                v-text="cssClass.description"
              />
            </div>
          </div>
        </template>

        <template #default>
          <section>
            <CssClassEditor
              v-model="arrClasses[i]"
              @update:model-value="emitUpdate()"
            />
          </section>
        </template>

        <template #actions>
          <slot
            name="right"
            :className="cssClass.id"
          />
        </template>
      </UiDetails>
    </template>

    <UiDetails
      v-model:open="isCreatorOpen"
      group="CssClassManager"
      text="Add class"
      class="CssClassManager__adder"
    >
      <form @submit.prevent="onCreatorSubmit">
        <CssClassEditor
          v-model="newClass"
        />

        <footer>
          <button
            type="submit"
            class="UiButton"
          >
            Create
          </button>
          <button
            type="button"
            class="UiButton UiButton--cancel"
            @click="resetCreator"
          >
            Cancel
          </button>
        </footer>
      </form>
    </UiDetails>
  </div>
</template>