<script setup>
// Base sample in https://codesandbox.io/s/uppy-vue-example-buz4w?file=/src/components/HelloWorld.vue
import { ref, watch, computed, onBeforeUnmount } from 'vue'

import { useI18n } from '@/packages/i18n'

import Uppy from '@uppy/core'
import Webcam from '@uppy/webcam'
import XHRUpload from '@uppy/xhr-upload'
import ImageEditor from '@uppy/image-editor'

import English from '@uppy/locales/lib/en_US'
import German from '@uppy/locales/lib/de_DE'
import Spanish from '@uppy/locales/lib/es_ES'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'
import '@uppy/image-editor/dist/style.css'

import { Dashboard, DashboardModal } from '@uppy/vue' //fails when using phi.js as a bundled library
// import { Dashboard, DashboardModal } from '@uppy/vue/src'
import { UiIcon } from '../UiIcon'
import { UiButton } from '../UiButton'
import { UiItem } from '../UiItem'

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

  /*
  Cropper.js image aspect ratio.
  Number (result of a division)
  e.g. 16/9,  800/600
  */
  aspectRatio: {
    type: [String, Boolean, Number],
    required: false,
    default: false,
  },

  autoOpenFileEditor: {
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
    default: null,
  },

  allowedFileTypes: {
    type: Array,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue', 'upload'])

const i18n = useI18n({
  en: {
    'UiUpload.UploadFile': 'Upload file',
    'UiUpload.UploadFiles': 'Upload files',
    'UiUpload.Rename': 'Rename',
    'UiUpload.Close': 'Close',
    'UiUpload.Description': 'Description',
    'UiUpload.DeleteThisFile': 'Delete this file?',
  },

  es: {
    'UiUpload.UploadFile': 'Subir archivo',
    'UiUpload.UploadFiles': 'Subir archivos',
    'UiUpload.Rename': 'Renombrar',
    'UiUpload.Close': 'Cerrar',
    'UiUpload.Description': 'Descripción',
    'UiUpload.DeleteThisFile': 'Eliminar este archivo?',
  },
})

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
  endangeredIndex.value = -1

  if (!confirm(i18n.t('UiUpload.DeleteThisFile'))) {
    return
  }

  innerFiles.value.splice(innerFiles.value.indexOf(file), 1)
  emitUpdate()
}

// Modal
const isOpen = ref(false)


// UPPY uploader
const uppy = computed(() => new Uppy({
  autoProceed: props.autoProceed, // si se autoprocede, no se puede usar ImageEditor

  locale: i18n.baseLanguage.value == 'es'
    ? Spanish
    : (i18n.baseLanguage.value == 'de' ? German : English),

  restrictions: {
    minNumberOfFiles: props.multiple ? null : 1,
    maxNumberOfFiles: props.multiple ? null : 1,
    allowedFileTypes: Array.isArray(props.allowedFileTypes) ? props.allowedFileTypes : null,
  },

})
  .use(XHRUpload, {
    endpoint: props.endpoint,
    fieldName: 'file',
  })

  .use(Webcam)
  .use(ImageEditor, {
    quality: 0.8,
    actions: {
      revert: false,
      rotate: true,
      granularRotate: true,
      flip: true,
      zoomIn: true,
      zoomOut: true,
      cropSquare: false,
      cropWidescreen: false,
      cropWidescreenVertical: false,
    },
    cropperOptions: { aspectRatio: props.aspectRatio },
  })

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
  })

  .on('dashboard:modal-closed', () => {
    isOpen.value = false
  }))

onBeforeUnmount(() => uppy.value.close())


const dashboardProps = computed(() => ({
  closeModalOnClickOutside: false,
  closeAfterFinish: props.inline ? null : true,
  height: '100%',
  width: '100%',
  autoOpenFileEditor: props.autoOpenFileEditor,
  plugins: ['Webcam', 'ImageEditor'],
  proudlyDisplayPoweredByUppy: false,
}))

const endangeredIndex = ref(-1)

const editingIndexes = ref([])

function openEditor(index) {
  if (editingIndexes.value.includes(index)) {
    return
  }
  editingIndexes.value.push(index)
}

function closeEditor(index) {
  editingIndexes.value.splice(editingIndexes.value.indexOf(index), 1)
}

</script>

<template>
  <div class="UiUpload">
    <div class="UiUpload__files">
      <template
        v-for="(file, index) in innerFiles"
        :key="index"
      >
        <slot
          name="file"
          :file="innerFiles[index]"
          :index="index"
          :delete-file="() => deleteFile(file)"
          :emit-update="emitUpdate"
        >
          <div
            class="UiUpload__file"
            :class="{'UiUpload__file--danger': endangeredIndex === index}"
          >
            <a
              class="UiUpload__figure"
              target="_blank"
              :href="file.url"
              tabindex="-1"
            >
              <img
                :src="file.thumbnail"
                :title="file.url"
              >
              <small>{{ bytes(file.size) }}</small>
            </a>

            <div
              v-if="editingIndexes.includes(index)"
              class="UiUpload__editor"
            >
              <input
                class="UiUpload__title"
                type="text"
                :value="file.title"
                :placeholder="file.name"
                @input="file.title = $event.target.value; emitUpdate()"
              >
              <input
                class="UiUpload__description"
                type="text"
                :value="file.description"
                :placeholder="i18n.t('UiUpload.Description')"
                @input="file.description = $event.target.value; emitUpdate()"
              >

              <UiItem
                class="UiUpload__actionItem"
                icon="mdi:check"
                :text="i18n.t('UiUpload.Close')"
                @click.prevent="closeEditor(index)"
              />
            </div>
            <div
              v-else
              class="UiUpload__details"
              :title="file.name"
            >
              <h1 v-text="file.title || file.name" />
              <p v-text="file.description" />
              <UiItem
                class="UiUpload__actionItem"
                icon="mdi:pencil"
                :text="i18n.t('UiUpload.Rename')"
                @click.prevent="openEditor(index)"
              />
            </div>

            <UiIcon
              v-if="!editingIndexes.includes(index)"
              class="UiUpload__deleter"
              src="mdi:close"
              @click.prevent="deleteFile(file)"
              @mouseenter="endangeredIndex = index"
              @mouseleave="endangeredIndex = -1"
            />
          </div>
        </slot>
      </template>
    </div>

    <template v-if="!props.inline && (props.multiple || innerFiles.length < 1)">
      <UiButton
        v-if="placeholder?.text"
        class="UiUpload__button"
        v-bind="placeholder"
        @click="isOpen = !isOpen"
      />
      <UiButton
        v-else
        type="button"
        class="UiUpload__button"
        :label="props.placeholder || i18n.t(props.multiple ? 'UiUpload.UploadFiles' : 'UiUpload.UploadFile')"
        @click="isOpen = !isOpen"
      />
    </template>

    <component
      :is="props.inline ? Dashboard : DashboardModal"
      v-if="props.multiple || innerFiles.length < 1"
      :open="isOpen"
      class="UiUpload__uploader"
      :uppy="uppy"
      :props="dashboardProps"
    />
  </div>
</template>