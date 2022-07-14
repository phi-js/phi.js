<script setup>
// Base sample in https://codesandbox.io/s/uppy-vue-example-buz4w?file=/src/components/HelloWorld.vue
import { ref, watch, computed, onBeforeUnmount } from 'vue'

import { useI18n } from '@/packages/i18n'

import draggable from 'vuedraggable' //fails when using phi.js as a bundled library
// import draggable from 'vuedraggable/src/vuedraggable'

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

import { Dashboard, DashboardModal } from '@uppy/vue' //fails when using phi.js as a bundled library
// import { Dashboard, DashboardModal } from '@uppy/vue/src'
import { UiItem } from '../UiItem'
import { UiIcon } from '../UiIcon'
import { UiButton } from '../UiButton'

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
    default: null,
  },
})
const emit = defineEmits(['update:modelValue', 'upload'])

const i18n = useI18n({
  en: { 'UiUpload.Upload': 'Upload' },
  es: { 'UiUpload.Upload': 'Subir archivo' },
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

const endangeredIndex = ref(-1)
</script>

<template>
  <div class="UiUpload">
    <div class="UiUpload__files">
      <draggable
        v-model="innerFiles"
        group="ui-upload-draggable"
        item-key="id"
        @update:model-value="emitUpdate"
      >
        <template #item="{ element: file, index }">
          <div>
            <a
              class="UiUpload__file"
              :class="{'UiUpload__file--danger': endangeredIndex === index}"
              target="_blank"
              :href="file.url"
            >
              <UiItem
                :text="file.name"
                :subtext="bytes(file.size)"
                :icon="file.thumbnail"
              >
                <template #actions>
                  <UiIcon
                    class="UiUpload__deleter"
                    src="mdi:close"
                    @click.prevent="deleteFile(file)"
                    @mouseenter="endangeredIndex = index"
                    @mouseleave="endangeredIndex = -1"
                  />
                </template>
              </UiItem>
            </a>
          </div>
        </template>
      </draggable>
    </div>

    <template v-if="!props.inline">
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
        :label="props.placeholder || i18n.t('UiUpload.Upload')"
        @click="isOpen = !isOpen"
      />
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