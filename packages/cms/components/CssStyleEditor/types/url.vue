<script setup>
import { computed } from 'vue'
import { UiInput, UiIcon } from '@/packages/ui'

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

const innerValue = computed({
  get() {
    if (typeof props.modelValue !== 'string') {
      return ''
    }

    if (!props.modelValue.startsWith('url(')) {
      return props.modelValue
    }

    // url('hello') ----> 'hello'
    // url(something) ----> something
    const candidate = props.modelValue.slice(4, -1)

    if (candidate.startsWith('\'')) {
      return candidate.slice(1, -1)
    }

    return candidate
  },

  set(newValue) {
    emit('update:modelValue', newValue ? `url(${newValue})` : null)
  },
})
</script>

<template>
  <UiInput>
    <div
      v-if="innerValue"
      class="CssUrl__image"
    >
      <UiIcon
        class="CssUrl__image-deleter"
        src="mdi:close"
        title="Remove image"
        @click="innerValue = null"
      />
      <img :src="innerValue">
    </div>

    <UiInput
      v-model="innerValue"
      type="url"
      :endpoint="$attrs.endpoint"
    />
  </UiInput>
</template>