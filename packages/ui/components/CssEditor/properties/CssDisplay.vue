<script setup>
import { ref, watch } from 'vue'

import UiInput from '../../UiInput/UiInput.vue'
import CssAlignItems from '../values/align-items.vue'
import CssJustifyContent from '../values/justify-content.vue'
import CssUnit from '../values/unit.vue'

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
  <div class="CssDisplay">
    <UiInput
      v-model="css['display']"
      type="select-native"
      label="Display"
      :options="[
        { value: null, text: 'default' },
        { value: 'block', text: 'block' },
        { value: 'inline', text: 'inline' },
        { value: 'flex', text: 'flex' },
        { value: 'inline-block', text: 'inline-block' },
        { value: 'inline-flex', text: 'inline-flex' },
      ]"
      @update:model-value="emitUpdate"
    />

    <template v-if="['flex', 'inline-flex'].includes(css.display)">
      <UiInput
        v-model="css['flex-direction']"
        type="select-native"
        label="Direction"
        :options="[
          { value: null, text: 'default' },
          { value: 'row', text: 'row' },
          { value: 'column', text: 'column' },
        ]"
        @update:model-value="emitUpdate"
      />
      <UiInput
        v-model="css['flex-wrap']"
        type="select-native"
        label="Wrap"
        :options="[
          { value: null, text: 'default' },
          { value: 'wrap', text: 'wrap' },
          { value: 'nowrap', text: 'nowrap' },
        ]"
        @update:model-value="emitUpdate"
      />

      <CssAlignItems
        v-model="css['align-items']"
        label="Align items"
        @update:model-value="emitUpdate"
      />
      <CssJustifyContent
        v-model="css['justify-content']"
        label="Justify content"
        @update:model-value="emitUpdate"
      />
      <CssUnit
        v-model="css['gap']"
        label="Gap"
        @update:model-value="emitUpdate"
      />
    </template>

    <UiInput
      v-model="css['flex']"
      type="select-native"
      label="Flex"
      :options="[
        { value: null, text: 'default' },
        { value: 'none', text: 'none' },
        { value: 1, text: '1' },
        { value: 2, text: '2' },
        { value: 3, text: '3' },
        { value: 4, text: '4' },
        { value: 5, text: '5' },
      ]"
      @update:model-value="emitUpdate"
    />
  </div>
</template>