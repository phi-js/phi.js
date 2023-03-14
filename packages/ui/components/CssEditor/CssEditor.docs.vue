<script setup>
import { ref } from 'vue'
import CssEditor from './CssEditor.vue'

const css = ref({
  // 'fontFamily': 'MyFontWhatever, sans-serif',
  // // 'color': '#fff',
  // 'textShadow': '1px 1px 1px #000',
  // // 'backgroundImage': 'url(https://picsum.photos/150)',
  // 'backgroundImage': 'url(https://fastly.picsum.photos/id/642/150/150.jpg?hmac=0-Ra00pesmnwUHEosLHxp_sKqoY3Fpd6MMdyfcnnQb0)',
  // 'backgroundAttachment': 'fixed',
  // 'margin': '10px',
  // 'marginTop': '25px',
  // '//': '... every CSS property',

  // 'padding': '64px 64px 64px 64px',
  // 'height': '420px',
  // 'color': '#fff',
  // 'background-color': 'gray',
  // // 'background-image': 'url(https://picsum.photos/1024/500)',
  // 'background-repeat': 'no-repeat',
  // 'background-size': 'cover',
  // 'background-attachment': 'fixed',
  // 'background-position': 'center',

})
</script>

<template>
  <div class="CssEditor-docs">
    <h1>CssEditor</h1>
    <p><strong>REPLACEMENT</strong> of CssStyleEditor</p>
    <p>Takes an OBJECT with CSS properties and provides a full-blown editor for everything CSS (background, margins, colors, ... all of it)</p>

    <pre>modelValue: {{ css }}</pre>


    <CssEditor v-model="css" />
    <!-- <pre>css: {{ css }}</pre> -->
  </div>
</template>