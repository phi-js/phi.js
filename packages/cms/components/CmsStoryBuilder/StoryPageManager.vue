<script setup>
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'
import StoryPageToolbar from './StoryPageToolbar.vue'
import promptCreatePage from './promptCreatePage.js'

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


const isDialogOpen = ref(false)

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
</script>

<template>
  <div class="StoryPageManager">
    <UiInput
      v-model="pagePickerValue"
      class="StoryPageManager__picker"
      type="select-native"
      :options="pagePickerOptions"
    />

    <slot name="buttons" />

    <StoryPageToolbar
      v-if="currentPage"
      v-model="currentPage"
      @click="isDialogOpen = !isDialogOpen"
      @click-action="onCurrentPageClickAction"
      @delete="deletePage(currentPage.id)"
    />
  </div>
</template>

<style lang="scss">
.StoryPageManager {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 3px;

  &__picker select {
    max-width: 150px;
  }

  & > .UiIcon {
    width: 42px;
    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }
  }
}
</style>