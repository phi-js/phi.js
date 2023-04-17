<script setup>
import { ref, watch } from 'vue'

import CssColor from '../values/color.vue'
import CssUrl from '../values/url.vue'
import CssBackgroundAttachment from '../values/background-attachment.vue'
import CssBackgroundSize from '../values/background-size.vue'
import CssRepeat from '../values/repeat.vue'
import CssPosition from '../values/position.vue'

const props = defineProps({
  /*
  CSS Object (already sanitized.  i.e. property names are dashed-case):
  {
    "font-family": 'MyFontWhatever, sans-serif',
    "color": "#fff",
    "text-shadow": "1px 1px 1px #000",
    ...
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const css = ref()

watch(
  () => props.modelValue,
  () => css.value = { ...props.modelValue },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...css.value })
}
</script>

<template>
  <div class="CssBackground">
    <CssColor
      v-model="css['background-color']"
      label="Color"
      @update:model-value="emitUpdate"
    />
    <CssUrl
      v-model="css['background-image']"
      :endpoint="$attrs.endpoint"
      label="Image"
      @update:model-value="emitUpdate"
    />
    <CssBackgroundAttachment
      v-model="css['background-attachment']"
      label="Attachment"
      @update:model-value="emitUpdate"
    />
    <CssBackgroundSize
      v-model="css['background-size']"
      label="Size"
      @update:model-value="emitUpdate"
    />
    <CssRepeat
      v-model="css['background-repeat']"
      label="Repeat"
      @update:model-value="emitUpdate"
    />
    <CssPosition
      v-model="css['background-position']"
      label="Position"
      @update:model-value="emitUpdate"
    />
  </div>
</template>