<script setup>
import { ref, watchEffect, nextTick } from 'vue'
import { UiItem, UiDetails, UiInput } from '../../../ui'
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

const newMethod = ref({
  name: '',
  do: { chain: [] },
})

function resetNewMethod() {
  newMethod.value = {
    name: '',
    do: { chain: [] },
  }
}

function appendMethod() {
  storyMethods.value.push(newMethod.value)
  emitUpdate()
  resetNewMethod()

  // Expand newly created element
  nextTick(() => {
    el.value.querySelectorAll('.StoryMethodsEditor__method')[storyMethods.value.length - 1].setAttribute('open', true)
  })
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
      group="StoryMethodsEditor"
      class="StoryMethodsEditor__method"
      :text="method.name || '...'"
      @delete="deleteMethodAt(i)"
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

    <UiDetails
      v-slot="{ close }"
      group="StoryMethodsEditor"
      text="Crear función"
    >
      <form @submit.prevent="appendMethod(); close();">
        <UiInput
          v-model="newMethod.name"
          type="text"
          placeholder="Function name"
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
            @click="resetNewMethod(); close();"
          >
            Cancel
          </button>
        </footer>
      </form>
    </UiDetails>
  </div>
</template>

<style lang="scss">
.StoryMethodsEditor {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>