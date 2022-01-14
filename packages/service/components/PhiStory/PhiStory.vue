<script setup>
import { watch, ref, reactive } from 'vue'
import { Client } from '@/packages/api'
import { CmsStory } from '@/packages/cms'

const props = defineProps({
  // URL of the story's source
  src: {
    type: String,
    required: true,
  },

  clientKey: {
    type: String,
    required: false,
    default: null,
  },

  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'loaded', 'error'])

const apiClient = new Client
const isLoading = ref(false)
const story = ref()
const error = reactive({
  code: null,
  message: '',
  obj: null,
})

async function fetchStory(storyUrl, clientKey) {
  isLoading.value = true
  try {
    story.value = await apiClient.get(storyUrl, { clientKey })
    emit('loaded')
  } catch (err) {
    console.log('fetchStory error', err)
    error.obj = err
    error.code = 1
    error.message = err?.message
    emit('error', error)
  }
  isLoading.value = false
}

watch(
  () => props.src,
  () => fetchStory(props.src, props.clientKey),
  { immediate: true },
)

const storyModel = ref({})
watch(
  () => props.modelValue,
  (newValue) => storyModel.value = newValue ? JSON.parse(JSON.stringify(newValue)) : {},
  { immediate: true },
)
</script>

<template>
  <div class="PhiStory">
    <slot
      v-if="isLoading"
      name="loading"
    >
      <h1>Loading</h1>
    </slot>

    <template v-else>
      <slot
        v-if="error.code"
        name="error"
        v-bind="error"
      >
        <h1>Error</h1>
        <pre>code: {{ error.code }}</pre>
        <p>{{ error.message }}</p>
      </slot>
      <CmsStory
        v-else-if="story"
        v-model="storyModel"
        :story="story"
        @update:modelValue="emit('update:modelValue', storyModel)"
      />
    </template>
  </div>
</template>