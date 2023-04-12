<script setup>
import { computed, shallowRef, watch, watchEffect } from 'vue'

import { useI18n } from '@/packages/i18n'
import { useNavigation, useStylesheets } from '../../functions'
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

const emit = defineEmits(['update:story'])

const innerStory = shallowRef()
const currentPage = shallowRef()

const $nav = useNavigation(innerStory)

watch(
  () => props.story,
  () => {
    innerStory.value = props.story
    currentPage.value = innerStory.value.pages.find((p) => p.id == props.currentPageId) || innerStory.value.pages?.[0]
    $nav.goTo(currentPage.value?.id)

  },
  { immediate: true, deep: true },
)

watch(
  () => props.currentPageId,
  (newPageId) => {
    const foundPage = innerStory.value.pages.find((p) => p.id == newPageId)
    if (!foundPage) {
      return
    }
    currentPage.value = foundPage
    $nav.goTo(foundPage.id)
  },
)

watchEffect(() => useStylesheets(props.story))

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
      :enter-from-class="`phi-navigation-enter-from phi-navigation-${$nav.transitionDirection}-enter-from`"
      :enter-active-class="`phi-navigation-enter-active phi-navigation-${$nav.transitionDirection}-enter-active`"
      :enter-to-class="`phi-navigation-enter-to phi-navigation-${$nav.transitionDirection}-enter-to`"
      :leave-from-class="`phi-navigation-leave-from phi-navigation-${$nav.transitionDirection}-leave-from`"
      :leave-active-class="`phi-navigation-leave-active phi-navigation-${$nav.transitionDirection}-leave-active`"
      :leave-to-class="`phi-navigation-leave-to phi-navigation-${$nav.transitionDirection}-leave-to`"
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

    margin: auto;
    padding: 3px;


    &::before {
      display: block;
      position: absolute;
      left: 0;

      font-size: 8pt;
      font-weight: bold;
      opacity: 0.5;

      padding: 2px;
      border-radius: 4px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:hover {
      border-color: var(--ui-color-primary);
      &::before {
        opacity: 1;
        color: var(--ui-color-primary);
      }
    }
  }

  &__header {
    border-bottom: 2px solid var(--outline-color);
    padding-bottom: 24px;
    margin-bottom: 1rem;

    &::before {
      bottom: 0;
      content: var(--storyeditor-header-title, 'Header');
    }
  }

  &__footer {
    border-top: 2px solid var(--outline-color);
    padding-top: 24px;
    margin-top: 1rem;

    &::before {
      top: 0;
      content: var(--storyeditor-footer-title, 'Footer');
    }
  }
}
</style>