<script setup>
import { ref, watch, computed } from 'vue'
import { CmsBlockEditor } from '../CmsBlockEditor'
import { CmsBlock } from '../CmsBlock'
import LayoutPageWindow from '../../plugins/layout/components/LayoutPage/LayoutPageWindow.vue'

import {
  UiDrawer,
  UiGraphGrid,
  UiItem,
  UiIcon,
} from '@/packages/ui/components'

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

  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:story', 'update:modelValue'])

const pages = ref([])
const curPage = ref()

const showPreview = ref(false)
const currentPageId = ref(null)
const windowIsOpen = ref(false)
const mapIsOpen = ref(false)

watch(
  () => props.story,
  (newValue) => {
    pages.value = newValue?.pages || []
    if (pages.value.length && !currentPageId.value) {
      currentPageId.value = pages.value[0].id
    }

    const foundPage = pages.value.find((p) => p.id == currentPageId.value)
    curPage.value = foundPage ? JSON.parse(JSON.stringify(foundPage)) : null
  },
  { immediate: true },
)

function setCurrentPageId(pageId) {
  const foundPage = pages.value.find((p) => p.id == pageId)
  if (!foundPage) {
    currentPageId.value = null
    curPage.value = null
    return
  }

  currentPageId.value = pageId
  curPage.value = JSON.parse(JSON.stringify(foundPage))
}

function windowOnCancel() {
  const foundPage = pages.value.find((p) => p.id == currentPageId.value)
  curPage.value = foundPage ? JSON.parse(JSON.stringify(foundPage)) : null
}

function emitUpdate() {
  emit('update:story', {
    ...props.story,
    pages: pages.value.map((page) => page.id == currentPageId.value ? { ...curPage.value } : page),
  })
}

const storyGraph = computed(() => ({
  nodes: props.story.pages.map((page) => ({ id: page.id })),
  paths: props.story.paths,
}))


const innerModelValue = ref({})
watch(
  () => props.modelValue,
  (newValue) => innerModelValue.value = newValue || {},
  { immediate: true },
)
</script>

<template>
  <div class="CmsStoryEditor">
    <div class="CmsStoryEditor__toolbar ui--noselect">
      <UiItem
        v-if="pages.length > 1"
        icon="mdi:sitemap"
        class="LayoutPageEditor__item"
        :text="currentPageId"
        @click="mapIsOpen = !mapIsOpen"
      >
        <template #actions>
          <UiIcon :src="mapIsOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
        </template>
      </UiItem>

      <UiItem
        icon="mdi:cog"
        class="ui--clickable"
        @click="windowIsOpen = true"
      />

      <label style="margin-left: auto"><input
        v-model="showPreview"
        type="checkbox"
      >Preview</label>
    </div>

    <UiDrawer v-model:open="mapIsOpen">
      <template #contents="{ close }">
        <UiGraphGrid
          :graph="storyGraph"
          @click-node="setCurrentPageId($event); close();"
        />
      </template>
    </UiDrawer>

    <TransitionGroup
      class="CmsStoryEditor__body"
      name="dotrans"
      tag="div"
    >
      <div
        v-show="!showPreview"
        key="bench"
        class="CmsStoryEditor__bench"
      >
        <KeepAlive>
          <CmsBlockEditor
            v-if="curPage"
            :key="curPage.id"
            v-model:block="curPage"
            :settings="settings"
            @update:block="emitUpdate"
          />
        </KeepAlive>
      </div>

      <div
        v-if="showPreview"
        key="preview"
        class="CmsStoryEditor__preview"
      >
        <CmsBlock
          v-model="innerModelValue"
          :block="{ ...curPage, 'v-if': undefined }"
          @update:modelValue="emit('update:modelValue', $event)"
        />
      </div>
    </TransitionGroup>

    <LayoutPageWindow
      v-model:open="windowIsOpen"
      v-model:block="curPage"
      @accept="emitUpdate"
      @cancel="windowOnCancel"
    />
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

    position: relative;
    z-index: 2;
  }
}

/* TRANSITION */
.CmsStoryEditor {
  --ridge-width: 38px;

  * {
    box-sizing: border-box;
  }

  &__body {
    position: relative;
  }

  .dotrans-enter-active,
  .dotrans-leave-active {
    transition: all var(--ui-duration-snap);
    opacity: 1;
  }

  .dotrans-leave-active {
    position: absolute !important;
    top: 0;
    left: 0;
    right: 0;
  }

  .dotrans-enter-from,
  .dotrans-leave-to {
    opacity: 0;

    &.CmsStoryEditor__bench {
      --ridge-width: 0px;
    }

    &.CmsStoryEditor__preview {
      margin-left: var(--ridge-width);
      padding-left: 12px;
    }
  }
}
</style>