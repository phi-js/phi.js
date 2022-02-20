<script setup>
import { ref, watch } from 'vue'
import { UiTree, UiItem, UiIcon } from '@/packages/ui/components'

const props = defineProps({
  story: {
    type: Object,
    required: true,
  },
})
// const emit = defineEmits(['update:currentPageIndex'])
</script>

<template>
  <UiTree
    :value="innerBlock.slot"
    children-prop="slot"
    class="StoryTree"
    :initial-open="() => true"
  >
    <template #default="{item, isOpen, children, toggle}">
      <UiItem
        icon="mdi:package-variant"
        :text="item.component"
        class="ui--clickable ui--noselect"
        @click="toggle"
      >
        <template
          v-if="children?.length"
          #actions
        >
          <UiIcon :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" />
        </template>
      </UiItem>
    </template>
  </UiTree>
</template>