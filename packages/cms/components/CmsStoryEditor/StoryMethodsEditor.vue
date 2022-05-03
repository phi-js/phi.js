<script setup>
import { ref, watchEffect } from 'vue'
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

const storyMethods = ref([])
watchEffect(() => storyMethods.value = Array.isArray(props.story?.methods) ? props.story.methods : [])

function emitUpdate() {
  emit('update:story', { ...props.story, methods: storyMethods.value })
}

function appendMethod() {
  const newMethod = {
    name: '',
    do: { chain: [] },
  }
  storyMethods.value.push(newMethod)
}

function deleteMethodAt(i) {
  storyMethods.value.splice(i, 1)
  emitUpdate()
}
</script>

<template>
  <div class="StoryMethodsEditor">
    <div
      v-for="(method, i) in storyMethods"
      :key="i"
      class="StoryMethod"
    >
      <UiIcon
        src="mdi:close"
        class="StoryMethod__delete ui--clickable"
        @click="deleteMethodAt(i)"
      />

      <UiDrawer>
        <template #trigger>
          <UiItem
            icon="mdi:function"
            :text="method.name"
            class="StoryMethod__trigger ui--clickable"
          />
        </template>
        <template #contents>
          <UiInput
            v-model="storyMethods[i].name"
            type="text"
            label="Name"
            @update:model-value="emitUpdate()"
          />
          <VmStatement
            v-model="storyMethods[i].do"
            @update:model-value="emitUpdate()"
          />
        </template>
      </UiDrawer>
    </div>

    <UiItem
      icon="mdi:plus"
      text="Crear función"
      class="StoryMethodsEditor__adder ui--clickable"
      @click="appendMethod()"
    />
  </div>
</template>

<style lang="scss">
.StoryMethod {
  position: relative;

  &__delete {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;

    width: 40px;
    height: 40px;
  }
}
</style>