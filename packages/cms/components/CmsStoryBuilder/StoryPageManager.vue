<script setup>
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput, UiIcon, UiItem, UiDropdown } from '@/packages/ui'

import { getBlockEditors } from '../../functions'
import promptCreatePage from './promptCreatePage.js'

const i18n = useI18n({
  en: {
    'StoryPageManager.DeleteThisPage': 'Delete this page?',
    'StoryPageManager.CreatePage': 'Create page',
    'StoryPageManager.Delete': 'Delete',
    'StoryPageManager.PageSettings': 'Page settings',
    'StoryPageManager.PageList': 'Page list',
  },
  es: {
    'StoryPageManager.DeleteThisPage': 'Eliminar esta página?',
    'StoryPageManager.CreatePage': 'Crear página',
    'StoryPageManager.Delete': 'Eliminar',
    'StoryPageManager.PageSettings': 'Ajustes de página',
    'StoryPageManager.PageList': 'Lista de páginas',
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

function createPage() {
  const newPage = promptCreatePage(innerPages.value)
  if (!newPage) {
    return
  }

  innerPages.value.push(newPage)
  emitUpdate()

  return newPage.id
}

function deletePage(pageId) {
  if (!confirm(i18n.t('StoryPageManager.DeleteThisPage'))) {
    return
  }

  const foundIndex = innerPages.value.findIndex((p) => p.id == pageId)
  if (foundIndex >= 0) {
    if (innerPages.value[foundIndex].id == props.currentPageId) {
      emit('update:currentPageId', innerPages.value[foundIndex - 1]?.id || innerPages.value[foundIndex + 1]?.id)
    }

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


const openBlockWindow = inject('$_cms_openBlockWindow')

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

const pagePickerOptions = computed(() => {
  return innerPages.value
    .map((page) => ({ value: page.id, text: i18n.obj(page.title) }))
    .concat([{ value: 'create', text: i18n.t('StoryPageManager.CreatePage') }])
})

const pagePickerValue = computed({
  get: () => props.currentPageId,
  set(newValue) {
    if (newValue == 'create') {
      newValue = createPage()
    }

    if (newValue) {
      emit('update:currentPageId', newValue)
    }
  },
})


const blockEditors = computed(() => getBlockEditors(currentPage.value, { allowSource: true }))
const shortcuts = computed(() => blockEditors.value.actions.filter((a) => a.hasData))
</script>

<template>
  <div class="StoryPageManager">
    <div class="StoryPageManager__scroll">
      <UiInput
        v-model="pagePickerValue"
        class="StoryPageManager__picker"
        type="select-native"
        :options="pagePickerOptions"
        :title="i18n.t('StoryPageManager.PageList')"
      />

      <slot name="buttons" />

      <!-- shortcut icons -->
      <UiIcon
        v-for="action in shortcuts"
        :key="action.id"
        :src="action.icon"
        :title="action.description"
        :class="`BlockScaffold__button BlockScaffold__button--shortcut BlockScaffold__action--${action.id}`"
        @click.stop="onCurrentPageClickAction(action.id)"
      />
    </div>

    <!-- Menu -->
    <UiDropdown>
      <template #trigger>
        <UiIcon
          :title="i18n.t('StoryPageManager.PageSettings')"
          src="mdi:dots-vertical"
          class="BlockScaffold__button"
        />
      </template>
      <template #default="{ close }">
        <div class="BlockScaffold__actionList color-scheme-dark">
          <UiItem
            v-for="action in blockEditors.actions"
            :key="action.id"
            :text="action.title"
            :icon="action.icon"
            :class="`BlockScaffold__action BlockScaffold__action--${action.id}`"
            @click="close(); onCurrentPageClickAction(action.id);"
          />
          <UiItem
            class="BlockScaffold__action BlockScaffold__action--delete"
            icon="mdi:close"
            :text="i18n.t('StoryPageManager.Delete')"
            @click="close(); deletePage(currentPage.id);"
          />
        </div>
      </template>
    </UiDropdown>
  </div>
</template>

<style lang="scss">
.StoryPageManager {
  min-width: none;

  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;

  &__scroll {
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    overflow-x: auto;
  }

  &__picker select {
    max-width: 150px;
  }
}
</style>