<script setup>
import { ref, watchEffect, computed, inject } from 'vue'
import { UiInput } from '@/packages/ui'

const injectedStory = inject('_cms_currentStory', null)
const availablePages = computed(() => injectedStory?.value?.pages || [])

const props = defineProps({
  /**
   BLOCK object
   {
     "component": "NavigationMenu",
     "props": {
       "items": [
          {
            pageId: '',
            text: '',

            ... all attributes to be bound to <a>
            href: '' (required if pageId is null)
            target: '',
            title: '',
            ...
          }
       ]
     }
   }
  */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const block = ref({})
const selectedPageIds = ref([])

watchEffect(() => {
  block.value = {
    component: 'NavigationMenu',
    ...props.modelValue,
    props: {
      items: [],
      ...props.modelValue?.props,
    },
  }

  selectedPageIds.value = block.value.props.items
    .filter((item) => !!item.pageId)
    .map((item) => item.pageId)
})

function emitInput() {
  const items = availablePages.value
    .filter((page) => selectedPageIds.value.includes(page.id))
    .map((page) => {
      return {
        pageId: page.id,
        text: page.title,
      }
    })

  emit('update:modelValue', {
    ...block.value,
    props: {
      ...block.value.props,
      items,
    },
  })
}
</script>

<template>
  <div class="NavigationMenuEditor">
    <UiInput
      v-model="selectedPageIds"
      multiple
      type="select-list"
      :options="availablePages"
      option-text="$.title"
      option-value="$.id"
      @update:model-value="emitInput"
    />
  </div>
</template>