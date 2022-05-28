<script setup>
import { ref, watchEffect, nextTick } from 'vue'
import { UiItem, UiDrawer, UiInput, UiIcon } from '../../../ui'
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

function appendMethod() {
  endangeredIndex.value = -1

  const newMethod = {
    name: '',
    do: { chain: [] },
  }
  storyMethods.value.push(newMethod)

  // Expand newly created element
  nextTick(() => {
    el.value.querySelectorAll('.StoryMethodsEditor__method')[storyMethods.value.length - 1].setAttribute('open', true)
  })
}

function deleteMethodAt(i) {
  storyMethods.value.splice(i, 1)
  emitUpdate()
}

const endangeredIndex = ref(-1)
</script>

<template>
  <div
    ref="el"
    class="StoryMethodsEditor"
  >
    <details
      v-for="(method, i) in storyMethods"
      :key="i"
      class="StoryMethodsEditor__method"
      :class="{'StoryMethodsEditor__method--endangered': endangeredIndex === i}"
    >
      <summary>
        <UiItem
          :text="method.name || '...'"
        >
          <template #actions>
            <UiIcon
              src="mdi:close"
              @click="deleteMethodAt(i)"
              @mouseenter="endangeredIndex = i"
              @mouseleave="endangeredIndex = -1"
            />
          </template>
        </UiItem>
      </summary>
      <section>
        <UiInput
          v-model="storyMethods[i].name"
          type="text"
          placeholder="Function name"
          @update:model-value="emitUpdate()"
        />
        <VmStatement
          v-model="storyMethods[i].do"
          @update:model-value="emitUpdate()"
        />
      </section>
    </details>

    <UiItem
      icon="mdi:plus"
      text="Crear función"
      class="StoryMethodsEditor__adder"
      @click="appendMethod()"
    />
  </div>
</template>