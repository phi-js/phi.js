<script setup>
import { ref, watch } from 'vue'
import { UiInput, UiDialog } from '@/packages/ui'
import bytes from '../../../filters/bytes'

import AiImageUrl from '../../../../cms/plugins/openai/AiImageUrl.vue'

/*
A css url property value (string)
e.g. "url('../images/bullet.jpg')"
*/
const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref('')

watch(
  () => props.modelValue,
  (newValue) => innerValue.value = parseIncoming(newValue),
  { immediate: true },
)

function parseIncoming(newValue) {
  if (typeof newValue !== 'string') {
    return ''
  }

  if (!newValue.startsWith('url(')) {
    return newValue
  }

  // url('hello') ----> 'hello'
  // url(something) ----> something
  const candidate = newValue.slice(4, -1)
  if (candidate.startsWith('\'')) {
    return candidate.slice(1, -1)
  }
  return candidate
}

function emitUpdate() {
  emit('update:modelValue', innerValue.value.trim() ? `url(${innerValue.value})` : '')
}

const imgInfo = ref({
  src: null,
  width: null,
  height: null,
  fileSize: 0,
})

function onImgLoad(evt) {
  imgInfo.value.src = evt.target.src
  imgInfo.value.width = evt.target.naturalWidth
  imgInfo.value.height = evt.target.naturalHeight

  const size = performance.getEntriesByName(evt.target.src)?.[0]
  if (size) {
    imgInfo.value.fileSize = size.transferSize || size.decodedBodySize
  }
}
</script>

<template>
  <UiInput class="CssUrl">
    <div class="CssUrl__input">
      <UiInput
        v-model="innerValue"
        type="url"
        :endpoint="$attrs.endpoint"
        @update:model-value="emitUpdate()"
      />
    </div>

    <div
      v-if="innerValue"
      class="CssUrl__preview"
    >
      <a
        :href="innerValue"
        target="_blank"
      >
        <img
          class="CssUrl__image"
          :src="innerValue"
          :title="innerValue"
          @load="onImgLoad"
        >
      </a>

      <div class="CssUrl__info">
        <div class="CssUrl__info__dimensions">
          {{ imgInfo.width }}x{{ imgInfo.height }}
        </div>
        <div
          v-if="imgInfo.fileSize"
          class="CssUrl__info__size"
        >
          {{ bytes(imgInfo.fileSize) }}
        </div>
      </div>
    </div>

    <UiDialog>
      <template #trigger>
        <button type="button">
          Generate with DALLE-2
        </button>
      </template>
      <template #default="{ close }">
        <AiImageUrl
          v-model="innerValue"
          @update:model-value="emitUpdate(); close();"
        />
      </template>
    </UiDialog>
  </UiInput>
</template>

<style lang="scss">
.CssUrl {
  &__input {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 5px;
  }

  &__preview {
    padding: 8px 0;
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: 5px;
  }

  &__image {
    max-width: 150px;
    max-height: 150px;
  }

  &__info {
    font-size: 0.9em;
  }

  &__info__size {
    font-weight: bold;
  }
}
</style>