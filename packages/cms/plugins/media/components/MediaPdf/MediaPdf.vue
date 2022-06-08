<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import PdfGenerator from '@/packages/ui/components/PdfGenerator/PdfGenerator.vue'

const el = ref()

const innerHTML = ref('')

function exportHTML() {
  innerHTML.value = el.value.innerHTML
}

const mutationObserver = new MutationObserver(exportHTML)

onMounted(() => {
  if (!el.value) {
    return
  }

  innerHTML.value = el.value.innerHTML // Initial "observe"

  mutationObserver.observe(el.value, {
    childList: true,
    attributes: false,
    subtree: true,
  })
})

onUnmounted(() => mutationObserver.disconnect())

async function toPDF({ html, options }) {
  return fetch(
    'http://v4.local/1/esign/pdf/generator',
    {
      method: 'POST',
      body: JSON.stringify({ html, options }),
    },
  ).then((response) => response.blob())
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