<script setup>
import { ref } from 'vue'
import UiInputHtml from './UiInputHtml.vue'
import { UiInput } from '../UiInput'

const html = ref('<h1>Hello</h1>')

</script>

<template>
  <div class="UiInputHtmlDocs">
    <UiInput
      v-model="html"
      type="textarea"
    />
    <hr>
    <UiInputHtml v-model="html" />
    <hr>
    <pre>{{ html }}</pre>
    <hr>
    <div v-html="html" />
    <hr>
    <hr>
    <UiInput
      v-model="html"
      type="html"
      label="UiInput[type=html]"
      subtext="Input subtext here"
    />
  </div>
</template>