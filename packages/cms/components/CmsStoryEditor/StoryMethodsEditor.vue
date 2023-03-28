<script setup>
import { ref, watchEffect } from 'vue'
import { UiDetails, UiItem } from '../../../ui'
import { VmStatement } from '../../../vm'

const props = defineProps({
  /**
   * A STORY object:
   */
  story: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:story'])

const el = ref()

const storyMethods = ref([])
watchEffect(() => storyMethods.value = Array.isArray(props.story?.methods) ? props.story.methods : [])

function emitUpdate() {
  emit('update:story', { ...props.story, methods: storyMethods.value })
}

const openDetailIndexes = ref([])

function appendMethod() {
  const methodName = window.prompt('Method name')
  if (!methodName) {
    return
  }

  const found = storyMethods.value.find((v) => v.name == methodName)
  if (found) {
    alert(`Method '${methodName}' already exists`)
    return
  }

  storyMethods.value.push({
    name: methodName,
    do: { chain: [] },
  })

  emitUpdate()
  openDetailIndexes.value.push(storyMethods.value.length - 1)
}

function deleteMethodAt(i) {
  storyMethods.value.splice(i, 1)
  emitUpdate()
}
</script>

<template>
  <div
    ref="el"
    class="StoryMethodsEditor"
  >
    <UiDetails
      v-for="(method, i) in storyMethods"
      :key="i"
      class="StoryMethodsEditor__method"
      :text="method.name || '...'"
      :open="openDetailIndexes.includes(i)"
      @delete="deleteMethodAt(i)"
      @close="openDetailIndexes.splice(openDetailIndexes.indexOf(i), 1)"
    >
      <!-- <UiInput
        v-model="storyMethods[i].name"
        type="text"
        placeholder="Function name"
        @update:model-value="emitUpdate()"
      /> -->
      <VmStatement
        v-model="storyMethods[i].do"
        @update:model-value="emitUpdate()"
      />
    </UiDetails>

    <UiItem
      class="StoryMethodsEditor__adder"
      text="Create function"
      icon="mdi:plus"
      tabindex="0"
      @click="appendMethod"
      @keyup.enter="appendMethod"
    />
  </div>
</template>