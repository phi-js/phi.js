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
import { UiDrawer, UiItem } from '../../../ui'
import CssClassEditor from './CssClassEditor.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'class-added'])


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
  const newVal = { ...newClass.value }
  arrClasses.value.push(newVal)
  newClass.value = null
  emitUpdate()
  emit('class-added', newVal)
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
        <div class="CssClassManager__trigger">
          <slot
            name="trigger"
            :objClass="cssClass"
          />
          <UiItem
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
        </div>
      </template>
      <template #contents>
        <CssClassEditor
          v-model="arrClasses[i]"
          @update:model-value="emitUpdate()"
        />
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
</style>