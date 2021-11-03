<script setup>
import { inject } from 'vue'
import { UiItem, UiIcon } from '/packages/ui/components'

const story = inject('$_cms_story', {})
</script>

<template>
  <div class="StoryNavigation">
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
  </div>
</template>