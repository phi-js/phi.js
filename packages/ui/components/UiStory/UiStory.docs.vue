<script setup>
import { ref, reactive } from 'vue'
import { UiItem } from '../UiItem'
import { UiInput } from '../UiInput'
import { UiStory } from '.'
const storyEl = ref()

const myStory = reactive({
  title: 'Inicio',
  text: 'Estas en el inicio.  No existe nada.',
  foo: 'whatever data',

  hijos: {
    izquierda: {
      title: 'Ir a la izquierda',
      foo: 'whatever data',
      text: 'Te mueves ligeramente a la izquierda',
    },

    derecha: {
      title: 'Ir a la derecha',
      foo: 'whatever data',
      text: 'Te mueves ligeramente a la derecha',
    },

    nothing: {
      title: 'No hacer nada',
      foo: 'whatever data',
      text: 'Te quedas quieto durante unos minutos',

      hijos: {
        seguir: {
          title: 'Seguir quieto un rato',
          text: '... sigues quieto un rato',
        },
      },
    },
  },
})

const active = ref('inicio')
function fetch(nodeName) {
  return nodeName == 'inicio' ? myStory : myStory.hijos[nodeName]
}

const newName = ref('')
</script>

<template>
  <fieldset>
    <legend>Controles externos</legend>
    <div class="ui-group --block">
      <UiInput
        v-model="active"
        type="select-list"
        label="Active"
        :options="[
          { value: 'inicio', text: 'Inicio' },
          { value: 'izquierda', text: 'izquierda' },
          { value: 'derecha', text: 'derecha' },
          { value: 'nothing', text: 'nothing' },
        ]"
      />

      <UiInput
        :model-value="active"
        type="text"
        label="Node ID:"
        @update:modelValue="newName = $event"
      />
      <UiInput
        type="button"
        :label="`active = ${newName}`"
        @click="active = newName"
      />
      <UiInput
        type="button"
        :label="`storyEl.push(${newName}, dialog)`"
        @click="storyEl.push(newName, 'dialog')"
      />
    </div>

    <UiInput
      v-model="myStory.title"
      type="text"
      label="myStory.title"
    />

    <UiInput
      v-if="myStory.hijos[active]"
      label="myStory.hijos[active]"
      type="json"
      vvvvv-v-model="myStory.hijos[active]"
      :model-value="myStory.hijos[active]"
      @update:modelValue="Object.assign(myStory.hijos[active], $event)"
    />
  </fieldset>

  <pre>active: {{ active }}</pre>

  <UiStory
    ref="storyEl"
    v-model:active="active"
    @fetch="fetch"
  >
    <template #default="{ node, back, target }">
      <UiItem
        v-if="back"
        :icon="target == 'dialog' ? 'mdi:close' : 'mdi:arrow-left-thick'"
        text="Back"
        class="ui-clickable"
        @click="back()"
      />

      <div class="ui-card">
        <h1>{{ node.title }}</h1>
        <p>{{ node.text }}</p>
        <pre>foo: {{ node.foo }}</pre>
      </div>
    </template>

    <template #footer="{ node, push }">
      <div class="ui-group">
        <UiInput
          v-for="(hijo, i) in myStory.hijos"
          :key="i"
          type="button"
          :label="`${hijo.title} (${i})`"
          @click="push(i)"
        />
      </div>
    </template>
  </UiStory>
  <!-- <pre>myStory: {{ myStory }}</pre> -->
</template>