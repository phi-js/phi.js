<script setup>
import { ref } from 'vue'
import { UiResizable } from '../UiResizable'

const bounds = ref(null)
</script>

<template>
  <UiResizable
    v-slot="{ startMode, newBounds }"
    v-model:bounds="bounds"
    style="border: 1px dashed #ccc"
    min-width="42"
    min-height="42"
    :enabled="['s']"
  >
    <a
      href="#"
      target="_blank"
      @click.stop.prevent="() => null"
    >
      <img src="https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg">
    </a>
    <!-- <div style="white-space: nowrap; overflow: hidden; height: 100%;">
      <div
        class="ui--clickable"
        style="cursor: move"
        @mousedown="startMove"
        @touchstart="startMove"
      >
        MOVER (?)
      </div>
      <p>Este es un cuadro resizeable :)</p>
      <pre>bounds: {{ bounds }}</pre>
      <pre>newBounds: {{ newBounds }}</pre>
    </div> -->
  </UiResizable>
</template>