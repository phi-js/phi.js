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

    icon,
    text,
    subtext,
    description,
  }
]
*/
import { ref, watchEffect } from 'vue'
import { UiDrawer, UiItem } from '../../../ui'
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
watchEffect(() => arrClasses.value = props.modelValue?.length ? [ ...props.modelValue ] : [])

function emitUpdate() {
  emit('update:modelValue', [ ...arrClasses.value])
}

function onDeleteClass(index) {
  arrClasses.value.splice(index, 1)
  emitUpdate()
}

const newClass = ref(null)
function onCreatorAccept() {
  arrClasses.value.push({ ...newClass.value })
  newClass.value = null
  emitUpdate()
  return true
}

function onCreatorCancel() {
  newClass.value = null
  return true
}
</script>

<template>
  <div class="CssClassManager UiForm UiForm--wide">
    <UiDrawer
      v-for="(cssClass, i) in arrClasses"
      :key="i"
    >
      <template #trigger>
        <UiItem
          icon="mdi:language-css3"
          :text="cssClass.text || cssClass.name"
          :subtext="cssClass.text ? '.' + cssClass.name : ''"
          class="ui--clickable"
        >
          <template #actions>
            <button @click="onDeleteClass(i)">
              &times;
            </button>
          </template>
        </UiItem>
      </template>
      <template #contents>
        <CssClassEditor
          v-model="arrClasses[i]"
          @update:modelValue="emitUpdate()"
        />
        <!-- <footer>
          <button
            type="button"
            class="UiButton UiButton--main"
            @click="close()"
            v-text="'Aceptar'"
          />
          <button
            type="button"
            class="UiButton UiButton--cancel"
            @click="close()"
            v-text="'Cancelar'"
          />
        </footer> -->
      </template>
    </UiDrawer>

    <UiDrawer>
      <template #trigger>
        <UiItem
          icon="mdi:plus"
          text="Add class"
          class="ui--clickable"
        />
      </template>
      <template #contents="{ close }">
        <CssClassEditor v-model="newClass" />
        <footer>
          <button
            type="button"
            class="UiButton UiButton--main"
            @click="onCreatorAccept() && close()"
            v-text="'Aceptar'"
          />
          <button
            type="button"
            class="UiButton UiButton--cancel"
            @click="onCreatorCancel() && close()"
            v-text="'Cancelar'"
          />
        </footer>
      </template>
    </UiDrawer>
  </div>
</template>