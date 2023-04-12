<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput, UiItem } from '@/packages/ui'
import CssUnit from '../../../ui/components/CssEditor/values/unit.vue'

import promptImportFont from '../CmsStoryBuilder/promptImportFont'

const i18n = useI18n({
  en: {
    'CmsStoryFont.Defaults': 'Default fonts',
    'CmsStoryFont.AvailableFonts': 'Available fonrts',
    'CmsStoryFont.fontTitles': 'Titles',
    'CmsStoryFont.fontTexts': 'Texts',
    'CmsStoryFont.fontSize': 'Size',
    'CmsStoryFont.ImportGoogleFont': 'Import Google font',
    'CmsStoryFont.RemoveFont': 'Remove font?',

  },
  es: {
    'CmsStoryFont.Defaults': 'Fuentes predeterminadas',
    'CmsStoryFont.AvailableFonts': 'Fuentes disponibles',
    'CmsStoryFont.fontTitles': 'Títulos',
    'CmsStoryFont.fontTexts': 'Textos',
    'CmsStoryFont.fontSize': 'Tamaño',
    'CmsStoryFont.ImportGoogleFont': 'Importar de Google fonts',
    'CmsStoryFont.RemoveFont': 'Eliminar esta fuente?',
  },
})

const props = defineProps({
  story: {
    type: Object,
    required: true,
  },

  storyCssVariables: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:story', 'update:story-css-variables'])

const fonts = ref([])
watch(
  () => props.story,
  (newStory) => fonts.value = Array.isArray(newStory?.fonts) ? newStory.fonts : [],
  { immediate: true },
)

function emitUpdate() {
  emit('update:story', {
    ...props.story,
    fonts: fonts.value.concat([]),
  })
}

const availableFontsOptions = computed(() => {
  return [
    {
      value: null,
      text: 'Default',
    },

    ...fonts.value.map((font) => ({
      value: font.fontFamily,
      text: font.name,
    })),
  ]
})

async function importGoogleFont() {
  const googleFont = await promptImportFont()
  if (!googleFont) {
    return
  }

  fonts.value.push(googleFont)
  emitUpdate()
}

function deleteFontAt(index) {
  if (!confirm(i18n.t('CmsStoryFont.RemoveFont'))) {
    return
  }

  fonts.value.splice(index, 1)
  emitUpdate()
}
</script>

<template>
  <div class="CmsStoryFont UiForm UiForm--wide">
    <fieldset class="CmsStoryFont__defaults">
      <legend>{{ i18n.t('CmsStoryFont.Defaults') }}</legend>
      <UiInput
        type="select-native"
        :options="availableFontsOptions"
        :label="i18n.t('CmsStoryFont.fontTitles')"
        :model-value="props.storyCssVariables['--ui-font-titles']"
        @update:model-value="emit('update:story-css-variables', {
          ...props.storyCssVariables,
          '--ui-font-titles': $event
        })"
      />

      <UiInput
        type="select-native"
        :options="availableFontsOptions"
        :label="i18n.t('CmsStoryFont.fontTexts')"
        :model-value="props.storyCssVariables['--ui-font-texts']"
        @update:model-value="emit('update:story-css-variables', {
          ...props.storyCssVariables,
          '--ui-font-texts': $event
        })"
      />

      <CssUnit
        :label="i18n.t('CmsStoryFont.fontSize')"
        :model-value="props.storyCssVariables['--ui-font-size']"
        @update:model-value="emit('update:story-css-variables', {
          ...props.storyCssVariables,
          '--ui-font-size': $event
        })"
      />
    </fieldset>

    <fieldset>
      <legend>{{ i18n.t('CmsStoryFont.AvailableFonts') }}</legend>
      <UiItem
        v-for="(font, i) in fonts"
        :key="font.id"
        class="CmsStoryFont__font"
        :text="font.name"
        icon="mdi:format-font"
        @delete="deleteFontAt(i)"
      />
      <UiItem
        class="CmsStoryFont__adder"
        :text="i18n.t('CmsStoryFont.ImportGoogleFont')"
        icon="mdi:plus"
        @click="importGoogleFont"
      />
    </fieldset>
  </div>
</template>