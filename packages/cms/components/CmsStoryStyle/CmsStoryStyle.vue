<script setup>
import { onMounted, ref, watch, reactive, nextTick, computed } from 'vue'

import { colorScheme, UiTabs, UiTab, UiInput } from '@/packages/ui'
import CssStyleEditor from '@/packages/ui/components/CssStyleEditor/CssStyleEditor.vue'

import { useStorySettings } from '../../functions'
import CmsThemePicker from '../CmsThemePicker/CmsThemePicker.vue'
import CssClassManager from '../CssClassManager/CssClassManager.vue'
// import CssPalettePicker from '../CssPalettePicker/CssPalettePicker.vue'

const settings = useStorySettings()
const uploadsEndpoint = settings.uploads.assets

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

const fontCss = {
  type: 'object',
  properties: {
    '--ui-font-size': {
      title: 'Base size',
      format: {
        type: 'css-unit',
        props: {
          min: 9,
          max: 30,
          units: 'pt',
          defaultValue: '12pt',
        },
      },
    },
  },
}

const marginCss = {
  type: 'object',
  properties: {
    '--ui-content-width': {
      title: 'Max. content width',
      format: {
        type: 'css-slider',
        props: {
          min: 256,
          max: 1000,
          defaultValue: 1000,
        },
      },
    },

    '--ui-content-margin': {
      title: 'Document margin',
      format: 'css-spacing',
    },
  },
}
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

const availableFonts = computed(() => [
  {
    value: null,
    text: 'Default',
  },

  ...innerStory.value.stylesheets
    .filter((sh) => sh.type == 'google-font')
    .map((sh) => ({
      value: sh.id,
      text: sh.id,
    })),

  {
    value: '-import-',
    text: '... load Google Font',
  },
])

function setFontVariable(varName, varValue) {
  if (varValue == '-import-') {
    return importGoogleFont(varName)
  }

  innerStoryVariables.value = {
    ...innerStoryVariables.value,
    [varName]: varValue,
  }
  emitUpdate()
}

function importGoogleFont(varName) {
  const fontName = prompt('Google font name')
  if (!fontName?.trim?.()) {
    return
  }

  if (innerStory.value.stylesheets.find((sh) => sh.type == 'google-font' && sh.id == fontName)) {
    alert(`Font '${fontName}' id already loaded`)
    return
  }

  innerStory.value.stylesheets.push({
    id: fontName,
    type: 'google-font',
  })

  innerStoryVariables.value = {
    ...innerStoryVariables.value,
    [varName]: fontName,
  }
  emitUpdate()
}
</script>

<template>
  <UiTabs class="CmsStoryStyle">
    <UiTab text="Theme">
      <CmsThemePicker
        v-model="innerStory.stylesheets"
        @update:model-value="emitUpdate"
      />
    </UiTab>

    <UiTab text="Font">
      <div
        class="CmsStoryStyle__properties"
      >
        <UiInput
          label="Titles"
          :model-value="innerStoryVariables['--ui-font-titles']"
          type="select-native"
          :options="availableFonts"
          @update:model-value="setFontVariable('--ui-font-titles', $event)"
        />

        <UiInput
          label="Texts"
          :model-value="innerStoryVariables['--ui-font-texts']"
          type="select-native"
          :options="availableFonts"
          @update:model-value="setFontVariable('--ui-font-texts', $event)"
        />

        <CssStyleEditor
          v-model="innerStoryVariables"
          :schema="fontCss"
          :endpoint="uploadsEndpoint"
          @update:model-value="emitUpdate"
        />
      </div>
    </UiTab>

    <UiTab text="Colors">
      <UiTabs
        v-model="colorScheme"
        @update:model-value="getCurrentCssValues()"
      >
        <UiTab
          text="Light"
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
          text="Dark"
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

    <UiTab text="Margins">
      <CssStyleEditor
        v-model="innerStoryVariables"
        class="CmsStoryStyle__properties"
        :schema="marginCss"
        :endpoint="uploadsEndpoint"
        @update:model-value="emitUpdate"
      />
    </UiTab>

    <UiTab text="CSS">
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
}
</style>