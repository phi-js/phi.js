<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref, watch, useAttrs } from 'vue'
import { UiItem, UiIcon, UiPopover } from '@/packages/ui'

const availablePresets = [
  {
    text: 'Fit contents',
    icon: 'mdi:overscan',
    width: null,
    height: null,
  },
  {
    text: 'Desktop',
    icon: 'mdi:monitor',
    width: 'auto',
    height: 'auto',
  },
  {
    text: 'Mobile',
    icon: 'mdi:cellphone',
    width: 375,
    height: 812,
  },
  {
    text: 'Tablet',
    icon: 'mdi:tablet',
    width: 768,
    height: 1024,
  },
]

const props = defineProps({
  /*
  v-model:
  {
    text,
    icon,
    width, (int) pixels
    height, (int) pixels
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()

const resolution = ref({})
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      const matched = availablePresets.find((res) => res.width == newValue.width && res.height == newValue.height)
      resolution.value = {
        ...matched,
        ...newValue,
      }
    } else {
      resolution.value = {
        text: 'Custom',
        icon: 'mdi:monitor-screenshot',
        width: 'auto',
        height: 'auto',
      }
    }

  },
  { immediate: true },
)

function setPreset(newValue) {
  resolution.value = { ...newValue }
  emit('update:modelValue', resolution.value)

  return true
}

function onCustomValue() {
  // const matched = availablePresets.find((res) => res.width == resolution.value.width
  //   && res.height == resolution.value.height)
  // if (matched) {
  //   resolution.value.text = matched.text
  //   resolution.value.icon = matched.icon
  // } else {
  //   resolution.value.text = 'Custom'
  //   resolution.value.icon = 'mdi:monitor-screenshot'
  // }

  // Prevent emiting temporary or small values
  if (resolution.value.width >= 150 && resolution.value.height >= 200) {
    emit('update:modelValue', {
      ...resolution.value,
      text: 'Custom',
      icon: 'mdi:monitor-screenshot',
    })
  }
}

function rotate() {
  if (!resolution.value.width || !resolution.value.height) {
    return
  }

  const initial = {
    width: resolution.value.width,
    height: resolution.value.height,
  }

  resolution.value.width = initial.height
  resolution.value.height = initial.width
  emit('update:modelValue', resolution.value)
}

</script>

<template>
  <UiPopover class="UiResolutionPicker">
    <template #trigger>
      <UiIcon
        :class="attrs.class"
        :src="resolution.icon"
        :title="resolution.width ? `${resolution.text}\n${resolution.width}x${resolution.height} px` : 'Auto'"
      />
    </template>
    <template #contents="{ close }">
      <div class="PresetList">
        <UiItem
          v-for="(preset, i) in availablePresets"
          :key="i"
          :text="preset.text"
          class="PresetItem"
          :class="{ 'PresetItem--selected': preset.width == resolution.width && preset.height == resolution.height }"
          @click="setPreset(preset) && close()"
        >
          <template
            v-if="preset.width == resolution.width && preset.height == resolution.height"
            #actions
          >
            ✔
          </template>
        </UiItem>
      </div>

      <div class="DimensionPicker">
        <input
          v-model="resolution.width"
          type="number"
          min="100"
          max="8000"
          step="50"
          title="Width (px)"
          placeholder="auto"
          @update:modelValue="onCustomValue()"
          @keypress.enter="close()"
        >
        <span>&times;</span>
        <input
          v-model="resolution.height"
          type="number"
          min="100"
          max="8000"
          step="50"
          title="Height (px)"
          placeholder="auto"
          @update:modelValue="onCustomValue()"
          @keypress.enter="close()"
        >

        <UiIcon
          class="PresetItem"
          src="mdi:screen-rotation"
          style="padding:2px 8px; border-radius: 3px"
          title="Rotate"
          @click="rotate()"
        />
      </div>
    </template>
  </UiPopover>
</template>

<style lang="scss">
.UiResolutionPicker {
  .tippy-content {
    padding: 0;
    max-width: 250px;
  }
}

.PresetList {
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 6px;
    border: 2px solid #333;
  }
}

.DimensionPicker {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px;

  input {
    border: 0;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.1);
    font-size: 12px;
    padding: 4px;
    margin: 0 4px;
    color: #fff;
    text-align: center;
  }
}

.PresetItem {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */

  --ui-item-padding: 8px;

  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &--selected {
    font-weight: bold;
  }
}
</style>