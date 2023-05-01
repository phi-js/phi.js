<script setup>
import { ref } from 'vue'
import UiChat from './UiChat.vue'

const messages = ref([
  {
    role: 'assistant',
    content: 'Hola! Estoy aqui para ayudarte a crear tu sitio web.  Cuentame qué quieres crear',
  },
])

async function onUserMessage(msg) {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return {
    role: 'assistant',
    content: `${msg.role} said: ${msg.content}\n${messages.value.length} messages so far`,
  }
}

</script>

<template>
  <div class="UiChat-docs">
    <h1>UiChat</h1>
    <UiChat
      v-model:messages="messages"
      style="max-height: 500px"
      local-storage-key="docs"
      @user-message="(msg) => onUserMessage(msg)"
    />
    <pre>UiChat.docs.messages: {{ messages }}</pre>
  </div>
</template>