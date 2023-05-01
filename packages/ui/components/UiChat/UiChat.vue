<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import UiInput from '../UiInput/UiInput.vue'

const props = defineProps({
  /*
  An array of MESSAGES, in the format:
  [
    {
      role: "assistant",
      content: "This is the message content"
    }
  ]
  */
  messages: {
    type: Array,
    required: false,
    default: () => [],
  },

  onUserMessage: {
    type: Function,
    required: false,
    default: null,
  },

  localStorageKey: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:messages'])

const innerMessages = ref([])
const isLoading = ref()
const msgInput = ref('')

const refScrollContainer = ref()
const refInput = ref()

let initialMessages = null

/* Wake up! Read from localStorage (if applies) */
onMounted(() => {
  innerMessages.value = props.messages.length
    ? props.messages.concat()
    : []

  initialMessages = innerMessages.value.concat()

  if (props.localStorageKey) {
    const storedValue = JSON.parse(localStorage.getItem(`UiChat:${props.localStorageKey}`))
    if (Array.isArray(storedValue)) {
      innerMessages.value = storedValue
      emit('update:messages', innerMessages.value.concat())
    }

    /* Store changes in localStorage */
    watch(innerMessages, () => {
      localStorage.setItem(`UiChat:${props.localStorageKey}`, JSON.stringify(innerMessages.value))
    })
  }

  scrollToLasMessage()
})

function clearHistory() {
  if (!confirm('Clear all message history?')) {
    return
  }

  innerMessages.value = initialMessages
  emit('update:messages', innerMessages.value.concat())
  localStorage.removeItem(`UiChat:${props.localStorageKey}`)
}

watch(
  () => props.messages,
  (newValue) => {
    innerMessages.value = newValue.length
      ? newValue.concat()
      : []

    scrollToLasMessage()
  },
)

async function onSubmit() {
  const userMessage = {
    role: 'user',
    content: msgInput.value,
  }

  msgInput.value = ''

  // Push the user message
  innerMessages.value.push(userMessage)
  emit('update:messages', innerMessages.value.concat())

  if (typeof props.onUserMessage == 'function') {
    isLoading.value = true
    try {
      const response = await props.onUserMessage(userMessage)
      if (Array.isArray(response)) {
        innerMessages.value.push(...response)
        emit('update:messages', innerMessages.value.concat())
      } else if (typeof response?.role !== 'undefined') {
        innerMessages.value.push(response)
        emit('update:messages', innerMessages.value.concat())
      }

    } catch (err) {
      // zzzz ignore errors !!!
    }
    isLoading.value = false
  }
}

function scrollToLasMessage() {
  nextTick(() => {
    refScrollContainer.value.scrollTo({
      top: 999999,
      behavior: 'smooth',
    })
    refInput.value.focus()
  })
}
</script>

<template>
  <div class="UiChat">
    <div class="UiChat__header">
      <button
        v-if="props.localStorageKey"
        type="button"
        @click="clearHistory()"
      >
        Clear history
      </button>
    </div>
    <div
      ref="refScrollContainer"
      class="UiChat__scrollContainer"
    >
      <div class="UiChat__messageList">
        <div
          v-for="(msg, i) in innerMessages"
          :key="i"
          class="UiChatMessage"
        >
          <label class="UiChatMessage__handle">{{ msg.role }}</label>
          <div class="UiChatMessage__content">
            {{ msg.content }}
          </div>
        </div>
      </div>
    </div>
    <form
      class="UiChat__form"
      @submit.prevent="onSubmit"
    >
      <UiInput
        ref="refInput"
        v-model="msgInput"
        :disabled="isLoading"
        label="user"
        type="text"
        required
      />
      <UiInput
        :is-loading="isLoading"
        type="submit"
        label="Send"
        loading-label="..."
      />
    </form>
  </div>
</template>

<style lang="scss">
.UiChat {
  height: 100%;

  display: flex;
  flex-direction: column;

  &__scrollContainer {
    flex: 1;
    overflow: auto;
    overscroll-behavior: contain;
  }

  &__messageList {
    margin: 5px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.UiChatMessage {
  border-radius: 5px;
  padding: 5px;

  max-width: 600px;
  &:hover {
    background-color: var(--ui-color-hover);
  }

  &__handle {
    display: block;
    user-select: none;
    font-size: 0.9rem;
    font-weight: bold;
  }

  &__content {
    font-size: 1.2rem;
    white-space: pre-wrap;
  }
}
</style>