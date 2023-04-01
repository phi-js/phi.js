<script setup>
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'
import StoryPageToolbar from './StoryPageToolbar.vue'

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

</script>

<template>
  <div class="StoryPageManager">
    <UiInput
      type="select-native"
      :model-value="currentPageId"
      :options="innerPages"
      option-value="$.id"
      option-text="$.title"
      @update:model-value="emit('update:currentPageId', $event)"
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

  & > .UiIcon {
    width: 42px;
    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }
  }
}
</style>