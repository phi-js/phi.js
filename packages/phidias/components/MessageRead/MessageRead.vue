<script setup>
const props = defineProps({
  personId: {
    type: String,
    required: true
  },

  messageId: {
    type: String,
    required: true
  }
})

async function getMessages() {

}
</script>

<template>
  <div class="MessageRead">
    <pre>MessageRead props: {{ props }}</pre>
  </div>
</template>