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
*/
import { ref, watchEffect } from 'vue'
import { UiDetails, UiItem } from '../../../ui'
import CssClassEditor from './CssClassEditor.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const arrClasses = ref([])
watchEffect(() => {
  arrClasses.value = props.modelValue?.length ? [ ...props.modelValue ] : []
})

function emitUpdate() {
  emit('update:modelValue', [ ...arrClasses.value ])
}

function onDeleteClass(index) {
  arrClasses.value.splice(index, 1)
  emitUpdate()
}


const isCreatorOpen = ref(false)

const newClass = ref({
  name: 'new-class',
  css: '.new-class {\n\n}',
})

function onCreatorSubmit() {
  arrClasses.value.push({ ...newClass.value })
  emitUpdate()
  resetCreator()
}

function resetCreator() {
  isCreatorOpen.value = false
  newClass.value = {
    name: 'new-class',
    css: '.new-class {\n\n}',
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
        :text="cssClass.text || cssClass.name"
        :subtext="cssClass.text ? '.' + cssClass.name : ''"
        @delete="onDeleteClass(i)"
      >
        <template #default>
          <section>
            <CssClassEditor
              v-model="arrClasses[i]"
              @update:model-value="emitUpdate()"
            />
          </section>
        </template>
      </UiDetails>
    </template>

    <UiDetails
      v-model:open="isCreatorOpen"
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