<script setup>
import { ref } from 'vue'
import CssStyleEditor from './CssStyleEditor.vue'
import CssBackgroundEditor from './CssBackgroundEditor.vue'
import { UiDetails } from '../UiDetails'

const style = ref({
  'color': 'red',
  'border': '1px solid red',
  'border-color': 'orange',
  '--ui-item-padding': 'padding',

  'width': 'auto',
  'height': 'auto',
  'min-width': '200px',
  'min-height': '200px',

  'background-image': 'url(\'http://phi.local/phi.svg\')',
  'background-repeat': 'no-repeat',
})

const schema = ref({
  type: 'object',
  properties: {
    'color': { title: 'Font color', format: 'color' },
    'border-color': { title: 'Border color', format: 'color' },
    'border-width': { title: 'Border width', format: 'css-unit' },

    'width': { title: 'Width', format: 'css-unit' },
    'height': { title: 'Height', format: 'css-unit' },
    'min-width': { title: 'Min. width', format: 'css-unit' },
    'min-height': { title: 'Min. height', format: 'css-unit' },
  },
})
</script>

<template>
  <div
    style="display: flex"
    class="UiForm--wide"
  >
    <div style="flex: 1">
      <CssStyleEditor
        v-model="style"

        :schema="schema"
        endpoint="http://phi.local/api/1/echo"
      />

      <UiDetails text="Background">
        <CssBackgroundEditor
          v-model="style"
          endpoint="http://phi.local/api/1/echo"
        />
      </UiDetails>
    </div>

    <div style="flex:2; padding: 16px;">
      <div :style="style" />
      <pre>style: {{ style }}</pre>
      <pre>schema: {{ schema }}</pre>
    </div>
  </div>
</template>