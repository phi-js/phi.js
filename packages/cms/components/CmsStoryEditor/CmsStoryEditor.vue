<script setup>
import { ref, watch, computed } from '@vue/runtime-core'
import CmsBlockEditor from '../CmsBlockEditor/CmsBlockEditor.vue'
import { UiItem, UiInput, UiGraphGrid, UiDrawer } from '/packages/ui/components'

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

const storyGraph = computed(() => ({
  nodes: props.story.pages.map((page) => ({ id: page.id })),
  paths: props.story.paths,
}))
</script>

<template>
  <div class="CmsStoryEditor">
    <UiDrawer>
      <template #trigger>
        <UiItem
          icon="mdi:sitemap"
          class="ui--clickable"
          text="Show map"
        />
      </template>
      <template #contents="{ close }">
        <UiGraphGrid
          :graph="storyGraph"
          @click-node="currentPageId = $event; close();"
        />
      </template>
    </UiDrawer>

    <keep-alive>
      <CmsBlockEditor
        v-if="currentPage"
        :key="currentPage.id"
        v-model:block="currentPage"
        :settings="settings"
      >
        <template #toolbar>
          <div class="CmsStoryEditor__toolbar">
            <span>/</span>
            <UiInput
              v-model="currentPageId"
              type="select-native"
              :options="pages"
              option-text="$.id"
              option-value="$.id"
            />

            <div style="margin-left: auto">
              <slot name="toolbar" />
            </div>
          </div>
        </template>
      </CmsBlockEditor>
    </keep-alive>
  </div>
</template>

<style lang="scss">
.CmsStoryEditor {
  &__toolbar {
    flex: 1;

    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    font-family: var(--ui-font-secondary);

    .ui__input {
      border: none;
      background: transparent;
      margin: 0;

      font-family: var(--ui-font-secondary);
      outline: none;
      cursor: pointer;

      &:hover {
        background-color: rgba(0,0,0, 0.04);
      }
    }
  }
}
</style>