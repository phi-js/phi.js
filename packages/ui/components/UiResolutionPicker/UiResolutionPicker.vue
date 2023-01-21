<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref, watch, useAttrs } from 'vue'
import { UiItem, UiIcon, UiDropdown } from '@/packages/ui'

const availablePresets = [
  {
    // text: 'Full width',
    // icon: 'mdi:overscan',
    text: 'Desktop',
    icon: 'mdi:monitor',
    width: null,
    height: null,
  },
  // {
  //   text: 'Desktop',
  //   icon: 'mdi:monitor',
  //   width: 'auto',
  //   height: 'auto',
  // },
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

    resolution.value.intWidth = parseInt(resolution.value.width) || ''
    resolution.value.intHeight = parseInt(resolution.value.height) || ''
  },
  { immediate: true },
)

function setPreset(newValue) {
  resolution.value = { ...newValue }
  emit('update:modelValue', resolution.value)

  return true
}

function onCustomValue() {
  // Prevent emiting temporary or small values
  if (resolution.value.intWidth >= 150 && resolution.value.intHeight >= 200) {
    emit('update:modelValue', {
      ...resolution.value,
      width: resolution.value.intWidth || resolution.value.width,
      height: resolution.value.intHeight || resolution.value.height,
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
  <UiDropdown class="UiResolutionPicker">
    <template #trigger>
      <UiIcon
        :class="attrs.class"
        :src="resolution.icon"
        :title="resolution.width ? `${resolution.text}\n${resolution.width}x${resolution.height} px` : resolution.text"
      />
    </template>
    <template #default="{ close }">
      <div class="PresetList">
        <UiItem
          v-for="(preset, i) in availablePresets"
          :key="i"
          :text="preset.text"
          :icon="preset.icon"
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
          v-model="resolution.intWidth"
          type="number"
          min="100"
          max="8000"
          step="50"
          title="Width (px)"
          placeholder="auto"
          @update:model-value="onCustomValue()"
          @keypress.enter="close()"
        >
        <span>&times;</span>
        <input
          v-model="resolution.intHeight"
          type="number"
          min="100"
          max="8000"
          step="50"
          title="Height (px)"
          placeholder="auto"
          @update:model-value="onCustomValue()"
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
  </UiDropdown>
</template>

<style lang="scss">
.UiResolutionPicker {
  .UiDropdown {
    &__container {
      right: 0;
      top: 90%;
    }

    &__trigger {
      height: 100%;
      display: flex;
      align-items: center;
    }

    &__body {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
    }
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
  display: flex;
  flex-wrap: nowrap;

  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px;

  input {
    border: 0;
    border-radius: 3px;
    font-size: 12px;
    padding: 4px;
    margin: 0 4px;
    text-align: center;

    // background-color: rgba(255, 255, 255, 0.1);
    // color: #fff;
    background: var(--ui-color-background);
    color: var(--ui-color-foreground);
  }
}

.PresetItem {
  --ui-item-padding: 8px 12px;
  border-radius: 4px;
  user-select: none;

  font-size: 0.9em;
  font-weight: bold;

  cursor: pointer;
  &:hover {
    background-color: var(--ui-color-hover);
  }

  &--selected {
    font-weight: bold;
  }
}
</style>