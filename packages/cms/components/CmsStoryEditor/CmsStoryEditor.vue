<script setup>
import { computed, provide, ref, shallowRef, watch, watchEffect } from 'vue'

import { useStylesheets, sanitizeStory } from '../../functions'
import CmsSlotEditor from '../CmsSlotEditor/CmsSlotEditor.vue'
import BlockWindow from '../CmsBlockEditor/BlockWindow.vue'

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
    innerStory.value = sanitizeStory(JSON.parse(JSON.stringify(props.story)))
    currentPage.value = innerStory.value.pages.find((p) => p.id == props.currentPageId) || innerStory.value.pages?.[0]
  },
  { immediate: true },
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

// Block editor window (singleton in the story editor)
const editingBlock = shallowRef() // Instance of SlotItem
const currentActionId = ref()

function openBlockWindow(SlotBlock, actionId = null) {
  editingBlock.value = SlotBlock
  currentActionId.value = actionId
}

function closeBlockWindow() {
  editingBlock.value = null
}

/* Provided context/utilities for child blocks */
provide('_cms_CmsStoryEditor', {
  story: innerStory,
  openBlockWindow,
})

const isHeaderEnabled = computed({
  get() {
    return currentPage.value?.omitHeader !== true
  },
  set(isEnabled) {
    currentPage.value.omitHeader = !isEnabled
    emitUpdate()
  },
})

const isFooterEnabled = computed({
  get() {
    return currentPage.value?.omitFooter !== true
  },
  set(isEnabled) {
    currentPage.value.omitFooter = !isEnabled
    emitUpdate()
  },
})

</script>

<template>
  <div class="CmsStoryEditor CmsStory">
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
        class="CmsStory__page"
      >
        <div
          class="CmsStoryEditor__header"
          :class="{
            'CmsStoryEditor__header--empty': !innerStory.header?.length,
            'CmsStoryEditor__header--disabled': !isHeaderEnabled
          }"
        >
          <CmsSlotEditor
            v-model:slot="innerStory.header"
            class="LayoutPage__header"
            label="TO HEADER"
            @update:slot="emitUpdate"
          />
          <div class="CmsStoryEditor__separator">
            <label title="Toggle header for this page">
              <span>Header</span>
              <input
                v-model="isHeaderEnabled"
                type="checkbox"
              >
            </label>
          </div>
        </div>

        <CmsSlotEditor
          v-model:slot="currentPage.slots.default"
          class="CmsStoryEditor__contents LayoutPage__contents"
          label="TO PAGE"
          @update:slot="emitUpdate"
        />

        <div
          class="CmsStoryEditor__footer"
          :class="{
            'CmsStoryEditor__footer--empty': !innerStory.footer?.length,
            'CmsStoryEditor__footer--disabled': !isFooterEnabled
          }"
        >
          <div class="CmsStoryEditor__separator">
            <label title="Toggle footer for this page">
              <span>Footer</span>
              <input
                v-model="isFooterEnabled"
                type="checkbox"
              >
            </label>
          </div>

          <CmsSlotEditor
            v-model:slot="innerStory.footer"
            class="LayoutPage__footer"
            label="TO FOOTER"
            @update:slot="emitUpdate"
          />
        </div>
      </div>
    </Transition>

    <BlockWindow
      v-if="editingBlock"
      v-model:action-id="currentActionId"
      v-model:block="editingBlock.innerBlock"
      open
      @accept="editingBlock.updateBlock($event); closeBlockWindow()"
      @cancel="closeBlockWindow()"
    />
  </div>
</template>

<style lang="scss">
.CmsStoryEditor {
  &__header,
  &__footer {
    position: relative;

    &--disabled {
      opacity: 0.5;
      .CmsSlotEditor {
        pointer-events: none;
        &__footer {
          display: none;
        }
      }
    }
  }

  &__header {
    border-bottom: 1px dashed #525659;
  }
  &__footer {
    border-top: 1px dashed #525659;
  }

  &__separator {
    font-size: 9pt;
    font-weight: 600;
    text-align: right;

    label {
      user-select: none;

      display: inline-flex;
      align-items: center;
      gap: 6px;

      padding: 3px;
      cursor: pointer;
      input {
        cursor: pointer;
      }
      &:hover {
        background-color: var(--ui-color-hover);
      }
    }
  }
}

</style>