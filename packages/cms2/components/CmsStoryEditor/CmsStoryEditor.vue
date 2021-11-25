<script setup>
import { ref, watch, computed } from '@vue/runtime-core'
import CmsBlockEditor from '../CmsBlockEditor/CmsBlockEditor.vue'
import { UiInput } from '/packages/ui/components'

const props = defineProps({
  story: {
    type: Object,
    required: false,
    default: () => ({}),
  },

  settings: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:story'])

const pages = ref([])
const currentPageId = ref(null)

watch(
  () => props.story,
  (newValue) => {
    pages.value = newValue?.pages || []
    if (pages.value.length && !currentPageId.value) {
      currentPageId.value = pages.value[0].id
    }
  },
  { immediate: true },
)


const currentPage = computed({
  get() {
    return currentPageId.value ? pages.value.find((p) => p.id == currentPageId.value) : null
  },

  set(newValue) {
    if (!currentPageId.value) {
      return
    }

    const currentPageIndex = pages.value.findIndex((p) => p.id == currentPageId.value)
    pages.value[currentPageIndex] = newValue
    emitUpdate()
  },
})

function emitUpdate() {
  emit('update:story', {
    ...props.story,
    pages: pages.value,
  })
}
</script>

<template>
  <div class="CmsStoryEditor">
    <div class="CmsStoryEditor__toolbar">
      <UiInput
        v-model="currentPageId"
        type="select-native"
        :options="pages"
        option-text="$.id"
        option-value="$.id"
      />
    </div>

    <keep-alive>
      <CmsBlockEditor
        v-if="currentPage"
        :key="currentPage.id"
        v-model:block="currentPage"
        :settings="settings"
      />
    </keep-alive>
  </div>
</template>