<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { useApi } from '@/packages/api'
import PdfGenerator from '@/packages/ui/components/PdfGenerator/PdfGenerator.vue'
import pdfApi from './api.js'

const api = useApi(pdfApi)
const injectedStory = inject('$_cms_story', null)
const el = ref()
const innerHTML = ref('')

function exportHTML() {
  innerHTML.value = el.value.innerHTML

  let style = ''
  injectedStory.stylesheets.value.forEach((sheet) => {
    if (sheet.type == 'class') {
      style = style + sheet.src + ' '
    }
  })

  innerHTML.value = `<html>
    <head>
      <style>
        body {
          font-family: Nunito, Verdana, Tahoma, sans-serif;
          font-size: 12pt;
        }
        ${style}
      </style>
    </head>
    <body>
      ${el.value.innerHTML}
    </body>
  </html>`
}

const mutationObserver = new MutationObserver(exportHTML)

onMounted(() => {
  if (!el.value) {
    return
  }

  exportHTML() // Initial "observe"

  mutationObserver.observe(el.value, {
    childList: true,
    attributes: false,
    subtree: true,
  })
})

onUnmounted(() => mutationObserver.disconnect())

function toPDF({ html, options }) {
  return api.toPDF(html, options)
  // return api.toPDF(html, { setters: { title: 'HELLO THERE' } })
}
</script>

<template>
  <div class="MediaPdf">
    <div
      ref="el"
      class="MediaPdf__slot"
      style="display: none"
    >
      <slot />
    </div>
    <PdfGenerator
      :html="innerHTML"
      :generator="toPDF"
    />
  </div>
</template>