<script setup>
import { ref, shallowRef, watch, nextTick } from 'vue'
import draggable from 'vuedraggable'

import { UiInput, UiItem, UiIcon, UiPopover, UiTabs, UiTab } from '@/packages/ui/components'
import { getBlockEditors } from '../../functions'
import EditorAction from '../CmsBlockEditor/EditorAction.vue'

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
])

const availableActions = shallowRef([])
getBlockEditors({ component: 'LayoutPage' }).then((editors) => availableActions.value = editors?.actions || [])

function onPageClick(page) {
  emit('update:currentPageId', page.id)
}

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


const editingPage = ref()
const editorTab = ref()

function openPageEditor(page, tab = null) {
  if (tab) {
    editorTab.value = tab
  }

  editingPage.value = page

  nextTick(() => refDialog.value.showModal())
  // refDialog.value.showModal()

}

function openPageCreator() {
  editingPage.value = {
    id: '',
    hash: '',
    title: '',

    // default page contents
    component: 'LayoutPage',
    slot: [],
  }

  nextTick(() => refDialog.value.showModal())
  // refDialog.value.showModal()
}

function resetForm() {
  editingPage.value = null
}

function deletePageAt(index) {
  if (!confirm('Delete this page?')) {
    return
  }

  const story = { ...props.story }
  const deletedPageId = story.pages[index].id

  story.pages.splice(index, 1)
  emit('update:story', story)

  if (deletedPageId == props.currentPageId) {
    const newActiveId = story.pages?.[index]?.id || story.pages[story.pages.length - 1]?.id
    if (newActiveId) {
      emit('update:currentPageId', newActiveId)
    }
  }
}

const refDialog = ref()

function onDialogClose($event) {
  if ($event.target.returnValue == 'ok') {
    const story = { ...props.story }

    if (!editingPage.value.id) {
      editingPage.value.id = editingPage.value.hash
      story.pages.push({ ...editingPage.value })
      emit('update:story', story)
      emit('update:currentPageId', editingPage.value.id)
    } else {
      const foundPageIndex = story.pages.findIndex((p) => p.id == editingPage.value.id)
      if (foundPageIndex == -1) {
        // ????
        return
      }

      Object.assign(story.pages[foundPageIndex], editingPage.value)
      emit('update:story', story)
    }
  }

  resetForm()
}
</script>

<template>
  <div class="StoryPageList">
    <!-- Page creator dialog -->
    <dialog
      ref="refDialog"
      class="StoryPageList__dialog"
      @close="onDialogClose"
    >
      <form
        v-if="editingPage"
        method="dialog"
      >
        <UiTabs :model-value="editorTab">
          <UiTab
            v-for="action in availableActions"
            :key="action.id"
            :value="action.id"
            :text="action.title"
          >
            <EditorAction
              v-model:block="editingPage"
              :action="action"
            />
          </UiTab>
        </UiTabs>

        <footer>
          <button
            type="submit"
            class="UiButton"
            value="ok"
          >
            OK
          </button>
          <button
            type="submit"
            class="UiButton UiButton--cancel"
            value="cancel"
          >
            Cancel
          </button>
        </footer>
      </form>
    </dialog>

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
        <div
          class="StoryPage"
          :class="{'StoryPage--selected': element.id == props.currentPageId}"
          @click="onPageClick(element)"
        >
          <UiItem
            class="StoryPage__item"
            icon="mdi:drag-vertical"
            :text="element.title || element.hash"
            :subtext="`#${element.hash}`"
          >
            <template #actions>
              <UiPopover>
                <template #trigger>
                  <UiIcon src="mdi:dots-vertical" />
                </template>
                <template #contents>
                  <div class="StoryPage__menuItems">
                    <UiItem
                      v-for="action in availableActions"
                      :key="action.id"
                      class="BlockPopover__item"
                      :text="action.title"
                      :icon="action.icon"
                      @click="openPageEditor(element, action.id)"
                    />
                    <UiItem
                      class="BlockPopover__item BlockPopover__item--delete"
                      :style="props.story.pages.length == 1 ? 'opacity:0.5; pointer-events:none' : null"
                      icon="mdi:close"
                      text="Delete"
                      @click="deletePageAt(index)"
                    />
                  </div>
                </template>
              </UiPopover>
            </template>
          </UiItem>
        </div>
      </template>
    </draggable>

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