<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'

const i18n = useI18n({
  en: {
    'CssRepeat.x': 'Horizontally',
    'CssRepeat.y': 'Vertically',
  },
})

const props = defineProps({
  /*
  String. A background-position value
  e.g:.
  "left top"
  "right center"
  "3px 50%"
  "initial"
  */
  modelValue: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

/*
innerValue is an array with 'x' and/or 'y'
e.g.
repeat: repeat  --->   ['x', 'y']
repeat: repeat-x  --->   ['x']
repeat: repeat-y  --->   ['y']
repeat: no-repeat  --->   []
*/
const innerValue = ref([])
watch(
  () => props.modelValue,
  (newValue) => innerValue.value = parseRepeatString(newValue),
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', repeatToString(innerValue.value))
}

function parseRepeatString(str) {
  if (!str || str == 'repeat') {
    return ['x', 'y']
  }

  if (str == 'repeat-x') {
    return ['x']
  }

  if (str == 'repeat-y') {
    return ['y']
  }

  if (str == 'no-repeat') {
    return []
  }

  return ['x', 'y']
}

function repeatToString(arrRepeat) {
  if (!arrRepeat || !arrRepeat.length) {
    return 'no-repeat'
  } else if (arrRepeat.length == 2) {
    return 'repeat'
  } else if (arrRepeat[0] == 'x') {
    return 'repeat-x'
  } else if (arrRepeat[0] == 'y') {
    return 'repeat-y'
  }

  return ''
}

</script>

<template>
  <div class="CssRepeat">
    <UiInput
      v-model="innerValue"
      type="select-list"
      multiple
      :options="[
        { value: 'x', text: i18n.t('CssRepeat.x') },
        { value: 'y', text: i18n.t('CssRepeat.y') },
      ]"
      @update:model-value="emitUpdate"
    />
  </div>
</template>