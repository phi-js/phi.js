<script setup>
import { computed, provide, ref, shallowRef, watch, watchEffect } from 'vue'

import { useI18n } from '@/packages/i18n'
import { useStylesheets } from '../../functions'
import CmsSlotEditor from '../CmsSlotEditor/CmsSlotEditor.vue'

const i18n = useI18n({
  en: {
    'CmsStoryEditor.Header': 'Header',
    'CmsStoryEditor.Footer': 'Footer',
    'CmsStoryEditor.Page': 'Page',
  },
  es: {
    'CmsStoryEditor.Header': 'Encabezado',
    'CmsStoryEditor.Footer': 'Pie de página',
    'CmsStoryEditor.Page': 'Página',
  },
})

const props = defineProps({
  story: {
    type: Object,
    required: false,
    default: () => ({}),
  },

  currentPageId: {
    type: [String, Number],
    required: false,
    default: null,
  },

  settings: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:story', 'update:current-page-id'])

const innerStory = shallowRef()
const currentPage = shallowRef()

watch(
  () => props.story,
  () => {
    innerStory.value = props.story
    currentPage.value = innerStory.value.pages.find((p) => p.id == props.currentPageId) || innerStory.value.pages?.[0]
  },
  { immediate: true, deep: true },
)

const transitionDirection = ref('forward') // 'forward' | 'back'

watch(
  () => props.currentPageId,
  (newPageId) => {
    const foundPage = innerStory.value.pages.find((p) => p.id == newPageId)
    if (!foundPage) {
      return
    }
    currentPage.value = foundPage
  },
)

watchEffect(() => useStylesheets(props.story.stylesheets))

function emitUpdate() {
  emit('update:story', { ...innerStory.value })
}

// isHeaderVISIBLE(?)
const isHeaderEnabled = computed({
  get() {
    // Return strictly defined boolean values
    if (currentPage.value?.isHeaderEnabled === false) {
      return false
    }
    if (currentPage.value?.isHeaderEnabled === true) {
      return true
    }

    // is not enabled/disabled explicitly:
    return innerStory.value.header?.length > 0
  },
  set(isEnabled) {
    currentPage.value.isHeaderEnabled = !!isEnabled
    emitUpdate()
  },
})

const isFooterEnabled = computed({
  get() {
    // Return strictly defined boolean values
    if (currentPage.value?.isFooterEnabled === false) {
      return false
    }
    if (currentPage.value?.isFooterEnabled === true) {
      return true
    }

    // is not enabled/disabled explicitly:
    return innerStory.value.footer?.length > 0
  },
  set(isEnabled) {
    currentPage.value.isFooterEnabled = !!isEnabled
    emitUpdate()
  },
})

// Provide navigation controls
provide('$_cms_story', {
  getPageHref: (pageId) => null,
  isPageActive: (pageId) => props.currentPageId == pageId,
  goTo: (pageId) => emit('update:current-page-id', pageId),
})
</script>

<template>
  <div
    class="CmsStoryEditor CmsStory"
    :style="{
      '--storyeditor-header-title': `'${i18n.t('CmsStoryEditor.Header')}'`,
      '--storyeditor-footer-title': `'${i18n.t('CmsStoryEditor.Footer')}'`,
    }"
  >
    <Transition
      name="phi-navigation"
      :enter-from-class="`phi-navigation-enter-from phi-navigation-${transitionDirection}-enter-from`"
      :enter-active-class="`phi-navigation-enter-active phi-navigation-${transitionDirection}-enter-active`"
      :enter-to-class="`phi-navigation-enter-to phi-navigation-${transitionDirection}-enter-to`"
      :leave-from-class="`phi-navigation-leave-from phi-navigation-${transitionDirection}-leave-from`"
      :leave-active-class="`phi-navigation-leave-active phi-navigation-${transitionDirection}-leave-active`"
      :leave-to-class="`phi-navigation-leave-to phi-navigation-${transitionDirection}-leave-to`"
    >
      <div
        :key="currentPage.id"
        class="CmsStory__page LayoutPage"
        :class="currentPage?.props?.class"
        :style="currentPage?.props?.style"
      >
        <!-- Page header -->
        <CmsSlotEditor
          v-if="isHeaderEnabled"
          v-model:slot="innerStory.header"
          class="CmsStoryEditor__header LayoutPage__header"
          :label="i18n.t('CmsStoryEditor.Header')"
          @update:slot="emitUpdate"
        />

        <!-- Page contents -->
        <CmsSlotEditor
          v-model:slot="currentPage.slots.default"
          class="CmsStoryEditor__contents LayoutPage__contents"
          @update:slot="emitUpdate"
        />

        <!-- Page footer -->
        <CmsSlotEditor
          v-if="isFooterEnabled"
          v-model:slot="innerStory.footer"
          class="CmsStoryEditor__footer LayoutPage__footer"
          :label="i18n.t('CmsStoryEditor.Footer')"
          @update:slot="emitUpdate"
        />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.CmsStoryEditor {
  --outline-color: #99999933;

  &__header,
  &__footer {
    position: relative;
    margin: 4px 0;
    margin-top: 24px;

    border: 1px solid var(--outline-color);
    border-radius: 4px;

    &::before {
      display: block;
      position: absolute;
      left: 0;
      bottom: 100%;

      font-size: 8pt;
      font-weight: bold;
      opacity: 0.5;

      padding: 2px 8px;
      background-color: var(--outline-color);
      border-radius: 4px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:hover::before {
      opacity: 1;
    }
  }

  &__header {
    margin-bottom: 2rem;
    &::before {
      content: var(--storyeditor-header-title, 'Header');
    }
  }

  &__footer {
    margin-top: calc(2rem + 24px);

    &::before {
      content: var(--storyeditor-footer-title, 'Footer');
    }
  }
}

</style>