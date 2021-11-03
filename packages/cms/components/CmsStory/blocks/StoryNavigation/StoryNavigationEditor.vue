<script setup>
import { inject } from 'vue'
import { UiItem, UiIcon, UiInput } from '/packages/ui/components'

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})

const story = inject('$_cms_story', {})

</script>

<template>
  <div class="StoryNavigationEditor">
    <UiItem
      v-for="(exit, i) in story?.currentNode?.exits || []"
      :key="i"
      :text="exit.card.text"
      class="StoryNavigation__exit ui--clickable ui--noselect ui-item--inline"
      @click="story.goTo(exit.to)"
    >
      <template #actions>
        <UiIcon src="mdi:arrow-right-thick" />
      </template>
    </UiItem>

    <UiInput
      type="text"
      placeholder="Crear página ..."
      @keypress.enter="story.createNode($event.target.value, story.currentNode.id).then(() => $event.target.value = '')"
    />
  </div>
</template>