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
  <div class="Docs">
    <h1>UiChat</h1>
    <code>import { UiChat } from '@/packages/ui'</code>
    <p>
      A chat component that allows users to send messages and receive responses. It can display messages that were already sent and received, and it can persist messages in localStorage.
    </p>

    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Description</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>messages</td>
          <td>An array of messages, in the format:</td>
          <td>Array</td>
          <td>No</td>
          <td>Empty array</td>
        </tr>
        <tr>
          <td>onUserMessage</td>
          <td>A function that is called when the user sends a message. It receives the user message as a parameter and should return an array of responses or a single response. Responses are objects with 'role' and 'content' properties.</td>
          <td>Function</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>localStorageKey</td>
          <td>A string key to use when storing messages in localStorage. If omitted, messages will not be persisted.</td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>update:messages</td>
          <td>Emitted when the messages array has been updated, with the new messages array as the parameter.</td>
        </tr>
      </tbody>
    </table>

    <pre><code>&lt;UiChat
  :messages="[{role: 'assistant', content: 'Hello there!'}]"
/&gt;
</code></pre>

    <UiChat
      :messages="[{role: 'assistant', content: 'Hello there!'}]"
    />


    <!-- Human made -->
    <hr>
    <UiChat
      v-model:messages="messages"
      style="max-height: 500px"
      local-storage-key="docs"
      @user-message="(msg) => onUserMessage(msg)"
    />
    <pre>UiChat.docs.messages: {{ messages }}</pre>
  </div>
</template>