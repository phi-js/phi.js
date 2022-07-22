<script setup>
import { onMounted, ref, watch, reactive, nextTick } from 'vue'

import { colorScheme, UiTabs, UiTab, UiDetails } from '@/packages/ui'
import CssStyleEditor from '@/packages/ui/components/CssStyleEditor/CssStyleEditor.vue'

import { useStorySettings } from '../../functions'
import CmsThemePicker from '../CmsThemePicker/CmsThemePicker.vue'
import CssClassManager from '../CssClassManager/CssClassManager.vue'

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
  (newStory) => {
    innerStory.value = { css: {}, ...newStory }
    if (!innerStory.value.css?.style) {
      innerStory.value.css.style = {}
    }
    if (!innerStory.value.css?.classes) {
      innerStory.value.css.classes = []
    }
  },
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

const drawers = [
  {
    title: 'Margins',
    properties: {
      '--ui-content-width': { title: 'Max. content width', format: 'css-unit' },
      '--cms-page-margin': { format: 'css-spacing' },
    },
  },
]


// ////

/*
Determine the current values for the editable CSS variables
--ui-color-background
--ui-color-foreground
--ui-color-primary
*/
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 80)) // !!! ugh
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
</script>

<template>
  <UiTabs class="CmsStoryStyle">
    <UiTab text="Theme">
      <CmsThemePicker
        v-model="innerStory.themes"
        @update:model-value="emitUpdate"
      />
    </UiTab>

    <UiTab text="Classes">
      <CssClassManager
        v-model="innerStory.css.classes"
        class="CmsStoryStyle__classes"
        @update:model-value="emitUpdate"
      />
    </UiTab>

    <UiTab text="Properties">
      <div class="CmsStoryStyle__properties">
        <UiDetails
          text="Colors"
          group="CmsStoryStyle__properties"
        >
          <UiTabs
            v-model="colorScheme"
            @update:model-value="getCurrentCssValues()"
          >
            <UiTab
              text="Light"
              value="light"
            >
              <CssStyleEditor
                v-model="innerStory.css['style-light']"
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
                v-model="innerStory.css['style-dark']"
                class="UiForm--wide"
                :schema="colorSchemeCss"
                @update:model-value="emitUpdate"
              />
            </UiTab>
          </UiTabs>
        </UiDetails>

        <UiDetails
          v-for="(drawer,i) in drawers"
          :key="i"
          :text="drawer.title"
          group="CmsStoryStyle__properties"
        >
          <CssStyleEditor
            v-model="innerStory.css.style"
            :schema="drawer"
            :endpoint="uploadsEndpoint"
            @update:model-value="emitUpdate"
          />
        </UiDetails>
      </div>
    </UiTab>
  </UiTabs>
</template>

<style lang="scss">
.CmsStoryStyle {
  &__classes,
  &__properties {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 6px;
  }
}
</style>