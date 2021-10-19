<script setup>
import { ref } from 'vue'
import { UiStory } from '.'

const story = ref({
  nodes: [
    { id: 1, contents: 'Nodo 1' },
    { id: 2, contents: 'Nodo 2' },
    { id: 3, contents: 'Nodo 3', target: 'dialog' },
  ],

  paths: [
    { from: 1, to: 2, text: 'Continuar' },
    { from: 2, to: 3, text: 'Continuar' },
  ],
})

const target = ref('')
const refStory = ref()

</script>

<template>
  <UiStory
    ref="refStory"
    :model-value="story"
  >
    <template #contents="{ node }">
      bla bla nodo
      <pre>node: {{ node }}</pre>
    </template>
  </UiStory>

  <input
    v-model="target"
    type="text"
  >
  <button @click="refStory.goTo(target)">
    goTo({{ target }})
  </button>
  <button @click="refStory.openDialog(target)">
    openDialog({{ target }})
  </button>
</template>