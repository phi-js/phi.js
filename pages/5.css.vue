<script setup>
import { ref } from 'vue'
import { UiInput } from '@/packages/ui/components'

// eslint-disable-next-line
const cssBody = ref('.myClass {\n  border: 1px solid red;\n  padding: 8px 16px\n}\n\n.myClass h1,\n.myClass h2,\n.myClass p {\n  margin: 0;\n}\n\n.myClass h1 {\n  color: blue;\n}')

var sheetEl = document.createElement('style')
var header = document.getElementsByTagName('HEAD')[0]
header.appendChild(sheetEl)

function setStyleBody(text) {
  sheetEl.innerHTML = text
}

setStyleBody(cssBody.value)
</script>

<template>
  <div>
    <h1>Hello</h1>
    <UiInput
      v-model="cssBody"
      type="code"
      lang="css"
      @update:modelValue="setStyleBody"
    />
    <br>

    <div class="myClass">
      <h1>Hello</h1>
      <h2>World</h2>
      <p>How are you?</p>
    </div>
  </div>
</template>