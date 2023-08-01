<script setup>
import { onMounted, ref, watch } from 'vue'
import QRious from 'qrious'

// see: https://github.com/neocotic/qrious
const props = defineProps({
  value: {
    type: String,
    required: true,
  },

  size: {
    type: [Number, String],
    required: false,
    default: 100, //pixels
  },

  background:	{
    type: String,
    required: false,
    default: 'white',
  },

  backgroundAlpha: {
    type: [Number, String],
    required: false,
    default: 1.0,
  },

  foreground:	{
    type: String,
    required: false,
    default: 'black',
  },

  foregroundAlpha: {
    type: [Number, String],
    required: false,
    default: 1.0,
  },

  level: {
    type: String,
    required: false,
    default: 'L', // (L, M, Q, H)
  },

  mime:	{
    type: String,
    required: false,
    default: 'image/png',
  },

  padding: {
    type: [Number, String],
    required: false,
    default: null,
  },
})

const refCanvas = ref()
let qr = null

onMounted(() => {
  qr = new QRious({
    ...props,
    element: refCanvas.value,
  })
})

watch(
  props,
  () => qr.set(props),
)
</script>

<template>
  <div class="UiQrCode">
    <canvas ref="refCanvas" />
  </div>
</template>