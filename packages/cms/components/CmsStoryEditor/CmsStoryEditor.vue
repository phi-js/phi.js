<script setup>
import { ref, watch, computed } from 'vue'
import { UiStory } from '/packages/ui/components/UiStory'
import { UiItem, UiInput } from '/packages/ui/components'
import { CmsPageEditor } from '../CmsPageEditor'

const props = defineProps({
  story: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:story'])

const refStory = ref()
const story = ref()

watch(
  () => props.story,
  (newValue) => story.value = newValue ? JSON.parse(JSON.stringify(newValue)) : {},
  { immediate: true },
)

function updatePage(node, newPage) {
  const index = story.value.nodes.findIndex((n) => node.id === n.id)
  if (index === -1) {
    return // node not found
  }
  story.value.nodes[index].page = newPage
  emit('update:story', story.value)
}

const availableNodes = computed(() => story.value?.nodes?.length ? story.value.nodes.map((node) => ({
  text: node?.card?.text,
  value: node.id,
})) : [])
</script>

<template>
  <UiInput
    type="select"
    :options="availableNodes"
    :model-value="refStory?.currentNode?.id"
    @update:modelValue="refStory?.goTo"
  />

  <UiStory
    ref="refStory"
    class="CmsStoryEditor"
    :model-value="story"
  >
    <template #contents="{ node }">
      <UiItem
        v-show="refStory?.hasBack"
        class="ui-clickable ui-noselect ui-item--inline"
        icon="mdi:arrow-left-thick"
        text="Regresar"
        @click="refStory.goBack()"
      />

      <CmsPageEditor
        :page="node.page"
        @update:page="updatePage(node, $event)"
      />
    </template>
  </UiStory>
</template>