<script setup>
import { ref, watch, computed } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiTabs, UiTab } from '@/packages/ui'
import CmsThemePicker from '../CmsThemePicker/CmsThemePicker.vue'

import Spacing from '../../../ui/components/CssEditor/properties/Spacing.vue'

import CmsStoryFont from './CmsStoryFont.vue'
import CmsStoryColors from './CmsStoryColors.vue'
import CmsStoryClasses from './CmsStoryClasses.vue'

const i18n = useI18n({
  en: {
    'CmsStoryStyle.theme': 'Theme',
    'CmsStoryStyle.font': 'Font',
    'CmsStoryStyle.colors': 'Colors',
    'CmsStoryStyle.margin': 'Margin',
    'CmsStoryStyle.css': 'CSS',
  },
  es: {
    'CmsStoryStyle.theme': 'Temas',
    'CmsStoryStyle.font': 'Fuente',
    'CmsStoryStyle.colors': 'Colores',
    'CmsStoryStyle.margin': 'Márgen',
    'CmsStoryStyle.css': 'CSS',
  },
})

const props = defineProps({
  story: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:story'])

const innerStory = ref()
watch(
  () => props.story,
  (newStory) => innerStory.value = { ...newStory },
  { immediate: true },
)

function emitUpdate() {
  emit('update:story', { ...innerStory.value })
}

function getSheetSrc(sheetId) {
  const found = innerStory.value.stylesheets.find((sheet) => sheet.id == sheetId)
  return found?.src
}

function setSheetSrc(sheetId, newValue) {
  const foundSheet = innerStory.value.stylesheets.find((sheet) => sheet.id == sheetId)
  if (foundSheet) {
    foundSheet.src = newValue
  } else {
    innerStory.value.stylesheets.push({
      'id': sheetId,
      'src': newValue,
      'prefers-color-scheme': sheetId == 'story-style'
        ? undefined
        : (sheetId == 'story-style-light') ? 'light' : 'dark',
    })
  }
}

const innerStoryVariables = computed({
  get: () => getSheetSrc('story-style') || {},
  set: (newValue) => setSheetSrc('story-style', newValue),
})

const pseudoMargin = computed({
  get: () => {
    const storyStyle = innerStoryVariables.value
    return {
      margin: storyStyle['--ui-content-margin'] || '',
      width: storyStyle['--ui-content-width'] || '',
    }
  },
  set: (newValue) => {
    setSheetSrc('story-style', {
      ...innerStoryVariables.value,
      '--ui-content-margin': newValue.margin.replaceAll('auto', '0'),
      '--ui-content-width': newValue.width,
    })
  },
})
</script>

<template>
  <UiTabs class="CmsStoryStyle">
    <UiTab :text="i18n.t('CmsStoryStyle.theme')">
      <CmsThemePicker
        v-model="innerStory.stylesheets"
        @update:model-value="emitUpdate"
      />
    </UiTab>

    <UiTab :text="i18n.t('CmsStoryStyle.font')">
      <CmsStoryFont
        v-model:story="innerStory"
        v-model:storyCssVariables="innerStoryVariables"
        @update:story-css-variables="emitUpdate"
        @update:story="emitUpdate"
      />
    </UiTab>

    <UiTab :text="i18n.t('CmsStoryStyle.colors')">
      <CmsStoryColors
        v-model:story="innerStory"
        @update:story="emitUpdate"
      />
    </UiTab>

    <UiTab :text="i18n.t('CmsStoryStyle.margin')">
      <Spacing
        v-model="pseudoMargin"
        class="CmsStoryStyle__spacing"
        @update:model-value="emitUpdate"
      />
    </UiTab>

    <UiTab :text="i18n.t('CmsStoryStyle.css')">
      <CmsStoryClasses
        v-model="innerStory.stylesheets"
        class="CmsStoryStyle__classes"
        @update:model-value="emitUpdate"
      />
    </UiTab>
  </UiTabs>
</template>

<style lang="scss">
.CmsStoryStyle {
  &__spacing {
    .SpacingBox__slot {
      border: 1px solid rgba(0,0,0, 0.3);
      border-radius: 4px;
      background: var(--ui-color-background);
    }

    .SpacingBox--margin {
      &::before {
        color: var(--ui-color-foreground);
      }
    }

    .SpacingBox--padding {
      padding: 0;
      border: 0;
      background: transparent;

      .SpacingBox__top,
      .SpacingBox__right,
      .SpacingBox__bottom,
      .SpacingBox__left {
        display: none;
      }

      &::before {
        content: 'Max. content width';
        color: var(--ui-color-foreground);
        top: 4px;
        left: 0;
        right: 0;
        text-align: center;
      }
    }

    .SpacingBox--dimensions {
      background: transparent;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;

      & > .SpacingBox__height {
        display: none;
      }

      .UiInput__label {
        display: none;
      }
    }
  }
}
</style>