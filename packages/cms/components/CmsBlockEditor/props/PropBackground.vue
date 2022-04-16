<script setup>
import { ref, watchEffect, computed } from 'vue'

import { UiInput } from '../../../../ui'

/*
Object containing CSS Background properties:

{
  'background-image': 'url(...)',
  'background-repeat': 'norepeat',
  'background-size': 'cover',
  'background-position': '0 0',
  ...
  ... rest of properties are ignored
}
*/
const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },

  /* Endpoint for file uploads */
  endpoint: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

function emitUpdate() {
  emit('update:modelValue', { ...props.modelValue, ...css.value })
}

const css = ref({
  'background-image': null,
  'background-repeat': null,
  'background-size': null,
  'background-position': null,
})

watchEffect(() => {
  Object.assign(css.value, {
    'background-image': props.modelValue?.['background-image'],
    'background-repeat': props.modelValue?.['background-repeat'],
    'background-size': props.modelValue?.['background-size'],
    'background-position': props.modelValue?.['background-position'],
  })
})

const backgroundImageUrl = computed({
  get() {
    if (!css.value['background-image'] || !css.value['background-image'].startsWith('url(')) {
      return ''
    }
    // url(hello) ----> hello
    return css.value['background-image'].slice(4, -1)
  },
  set(newValue) {
    css.value['background-image'] = newValue ? `url(${newValue})` : null
  },
})

</script>

<template>
  <div class="PropBackground">
    <UiInput
      v-model="backgroundImageUrl"
      label="image"
      type="url"
      :endpoint="endpoint"
      @update:model-value="emitUpdate()"
    />

    <UiInput
      v-model="css['background-repeat']"
      label="repeat"
      type="select-native"
      :options="[
        'inherit',
        'initial',
        'no-repeat',
        'repeat',
        'repeat-x',
        'repeat-y',
        'revert',
        'round',
        'space',
        'unset'
      ]"
      @update:model-value="emitUpdate()"
    />

    <UiInput
      v-model="css['background-position']"
      label="position"
      type="select-native"
      :options="[
        'left top',
        'left center',
        'left bottom',
        'right top',
        'right center',
        'right bottom',
        'center top',
        'center center',
        'center bottom',
      ]"
      @update:model-value="emitUpdate()"
    />

    <UiInput
      v-model="css['background-size']"
      label="size"
      type="select-native"
      :options="[
        'auto',
        'cover',
        'contain',
        'initial',
        'inherit',
      ]"
      @update:model-value="emitUpdate()"
    />

    <UiInput
      v-model="css['background-attachment']"
      label="attachment"
      type="select-native"
      :options="[
        'scroll',
        'fixed',
        'local',
        'initial',
        'inherit',
      ]"
      @update:model-value="emitUpdate()"
    />
  </div>
</template>