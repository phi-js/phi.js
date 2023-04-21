<!-- eslint-disable max-len -->
<script setup>
import { ref } from 'vue'
import CssEditor from './CssEditor.vue'

const css = ref(`:root {
  font-family: MyFontWhatever, sans-serif;
  font-size: 14pt;
  text-shadow: 1px 1px 1px #000;
  background-image: url(https://fastly.picsum.photos/id/642/150/150.jpg?hmac=0-Ra00pesmnwUHEosLHxp_sKqoY3Fpd6MMdyfcnnQb0);
  background-color: gray;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  margin: 10px;
  margin-top: 25px;
  padding: 64px 64px 64px 64px;
  height: 420px;
  color: #fff;
}`)
</script>

<template>
  <div class="CssEditor-docs">
    <h1>CssEditor</h1>

    <textarea
      v-model="css"
      style="width: 100%; min-height: 300px;"
    />

    <CssEditor v-model="css" />
    <!-- <pre>css: {{ css }}</pre> -->
  </div>
</template>