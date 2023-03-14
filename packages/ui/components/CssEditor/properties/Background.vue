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
  CSS Object:
  {
    fontFamily: 'MyFontWhatever, sans-serif',
    color: "#fff",
    textShadow: "1px 1px 1px #000",
    ... every CSS property (yeah)

    This block will edit:

    backgroundColor: "#fff",
    backgroundImage: "url(....)",
    backgroundAttachment: "fixed",
    backgroundSize: "cover",

    // 2DO
    backgroundPosition: "center",
    backgroundRepeat: "center",
    ... gradients? multiple backgrounds?
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
      v-model="css.backgroundColor"
      label="Color"
      @update:model-value="emitUpdate"
    />
    <CssUrl
      v-model="css.backgroundImage"
      :endpoint="$attrs.endpoint"
      label="Image"
      @update:model-value="emitUpdate"
    />
    <CssBackgroundAttachment
      v-model="css.backgroundAttachment"
      label="Attachment"
      @update:model-value="emitUpdate"
    />
    <CssBackgroundSize
      v-model="css.backgroundSize"
      label="Size"
      @update:model-value="emitUpdate"
    />
    <CssRepeat
      v-model="css.backgroundRepeat"
      label="Repeat"
      @update:model-value="emitUpdate"
    />
    <CssPosition
      v-model="css.backgroundPosition"
      label="Position"
      @update:model-value="emitUpdate"
    />
  </div>
</template>