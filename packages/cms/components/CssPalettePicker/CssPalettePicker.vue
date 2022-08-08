<script setup>
import { computed } from 'vue'
import { UiDialog, UiItem } from '@/packages/ui'

import palettes from './palettes.js'
import CssColorScheme from './CssColorScheme.vue'

const props = defineProps({
  /*
  An object defining CSS variables for light and dark themes:
  {
    "style-light": {
      "--ui-color-background": "#d7c6c6",
      "--ui-color-foreground": "#a68282",
      "--ui-color-primary": "#55a581",
      ... more arbitrary props ...
    },
    "style-dark": {
      "--ui-color-background": "#a6a6bf",
      "--ui-color-foreground": "#b19595",
      "--ui-color-primary": "#3caf7b"
      ... more arbitrary props ...
    }
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },

  // Only show themes for the given scheme (null = all themes)
  // 'light' | 'dark' | null
  colorScheme: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const isEnabled = computed(() => {
  return {
    light: !props.colorScheme || props.colorScheme == 'light',
    dark: !props.colorScheme || props.colorScheme == 'dark',
  }
})

function onClickPalette(palette) {
  const targetValue = { ...props.modelValue }

  if (isEnabled.value.light) {
    targetValue['style-light'] = {
      ...props.modelValue['style-light'],
      ...palette['style-light'],
    }
  }

  if (isEnabled.value.dark) {
    targetValue['style-dark'] = {
      ...props.modelValue['style-dark'],
      ...palette['style-dark'],
    }
  }

  emit('update:modelValue', targetValue)
  return true
}
</script>

<template>
  <div class="CssPalettePicker">
    <UiDialog>
      <template #trigger>
        <UiItem
          class="CssPalettePicker__trigger"
          :text="`${props.colorScheme} palette picker`"
          icon="mdi:palette"
        />
      </template>
      <template #default="{ close }">
        <table
          class="CssPalettePicker__table"
          cellspacing="0"
          cellpadding="0"
          width="100%"
        >
          <thead>
            <tr>
              <td />
              <td v-if="isEnabled.light">
                Light
              </td>
              <td v-if="isEnabled.dark">
                Dark
              </td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(palette,i) in palettes"
              :key="i"
              @click="onClickPalette(palette) && close()"
            >
              <td>{{ palette.title }}</td>
              <td v-if="isEnabled.light">
                <CssColorScheme :scheme="palette['style-light']" />
              </td>
              <td v-if="isEnabled.dark">
                <CssColorScheme :scheme="palette['style-dark']" />
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </UiDialog>
  </div>
</template>

<style lang="scss">
.CssPalettePicker {
  .UiDialog__contents {
    max-height: 600px;
  }

  &__trigger {
    cursor: pointer;
    --ui-item-padding: 8px 12px;
    border-radius: 4px;

    &:hover {
      background-color: var(--ui-color-hover);
    }
  }


  &__table {
    min-width: 300px;
    position: relative;
    overflow: auto;

    thead {
      position: sticky;
      top: 0;

      font-weight: 600;
      font-size: 14px;

      td {
        padding: 12px;
      }
    }

    tbody {
      tr {
        cursor: pointer;
        &:hover {
          background-color: var(--ui-color-hover);
        }
      }

      td {
        padding: 12px;
      }
    }
  }
}
</style>