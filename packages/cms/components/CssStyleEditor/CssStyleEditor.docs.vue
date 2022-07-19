<script setup>
import { ref } from 'vue'
import CssStyleEditor from './CssStyleEditor.vue'

const style = ref({
  'color': 'red',
  'border': '1px solid red',
  'border-color': 'orange',
  '--ui-item-padding': 'padding',
  'background-image': 'url(\'http://phi.local/phi.svg\')',
  'background-repeat': 'no-repeat',
  'background-size': 'contain',
  'width': 'auto',
  'height': 'auto',
  'min-width': '200px',
  'min-height': '200px',
})

const schema = ref({
  type: 'object',
  properties: {
    'color': { format: 'color' },
    'border-color': { format: 'color' },
    'background-image': { format: 'css-url' },
    'border-width': {},
  },
})
</script>

<template>
  <div style="display: flex">
    <CssStyleEditor
      v-model="style"
      class="UiForm--wide"
      style="flex: 1"
      :schema="schema"
      endpoint="http://phi.local/api/1/echo"
    />

    <div style="flex:2; padding: 16px;">
      <div :style="style" />
      <pre>style: {{ style }}</pre>
      <pre>schema: {{ schema }}</pre>
    </div>
  </div>
</template>