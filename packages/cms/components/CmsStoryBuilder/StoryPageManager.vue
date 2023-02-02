<script setup>
import { computed, inject, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { useI18n } from '@/packages/i18n'
import { UiItem, UiDialog } from '@/packages/ui'
import StoryPageItem from './StoryPageItem.vue'

const i18n = useI18n({
  en: {
    'StoryPageManager.DeleteThisPage': 'Delete this page?',
    'StoryPageManager.CreatePage': 'Create page',
  },
  es: {
    'StoryPageManager.DeleteThisPage': 'Eliminar esta página?',
    'StoryPageManager.CreatePage': 'Crear página',
  },
})

const props = defineProps({
  story: {
    type: Object,
    required: true,
  },

  currentPageId: {
    type: [String, Number],
    required: false,
    default: null,
  },
})

const emit = defineEmits([
  'update:story',
  'update:currentPageId',
  'open-editor',
])

const innerPages = ref()
watch(
  () => props.story.pages,
  (arrPages) => innerPages.value = Array.isArray(arrPages) ? arrPages : [],
  { immediate: true },
)

function emitUpdate() {
  emit('update:story', {
    ...props.story,
    pages: innerPages.value,
  })
}

function deletePage(pageId) {
  if (!confirm(i18n.t('StoryPageManager.DeleteThisPage'))) {
    return
  }

  const foundIndex = innerPages.value.findIndex((p) => p.id == pageId)
  if (foundIndex >= 0) {
    innerPages.value.splice(foundIndex, 1)
    emitUpdate()
  }
}

const currentPage = computed({
  get() {
    return innerPages.value.find((p) => p.id == props.currentPageId) || innerPages.value?.[0]
  },
  set(newValue) {
    const foundIndex = innerPages.value.findIndex((p) => p.id == props.currentPageId) || 0
    if (!innerPages.value[foundIndex]) {
      return
    }
    innerPages.value[foundIndex] = newValue
  },
})


const isDialogOpen = ref(false)

const openBlockWindow = inject('$_cms_openBlockWindow')
const newPage = ref()

function onCurrentPageClickAction(actionId) {
  openBlockWindow(
    {
      innerBlock: currentPage,
      updateBlock: () => {
        emitUpdate()
      },
    },
    actionId,
  )
}

function onPageClick(page) {
  isDialogOpen.value = false
  emit('update:currentPageId', page.id)
}

function openPageCreator() {
  isDialogOpen.value = false

  newPage.value = {
    id: `p${innerPages.value.length + 1}`,
    component: 'LayoutPage',
  }

  openBlockWindow(
    {
      innerBlock: newPage,
      updateBlock: (newValue) => {
        innerPages.value.push(newValue)
        newPage.value = null
        emitUpdate()
        emit('update:currentPageId', newValue.id)
      },
      cancel: () => newPage.value = null,
    },
    'LayoutPageSettings',
  )
}
</script>

<template>
  <div class="StoryPageManager">
    <StoryPageItem
      v-if="currentPage"
      v-model="currentPage"
      @click="isDialogOpen = !isDialogOpen"
      @click-action="onCurrentPageClickAction"
      @delete="deletePage(currentPage.id)"
    />
    <UiItem
      v-else
      :text="currentPageId"
      @click="isDialogOpen = !isDialogOpen"
    />

    <UiDialog
      v-model:open="isDialogOpen"
      show-close-button
    >
      <template #contents>
        <draggable
          v-model="innerPages"
          class="StoryPageManager__list"
          group="StoryPageManager"
          handle=".UiItem__icon"
          item-key="id"
          :animation="111"
          :empty-insert-threshold="0"
          :swap-threshold="0.5"
          :inverted-swap-threshold="1"

          @update:model-value="emitUpdate"
        >
          <template #item="{ element }">
            <UiItem
              icon="mdi:drag-vertical"
              class="StoryPageManager__dragItem"
            >
              <UiItem
                class="StoryPageManager__listItem"
                :class="{'StoryPageManager__listItem--selected': element.id == currentPageId}"
                icon="mdi:file"
                :text="element.title || element.hash || element.id"
                :subtext="`#${element.hash}`"
                @click="onPageClick(element)"
              />
            </UiItem>
          </template>

          <template #footer>
            <UiItem
              class="StoryPageManager__pageAdder"
              icon="mdi:plus"
              :text="i18n.t('StoryPageManager.CreatePage')"
              @click="openPageCreator"
            />
          </template>
        </draggable>
      </template>
    </UiDialog>
  </div>
</template>

<style lang="scss">
@import '@/packages/cms/themes/base/classes/outset.scss';

.StoryPageManager {
  &__list {
    padding: 16px;

    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__dragItem {
    & > .UiItem__icon {
      cursor: move;
      padding: 0 8px;
    }
  }

  &__listItem {
    @extend .outset;

    --ui-item-padding: 4px 12px;
    user-select: none;

    padding: 8px;
    border-radius: 6px;
    color: var(--ui-color-foreground);
    background-color: var(--ui-color-background);
    cursor: pointer;

    &--selected {
      border: 2px solid var(--ui-color-primary);
      opacity: 1;
    }
  }

  &__pageAdder {
    --ui-item-padding: 12px 12px;
    user-select: none;

    font-size: 0.8rem;
    font-weight: bold;
    border-radius: 5px;
    border: 2px dashed rgba(153, 153, 153, 0.5333333333);

    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }
  }
}
</style>