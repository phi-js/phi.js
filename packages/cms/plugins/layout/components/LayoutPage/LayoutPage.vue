<script setup>
import { onMounted } from 'vue'
const emit = defineEmits(['mounted', 'submit', 'change'])

onMounted(() => emit('mounted'))

function onFormSubmit($event) {
  emit('submit', $event)
}

function onFormChange($event) {
  emit('change', $event)
}

</script>

<template>
  <form
    class="LayoutPage"
    @submit.prevent="onFormSubmit"
    @change="onFormChange"
  >
    <div class="LayoutPage__contents">
      <slot />
    </div>

    <!-- this element must exist in order to trigger onSubmit when hittin ENTER on a text field -->
    <input
      hidden
      type="submit"
    >
  </form>
</template>