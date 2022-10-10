<script setup>
import { ref, shallowRef, watch, inject } from 'vue'
import draggable from 'vuedraggable'

import { UiInput } from '@/packages/ui/components'
import StoryPageItem from './StoryPageItem.vue'

import { getBlockEditors } from '../../functions'

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

function deletePageAt(index) {
  if (!confirm('Delete this page?')) {
    return
  }

  innerPages.value.splice(index, 1)
  emitUpdate()
}

const availableActions = shallowRef([])

const editors = getBlockEditors({ component: 'LayoutPage' })
availableActions.value = editors?.actions || []

function onPageClick(page) {
  emit('update:currentPageId', page.id)
}

const openBlockWindow = inject('$_cms_openBlockWindow')
const newPage = ref()

function openPageCreator() {
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
    'settings',
  )
}

function onOpenEditor(index, actionId = null) {
  emit('open-editor', {
    index,
    actionId,
  })
}
</script>

<template>
  <div class="StoryPageList">
    <draggable
      v-model="innerPages"
      class="StoryPageList__draggable"
      group="StoryPageList"
      handle=".UiItem__icon"
      item-key="id"
      :animation="111"
      :empty-insert-threshold="0"
      :swap-threshold="0.5"
      :inverted-swap-threshold="1"

      @update:model-value="emitUpdate"
    >
      <template #item="{ element, index }">
        <StoryPageItem
          :model-value="element"
          :selected="element.id == currentPageId"
          @update:model-value="innerPages[index] = $event; emitUpdate();"
          @delete="deletePageAt(index)"
          @click="onPageClick(element)"
          @open-editor="onOpenEditor(index, $event)"
        />
      </template>
    </draggable>

    <StoryPageItem
      v-if="newPage"
      v-model="newPage"
    />

    <UiInput
      type="button"
      label="Add page"
      @click="openPageCreator"
    />
  </div>
</template>

<style lang="scss">
.StoryPageList {
  &__dialog {
    z-index: 1;

    border: 0;
    border-radius: 5px;
    background-color: var(--ui-color-background);
    color: var(--ui-color-foreground);

    min-width: 40vw;
    min-height: 40vh;

    max-width: 70vw;
    max-height: 70vh;

    &::backdrop {
      background: rgba(0,0,0, 0.5);
    }

    padding: 0px;

    section, footer {
      padding: 12px;
    }

    footer {
      display: flex;
      flex-wrap: nowrap;
      gap: 12px;
    }
  }
}

.StoryPage {
  user-select: none;
  width: 128px;
  margin-bottom: 2rem;
  padding: 8px;
  border-radius: 6px;

  color: var(--ui-color-foreground);
  background-color: var(--ui-color-background);

  opacity: 0.5;

  border: 2px solid transparent;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  transition: all var(--ui-duration-snap);

  cursor: pointer;
  &:hover {
    // background-color: var(--ui-color-hover);
    opacity: 0.9;
  }

  &--selected {
    border: 2px solid var(--ui-color-primary);
    opacity: 1;
  }

  &__item {
    .UiItem__icon {
      cursor: move;
      // width: 30px;
      padding-right: 12px;
    }
  }
}
</style>