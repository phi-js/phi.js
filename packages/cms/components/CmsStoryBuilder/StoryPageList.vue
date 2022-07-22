<script setup>
import { ref } from 'vue'
import { UiInput, UiItem, UiIcon, UiPopover } from '@/packages/ui/components'

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

function onPageClick(page) {
  emit('update:currentPageId', page.id)
}


const editingPage = ref({})

function openPageEditor(page) {
  editingPage.value = {
    id: page.id,
    title: page.title,
    hash: page.hash,
  }
  isHashDirty.value = true
  refDialog.value.showModal()
}

function openPageCreator() {
  isHashDirty.value = false
  editingPage.value = {
    id: '',
    hash: '',
    title: '',

    // default page contents
    component: 'LayoutPage',
    slot: [],
  }

  refDialog.value.showModal()
}

let isHashDirty = ref(false)

function resetForm() {
  editingPage.value = {}
  isHashDirty.value = false
}

function deletePageAt(index) {
  if (!confirm('Delete this page?')) {
    return
  }

  const story = { ...props.story }
  story.pages.splice(index, 1)
  emit('update:story', story)

  const newActiveId = story.pages?.[index]?.id || story.pages[story.pages.length - 1]?.id
  if (newActiveId) {
    emit('update:currentPageId', newActiveId)
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
      Object.assign(story.pages[foundPageIndex], {
        title: editingPage.value.title,
        hash: editingPage.value.hash,
      })

      emit('update:story', story)
    }
  }

  resetForm()
}

function onTitleChange() {
  if (!isHashDirty.value) {
    editingPage.value.hash = toValidHash(editingPage.value.title)
  }
}

function toValidHash(string) {
  if (!string) {
    return ''
  }

  return string
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 16)
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
      <form method="dialog">
        <section>
          <UiInput
            v-model="editingPage.title"
            type="text"
            label="Title"
            @update:model-value="onTitleChange"
          />
          <UiInput
            v-model="editingPage.hash"
            type="text"
            label="Hash"
            @update:model-value="isHashDirty = true"
          />
        </section>

        <footer>
          <button
            class="UiButton"
            value="ok"
            :disabled="editingPage.hash && !editingPage.hash.trim()"
          >
            OK
          </button>
          <button
            class="UiButton UiButton--cancel"
            value="cancel"
          >
            Cancel
          </button>
        </footer>
      </form>
    </dialog>

    <div class="StoryPageList__pages">
      <div
        v-for="(page, i) in props.story.pages"
        :key="page.id"
        class="StoryPage"
        :class="{'StoryPage--selected': page.id == props.currentPageId}"
        @click="onPageClick(page)"
      >
        <UiItem
          :text="page.title || page.hash"
          :subtext="`#${page.hash}`"
        >
          <template #actions>
            <UiPopover>
              <template #trigger>
                <UiIcon src="mdi:dots-vertical" />
              </template>
              <template #contents>
                <div class="StoryPage__menuItems">
                  <UiItem
                    class="BlockPopover__item"
                    icon="mdi:pencil"
                    text="Rename"
                    @click="openPageEditor(page)"
                  />
                  <UiItem
                    class="BlockPopover__item"
                    icon="mdi:water"
                    text="Style"
                  />
                  <!-- <UiItem
                    class="BlockPopover__item"
                    icon="mdi:eye-outline"
                    text="Visibility"
                  /> -->
                  <UiItem
                    class="BlockPopover__item"
                    icon="mdi:gesture-double-tap"
                    text="Events"
                  />
                  <UiItem
                    class="BlockPopover__item BlockPopover__item--delete"
                    :style="props.story.pages.length == 1 ? 'opacity:0.5; pointer-events:none' : null"
                    icon="mdi:close"
                    text="Delete"
                    @click="deletePageAt(i)"
                  />
                </div>
              </template>
            </UiPopover>
          </template>
        </UiItem>
      </div>
    </div>

    <UiInput
      type="button"
      label="Add page"
      @click="openPageCreator"
    />

    <!-- <button
      class="UiButton"
      @click="openPageCreator"
    >
      Add page
    </button> -->
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

    min-width: 500px;

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
}
</style>