<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },

  data: {
    type: Object,
    required: false,
    default: null,
  },
})

const refCanvas = ref()

let chart = null
onMounted(() => {
  chart = new Chart(
    refCanvas.value,
    {
      type: props.type,
      data: props.data,
    },
  )
})

onUnmounted(() => chart.destroy())

watch(
  () => props.type,
  () => {
    chart.destroy()
    chart = new Chart(
      refCanvas.value,
      {
        type: props.type,
        data: props.data,
      },
    )
  },
)

watch(
  () => props.data,
  () => {
    if (!chart) {
      return
    }
    chart.data = props.data
    chart.update()
  },
)
</script>

<template>
  <div class="ChartJs">
    <canvas
      ref="refCanvas"
      style="max-width:100%; max-height: 100%;"
    />
  </div>
</template>