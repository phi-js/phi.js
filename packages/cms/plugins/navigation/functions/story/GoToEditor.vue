<script setup>
import NavigationPagePicker from '../../components/NavigationPagePicker/NavigationPagePicker.vue'

const props = defineProps({
  /*
  fn call statement
  {
    call: "Story.goTo" || "Story.goBack"
    args": ""  // pageId
  }
  */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function emitPageId(pageId) {
  emit('update:modelValue', { ...props.modelValue, args: pageId })
}
</script>

<template>
  <NavigationPagePicker
    :page-id="props.modelValue.args"
    @update:page-id="emitPageId($event)"
  />
</template>