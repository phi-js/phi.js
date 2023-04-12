<script setup>
import { onMounted, ref, watch, reactive, nextTick, computed } from 'vue'

import { useI18n } from '@/packages/i18n'
import { colorScheme, UiTabs, UiTab } from '@/packages/ui'
import CssStyleEditor from '@/packages/ui/components/CssStyleEditor/CssStyleEditor.vue'
import CmsThemePicker from '../CmsThemePicker/CmsThemePicker.vue'
import CssClassManager from '../CssClassManager/CssClassManager.vue'
// import CssPalettePicker from '../CssPalettePicker/CssPalettePicker.vue'
import Spacing from '../../../ui/components/CssEditor/properties/Spacing.vue'
import CmsStoryFont from './CmsStoryFont.vue'

const i18n = useI18n({
  en: {
    'CmsStoryStyle.theme': 'Theme',
    'CmsStoryStyle.font': 'Font',
    'CmsStoryStyle.colors': 'Colors',
    'CmsStoryStyle.margin': 'Margin',
    'CmsStoryStyle.css': 'CSS',
    'CmsStoryStyle.fontTitles': 'Titles',
    'CmsStoryStyle.fontTexts': 'Texts',
    'CmsStoryStyle.light': 'Light',
    'CmsStoryStyle.dark': 'Dark',
    'CmsStoryStyle.fontSize': 'Size',
  },
  es: {
    'CmsStoryStyle.theme': 'Temas',
    'CmsStoryStyle.font': 'Fuente',
    'CmsStoryStyle.colors': 'Colores',
    'CmsStoryStyle.margin': 'Márgen',
    'CmsStoryStyle.css': 'CSS',
    'CmsStoryStyle.fontTitles': 'Títulos',
    'CmsStoryStyle.fontTexts': 'Textos',
    'CmsStoryStyle.light': 'Claro',
    'CmsStoryStyle.dark': 'Oscuro',
    'CmsStoryStyle.fontSize': 'Tamaño',
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

const colorSchemeCss = reactive({
  type: 'object',
  properties: {
    '--ui-color-background': {
      title: 'Background',
      format: 'color',
    },
    '--ui-color-foreground': {
      title: 'Foreground',
      format: 'color',
    },
    '--ui-color-primary': {
      title: 'Accent',
      format: 'color',
    },
  },
})
// ////

/*
Determine the current values for the editable CSS variables
--ui-color-background
--ui-color-foreground
--ui-color-primary
*/
onMounted(async () => {
  // await new Promise((resolve) => setTimeout(resolve, 80)) // !!! ugh
  getCurrentCssValues()
})

watch(
  () => props.story,
  () => getCurrentCssValues(),
)

async function getCurrentCssValues() {
  await nextTick()

  const elStory = document.querySelector('.CmsStoryEditor, .CmsStory')
  if (elStory) {
    const elStyle = getComputedStyle(elStory)

    const propNames = [
      '--ui-color-background',
      '--ui-color-foreground',
      '--ui-color-primary',
    ]
    propNames.forEach((varName) => {
      colorSchemeCss.properties[varName].default = elStyle.getPropertyValue(varName).trim()
    })

  }
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

const innerStoryVariablesLight = computed({
  get: () => getSheetSrc('story-style-light') || {},
  set: (newValue) => setSheetSrc('story-style-light', newValue),
})

const innerStoryVariablesDark = computed({
  get: () => getSheetSrc('story-style-dark') || {},
  set: (newValue) => setSheetSrc('story-style-dark', newValue),
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
      <UiTabs
        v-model="colorScheme"
        @update:model-value="getCurrentCssValues()"
      >
        <UiTab
          :text="i18n.t('CmsStoryStyle.light')"
          value="light"
        >
          <CssStyleEditor
            v-model="innerStoryVariablesLight"
            class="UiForm--wide"
            :schema="colorSchemeCss"
            @update:model-value="emitUpdate"
          />
        </UiTab>
        <UiTab
          :text="i18n.t('CmsStoryStyle.dark')"
          value="dark"
        >
          <CssStyleEditor
            v-model="innerStoryVariablesDark"
            class="UiForm--wide"
            :schema="colorSchemeCss"
            @update:model-value="emitUpdate"
          />
        </UiTab>
      </UiTabs>

      <!-- <CssPalettePicker
        v-model="innerStory.css"
        :color-scheme="colorScheme"
        class="CmsStoryStyle__palettePicker"
        @update:model-value="emitUpdate"
      /> -->
    </UiTab>

    <UiTab :text="i18n.t('CmsStoryStyle.margin')">
      <Spacing
        v-model="pseudoMargin"
        class="CmsStoryStyle__spacing"
        @update:model-value="emitUpdate"
      />
    </UiTab>

    <UiTab :text="i18n.t('CmsStoryStyle.css')">
      <CssClassManager
        v-model="innerStory.stylesheets"
        class="CmsStoryStyle__classes"
        @update:model-value="emitUpdate"
      />
    </UiTab>
  </UiTabs>
</template>

<style lang="scss">
.CmsStoryStyle {
  &__properties {
    padding: 16px 12px;
  }

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

      & > span,
      & > .SpacingBox__height {
        display: none;
      }
    }
  }
}
</style>