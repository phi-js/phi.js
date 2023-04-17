<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  /**
   * HTML a mostrar como PDF
   */
  html: {
    type: String,
    required: false,
    default: null,
  },

  /**
   * Options
   * objeto de opciones (Constructor para MPDF\MPDF)
   * https://mpdf.github.io/reference/mpdf-functions/construct.html
   * y estas: https://mpdf.github.io/reference/mpdf-variables/overview.html
   *
   * e.g. {
   *    'mode': 'utf-8',
   *    'format': [190, 236],
   *    'orientation': 'L'
   * }
   */
  options: {
    type: Object,
    required: false,
    default: () => ({}),
  },

  /**
   * Generator
   * Funcion ASYNC que recibe un objeto { html, options } y devuelve un BLOB
   * con el PDF
   *
   * (i.e. una funcion que consuma un API que devuelva el blob)
   */
  generator: {
    type: Function,
    required: true,
  },


  /* Debounce time in miliseconds between generator calls */
  debounce: {
    type: Number,
    required: false,
    default: 600,
  },
})

var timeout = null

const pdfDataUrl = ref('')
const isDone = ref(false)

watch(
  () => [props.html, props.options],
  () => {
    clearTimeout(timeout)

    timeout = setTimeout(async () => {
      try {
        const pdfBlob = await props.generator({
          html: props.html,
          options: props.options,
        })

        const a = new FileReader()
        a.onload = (e) => {
          pdfDataUrl.value = e.target.result
          isDone.value = true
        }
        a.readAsDataURL(pdfBlob)
      } catch (err) {
        console.warn(err.toString())
        isDone.value = true
      }

    }, props.debounce)
  },
  { immediate: true },
)
</script>

<template>
  <div class="PdfGenerator">
    <object
      v-if="pdfDataUrl"
      :key="pdfDataUrl"
      width="100%"
      height="600"
      type="application/pdf"
      :data="pdfDataUrl"
    >
      <!-- Fallback del objeto -->
      <a
        :href="pdfDataUrl"
        target="_blank"
        download
      >Download</a>
    </object>
    <div v-else-if="isDone">
      Error generating PDF
    </div>
  </div>
</template>