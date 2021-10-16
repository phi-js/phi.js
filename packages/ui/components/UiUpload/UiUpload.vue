<script setup>
// Base sample in https://codesandbox.io/s/uppy-vue-example-buz4w?file=/src/components/HelloWorld.vue
import { ref, watch, computed, onBeforeUnmount } from 'vue'

import Uppy from '@uppy/core'
import Webcam from '@uppy/webcam'
import XHRUpload from '@uppy/xhr-upload'
import ImageEditor from '@uppy/image-editor'

// import English from '@uppy/locales/lib/en_US'
// import German from '@uppy/locales/lib/de_DE'
import Spanish from '@uppy/locales/lib/es_ES'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'
import '@uppy/image-editor/dist/style.css'

import { DashboardModal } from '@uppy/vue'
import { UiItem } from '../UiItem'
import { UiIcon } from '../UiIcon'

const props = defineProps({
  url: {
    type: String,
    required: true,
  },

  multiple: {
    type: Boolean,
    required: false,
    default: false,
  },

  modelValue: {
    type: [Array, Object],
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue', 'upload'])

const innerFiles = ref([])
watch(
  () => props.modelValue,
  (newValue) => innerFiles.value = Array.isArray(newValue) ? newValue : (newValue ? [newValue] : []),
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', props.multiple ? innerFiles.value : (innerFiles.value?.[0] || null))
}

// File management
function deleteFile(file) {
  if (!confirm('Delete this file?')) {
    return
  }

  innerFiles.value.splice(innerFiles.value.indexOf(file), 1)
  emitUpdate()
}

// UPPY uploader
const uppy = computed(() => new Uppy({
  autoProceed: true,
  // locale: English,
  // locale: German,
  locale: Spanish,

  restrictions: {
    minNumberOfFiles: props.multiple ? null : 1,
    maxNumberOfFiles: props.multiple ? null : 1,
  },

})
  .use(Webcam)
  .use(XHRUpload, {
    endpoint: props.url,
    fieldName: 'file',
  })
  .use(ImageEditor, { quality: 0.8 })

  .on('complete', (result) => {
    const uploads = []

    result.successful.forEach((upload) => {
      const resultObj = upload?.response?.body?.[0]
      if (!resultObj) {
        console.warn('UiUpload: invalid API response', upload)
        return
      }
      uploads.push(resultObj)
    })

    if (uploads.length) {
      emit('upload', uploads)
      innerFiles.value = innerFiles.value.concat(uploads)
      emitUpdate()
    }
  }))

onBeforeUnmount(() => uppy.value.close)

// Modal
const isOpen = ref(false)
function onModalClose() {
  isOpen.value = false
}
</script>

<template>
  <div class="UiUpload">
    <div class="UiUpload__files">
      <UiItem
        v-for="file in innerFiles"
        :key="file.id"
        :text="file.name"
        :subtext="file.size"
        :icon="file.thumbnail"
        class="ui-clickable ui-noselect"
      >
        <template #actions>
          <UiIcon
            src="mdi:close"
            class="ui-clickable"
            @click="deleteFile(file)"
          />
        </template>
      </UiItem>
    </div>
    <button
      type="button"
      class="UiUpload__trigger ui-native"
      @click="isOpen = !isOpen"
    >
      Upload files
    </button>
    <DashboardModal
      :open="isOpen"
      class="UiUpload__uploader"
      :uppy="uppy"
      :plugins="['Webcam', 'ImageEditor']"
      :props="{onRequestCloseModal: onModalClose}"
    />
  </div>
</template>