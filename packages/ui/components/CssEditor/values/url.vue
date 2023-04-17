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
    <div
      v-if="innerValue"
      class="CssUrl__preview"
    >
      <a
        :href="innerValue"
        target="_blank"
        class="CssUrl__imageLink"
        title="Open image in new tab"
      >
        <img
          class="CssUrl__image"
          :src="innerValue"
          :alt="innerValue"
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
          {{ bytes(imgInfo.fileSize) }} ??
        </div>
      </div>
    </div>

    <div class="CssUrl__input">
      <UiInput
        v-model="innerValue"
        type="url"
        :endpoint="$attrs.endpoint"
        @update:model-value="emitUpdate()"
      />
    </div>

    <UiDialog>
      <template #trigger>
        <UiInput
          class="CssUrl__dalleButton"
          type="button"
          label="Generate with DALLE-2"
        />
      </template>
      <template #default="{ close }">
        <div class="CssUrl__dalleDialog">
          <AiImageUrl
            v-model="innerValue"
            @update:model-value="emitUpdate(); close();"
          />
        </div>
      </template>
    </UiDialog>
  </UiInput>
</template>

<style lang="scss">
.CssUrl {
  &__dalleButton {
    width: 100%;
  }

  &__dalleDialog {
    padding: 12px;
  }

  &__input {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 5px;
  }

  &__imageLink {
    display: block;
    text-align: center;
  }

  &__image {
    max-width: 100%;
  }

  &__info {
    font-size: 0.9em;
    text-align: right;
  }

  &__info__size {
    font-weight: bold;
  }
}
</style>