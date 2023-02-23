<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { computed, ref, watch } from 'vue'
import { UiDialog, UiItemFinder, UiItem } from '@/packages/ui'
import { useAvailableBlocks } from '../../functions/usePlugin'
import getSuggestedBlocks from './Quicklaunch'

const availableBlocks = useAvailableBlocks()

const props = defineProps({
  text: {
    type: String,
    required: false,
    default: '',
  },

  subtext: {
    type: String,
    required: false,
    default: '',
  },

  icon: {
    type: String,
    required: false,
    default: 'mdi:plus',
  },

  title: {
    type: String,
    required: false,
    default: null,
  },

  open: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['input', 'update:open'])

const isOpen = ref()
let hasPushedState = false

watch(
  () => props.open,
  (v) => {
    isOpen.value = v

    // Close on BACK button
    if (isOpen.value) {
      // register cancel listeners
      history.pushState({ open: true }, '')
      window.addEventListener('popstate', onPopState)
      hasPushedState = true
    } else {
      // unregister cancel listeners
      window.removeEventListener('popstate', onPopState)
      if (hasPushedState) {
        history.go(-1)
        hasPushedState = false
      }
    }

  },
  { immediate: true },
)

function setOpen(bool) {
  if (isOpen.value === bool) {
    return
  }
  emit('update:open', bool)
}

function onPopState() {
  hasPushedState = false
  setOpen(false)
}

const searchString = ref('')

const suggestedBlocks = computed(() => {
  if (!searchString.value.trim()) {
    return [
      {
        name: 'LayoutGroup',
        title: 'Group',
        icon: 'mdi:group',
        props: { direction: 'column' },
      },
    ]
  }

  return getSuggestedBlocks(searchString.value)
})

function onClickSuggestion(sugg) {
  emit('input', {
    ...sugg,
    staging: false,
  })
}
</script>

<template>
  <div
    :class="[
      'CmsBlockPicker',
      {
        'CmsBlockPicker--open': isOpen,
        'CmsBlockPicker--closed': !isOpen,
      },
      $attrs.class
    ]"
  >
    <UiDialog
      v-slot="{ close }"
      v-model:open="isOpen"
      show-close-button
      @update:open="emit('update:open', $event)"
    >
      <UiItemFinder
        v-model:searchString="searchString"
        :items="availableBlocks"
        @select-item="emit('input', $event); close()"
      >
        <template #body>
          <div class="CmsBlockPicker__suggestions">
            <UiItem
              v-for="(sugg,i) in suggestedBlocks"
              :key="i"
              class="FinderItem FinderItem--item"
              :icon="sugg.icon"
              :text="sugg.title"
              :subtext="sugg.subtext"
              @click="onClickSuggestion(sugg); close()"
            />
          </div>

          <slot
            name="body"
            :close="close"
          />
        </template>
      </UiItemFinder>
    </UiDialog>
  </div>
</template>

<style lang="scss">
.CmsBlockPicker {
  &__suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding: 8px;
    font-size: 0.9em;

    .FinderItem {
      border: 1px solid #999;
      opacity: 0.5;

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>