<script setup>
import CmsBlockPicker from './CmsBlockPicker.vue'
function onInput(foo) {
  console.log('onInput', foo)
}
</script>
<template>
  <CmsBlockPicker @input="onInput" />
</template>