<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'

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
</script>

<template>
  <div class="CssUrl">
    <div
      v-if="innerValue"
      class="CssUrl__preview"
    >
      <img
        class="CssUrl__image"
        :src="innerValue"
      >
    </div>

    <UiInput
      v-model="innerValue"
      class="CssUrl__input"
      type="url"
      :endpoint="$attrs.endpoint"
      @update:model-value="emitUpdate()"
    />
  </div>
</template>

<style lang="scss">
.CssUrl {
  position: relative;
  &__image {
    max-width: 120px;
    max-height: 120px;
  }
}
</style>