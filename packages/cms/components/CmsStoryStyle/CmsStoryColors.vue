<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { colorScheme, UiTabs, UiTab } from '@/packages/ui'

import StoryColorPalette from './StoryColorPalette.vue'

const i18n = useI18n({
  en: {
    'CmsStoryColors.Light': 'Light',
    'CmsStoryColors.Dark': 'Dark',

  },
  es: {
    'CmsStoryColors.Light': 'Claro',
    'CmsStoryColors.Dark': 'Oscuro',
  },
})

const props = defineProps({
  story: {
    type: Object,
    required: true,
  },
})

const innerStory = ref()
const defaultValues = ref()


watch(
  () => props.story,
  () => {
    innerStory.value = { ...props.story }
    nextTick(() => {
      defaultValues.value = getCurrentColorVariableValues()
    })
  },
  { immediate: true },
)

watch(
  colorScheme,
  () => {
    nextTick(() => {
      defaultValues.value = getCurrentColorVariableValues()
    })
  },
)


const emit = defineEmits(['update:story'])


function getCurrentColorVariableValues() {
  const retval = {
    '--ui-color-background': '',
    '--ui-color-foreground': '',
    '--ui-color-primary': '',
  }
  const elStory = document.querySelector('.CmsStoryEditor, .CmsStory')
  if (elStory) {
    const elStyle = getComputedStyle(elStory)
    Object.keys(retval).forEach((varName) => {
      retval[varName] = elStyle.getPropertyValue(varName).trim()
    })
  }
  return retval
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

  emit('update:story', { ...innerStory.value })
}

const innerStoryVariablesLight = computed({
  get: () => getSheetSrc('story-style-light') || {},
  set: (newValue) => setSheetSrc('story-style-light', newValue),
})

const innerStoryVariablesDark = computed({
  get: () => getSheetSrc('story-style-dark') || {},
  set: (newValue) => setSheetSrc('story-style-dark', newValue),
})

</script>

<template>
  <UiTabs
    v-model="colorScheme"
    class="CmsStoryColors"
  >
    <UiTab
      :text="i18n.t('CmsStoryColors.Light')"
      value="light"
    >
      <StoryColorPalette
        v-model="innerStoryVariablesLight"
        :default-values="defaultValues"
      />
    </UiTab>
    <UiTab
      :text="i18n.t('CmsStoryColors.Dark')"
      value="dark"
    >
      <StoryColorPalette
        v-model="innerStoryVariablesDark"
        :default-values="defaultValues"
      />
    </UiTab>
  </UiTabs>
</template>