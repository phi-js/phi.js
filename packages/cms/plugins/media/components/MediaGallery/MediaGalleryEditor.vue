<script setup>
import { ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiUpload, UiInput, UiItem, UiIcon } from '@/packages/ui'
import { CmsPropInput } from '@/packages/cms'

const i18n = useI18n({
  en: {
    'MediaGalleryEditor.View': 'View',
    'MediaGalleryEditor.List': 'List',
    'MediaGalleryEditor.Grid': 'Grid',
    'MediaGalleryEditor.Gallery': 'Gallery',
    'MediaGalleryEditor.MaxPreviewItems': 'Max. items in preview',
    'MediaGalleryEditor.Files': 'Files',
    'MediaGalleryEditor.Description': 'Description',
    'MediaGalleryEditor.Title': 'Title',
    'MediaGalleryEditor.MoveUp': 'Move up',
    'MediaGalleryEditor.MoveDown': 'Move down',
  },
  es: {
    'MediaGalleryEditor.View': 'Vista',
    'MediaGalleryEditor.List': 'Lista',
    'MediaGalleryEditor.Grid': 'Cuadrícula',
    'MediaGalleryEditor.Gallery': 'Galería',
    'MediaGalleryEditor.MaxPreviewItems': 'Elementos a mostrar en vista previa',
    'MediaGalleryEditor.Files': 'Archivos',
    'MediaGalleryEditor.Description': 'Descripción',
    'MediaGalleryEditor.Title': 'Título',
    'MediaGalleryEditor.MoveUp': 'Mover arriba',
    'MediaGalleryEditor.MoveDown': 'Mover abajo',
  },
})

const props = defineProps({
  // Block "props" object
  modelValue: {
    type: Object, //block.props (files and vue)
    required: false,
    default: null,
  },

  endpoint: {
    type: String,
    required: true,
  },

  imagesOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref({})

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = { ...newValue }
    if (!Array.isArray(innerValue.value.files)) {
      innerValue.value.files = []
    }
  },
  { immediate: true },
)

function emitInput() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerValue.value)))
}

function moveTo(sourceIndex, targetIndex) {
  if (
    sourceIndex < 0 || sourceIndex >= innerValue.value.files.length ||
    targetIndex < 0 || targetIndex >= innerValue.value.files.length
  ) {
    return
  }
  const [item] = innerValue.value.files.splice(sourceIndex, 1)
  innerValue.value.files.splice(targetIndex, 0, item)
  emitInput()
}

function moveUp(index) {
  return moveTo(index, index - 1)
}

function moveDown(index) {
  return moveTo(index, index + 1)
}
</script>

<template>
  <div class="MediaGalleryEditor">
    <UiInput
      v-model="innerValue.view"
      :label="i18n.t('MediaGalleryEditor.View')"
      type="select-buttons"
      :options="[
        {value: 'list', text: i18n.t('MediaGalleryEditor.List')},
        {value: 'grid', text: i18n.t('MediaGalleryEditor.Grid')},
        {value: 'gallery', text: i18n.t('MediaGalleryEditor.Gallery')},
      ]"
      @update:model-value="emitInput"
    />

    <UiInput
      v-show="innerValue.view == 'gallery'"
      v-model="innerValue.previewLimit"
      :label="i18n.t('MediaGalleryEditor.MaxPreviewItems')"
      type="number"
      min="1"
      @update:model-value="emitInput"
    />

    <UiInput :label="i18n.t('MediaGalleryEditor.Files')">
      <UiUpload
        v-model="innerValue.files"
        multiple
        :endpoint="props.endpoint"
        :allowed-file-types="props.imagesOnly ? ['image/*'] : null"
        @update:model-value="emitInput"
      >
        <template #file="{ file, index, emitUpdate, deleteFile }">
          <div class="GalleryEditorFile">
            <section class="GalleryEditorFile__buttons">
              <UiIcon
                src="mdi:arrow-up-thick"
                :title="i18n.t('MediaGalleryEditor.MoveUp')"
                @click="moveUp(index)"
              />
              <UiIcon
                src="mdi:arrow-down-thick"
                :title="i18n.t('MediaGalleryEditor.MoveDown')"
                @click="moveDown(index)"
              />
            </section>

            <UiItem
              :icon="file.thumbnail || `mime:${file.mimetype}`"
              @delete="deleteFile"
            >
              <div class="GalleryEditorFile__body">
                <CmsPropInput
                  v-model="file.title"
                  :label="i18n.t('MediaGalleryEditor.Title')"
                  :placeholder="file.name"
                  @update:model-value="emitUpdate()"
                />
                <CmsPropInput
                  v-model="file.description"
                  :label="i18n.t('MediaGalleryEditor.Description')"
                  @update:model-value="emitUpdate()"
                />
              </div>
            </UiItem>
          </div>
        </template>
      </UiUpload>
    </UiInput>
  </div>
</template>

<style lang="scss">
.MediaGalleryEditor {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .UiUpload__files {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 8px;
  }
}

.GalleryEditorFile {
  display: flex;
  flex-wrap: nowrap;
  --ui-item-padding: 5px;
  border-radius: 5px;
  background-color: var(--ui-color-hover);
  padding: 5px;
  padding-left: 0;

  .UiItem {
    flex: 1;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    padding: 5px;
    padding-right: 0;

    .UiIcon {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      opacity: 0.5;
      cursor: pointer;

      &:hover {
        opacity: 1;
        background-color: var(--ui-color-hover);
      }
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .UiItem__icon {
    width: 110px;
    .UiIcon__image {
      background-size: cover !important;
    }
  }

  .UiItem__actions {
    align-items: flex-start;
  }

  .UiItem__deleter {
    height: auto;
  }
}
</style>