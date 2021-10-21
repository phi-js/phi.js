<script setup>
// Base sample in https://codesandbox.io/s/uppy-vue-example-buz4w?file=/src/components/HelloWorld.vue
import { ref, watch, computed, onBeforeUnmount } from 'vue'

import draggable from 'vuedraggable'

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

import { Dashboard, DashboardModal } from '@uppy/vue'
import { UiItem } from '../UiItem'
import { UiIcon } from '../UiIcon'
import bytes from '../../filters/bytes.js'

const props = defineProps({
  endpoint: {
    type: String,
    required: true,
  },

  inline: {
    type: Boolean,
    required: false,
    default: false,
  },

  // si se autoprocede, no se puede usar ImageEditor
  autoProceed: {
    type: Boolean,
    required: false,
    default: false,
  },

  multiple: {
    type: Boolean,
    required: false,
    default: false,
  },

  modelValue: {
    type: [Array, Object, String],
    required: false,
    default: null,
  },

  /*
  Cadena de placeholder a mostrar en el boton en modo inline.
  Tambien puede ser un OBJETO con propiedades para UiItem
  */
  placeholder: {
    type: [String, Object],
    required: false,
    default: 'Upload files',
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
  autoProceed: props.autoProceed, // si se autoprocede, no se puede usar ImageEditor

  // i18n
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
    endpoint: props.endpoint,
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
      innerFiles.value = props.multiple ? innerFiles.value.concat(uploads) : [uploads[0]]
      emitUpdate()
    }
  }))

onBeforeUnmount(() => uppy.value.close)

// Modal
const isOpen = ref(false)
function onModalClose() {
  isOpen.value = false
}

const dashboardProps = computed(() => ({
  onRequestCloseModal: onModalClose,
  closeModalOnClickOutside: false,
  closeAfterFinish: props.inline ? null : true,
  height: '100%',
  width: '100%',
}))
</script>

<template>
  <div class="UiUpload">
    <div class="UiUpload__files">
      <draggable
        v-model="innerFiles"
        class="CmsPageLayoutEditor__draggable"
        group="ui-upload-draggable"
        item-key="id"
        ccchandle=".ui-item__icon"
        @update:modelValue="emitUpdate"
      >
        <template #item="{element: file}">
          <div>
            <a
              class="ui-clickable ui-noselect"
              target="_blank"
              :href="file.url"
            >
              <UiItem
                class="ui-clickable"
                :text="file.name"
                :subtext="bytes(file.size)"
                :icon="file.thumbnail"
              >
                <template #actions>
                  <UiIcon
                    src="mdi:close"
                    class="ui-clickable"
                    @click.prevent="deleteFile(file)"
                  />
                </template>
              </UiItem>
            </a>
          </div>
        </template>
      </draggable>
    </div>

    <template v-if="!props.inline">
      <UiItem
        v-if="placeholder?.text"
        class="UiUpload__trigger ui-clickable ui-noselect"
        v-bind="placeholder"
        @click="isOpen = !isOpen"
      />
      <button
        v-else
        type="button"
        class="UiUpload__trigger ui-native"
        @click="isOpen = !isOpen"
      >
        {{ props.placeholder }}
      </button>
    </template>

    <component
      :is="props.inline ? Dashboard : DashboardModal"
      :open="isOpen"
      class="UiUpload__uploader"
      :uppy="uppy"
      :plugins="['Webcam', 'ImageEditor']"
      :props="dashboardProps"
    />
  </div>
</template>