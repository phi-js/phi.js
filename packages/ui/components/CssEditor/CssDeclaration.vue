<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'

import { sanitizeDeclarationObject } from './helpers.js'

import UiDetails from '../UiDetails/UiDetails.vue'
import UiItemFinder from '../UiItemFinder/UiItemFinder.vue'
import UiDialog from '../UiDialog/UiDialog.vue'
import UiItem from '../UiItem/UiItem.vue'
import UiInput from '../UiInput/UiInput.vue'

import CssInput from './CssInput.vue'
import cssPropertiesTree from './tree.js'

const i18n = useI18n({
  en: {
    'CssDeclaration.QuickAdd': 'Add property',
    'CssDeclaration.AddProperty': 'Add CSS property',
    'CssDeclaration.PromptLabel': 'Property name',
    'CssDeclaration.CustomCssVariables': 'Custom variables',
    'CssDeclaration.OtherCssProperties': 'Other properties',
  },
  es: {
    'CssDeclaration.QuickAdd': 'Agregar propiedad',
    'CssDeclaration.AddProperty': 'Agregar propiedad CSS',
    'CssDeclaration.PromptLabel': 'Nombre de la propiedad',
    'CssDeclaration.CustomCssVariables': 'Variables',
    'CssDeclaration.OtherCssProperties': 'Otras propiedades',
  },
})

const props = defineProps({
  /*
  Object with CSS properties

  * Existing property names in camelCase format will be converted to dash-case (valid CSS property name)
    e.g. backgroundImage --> background-image

  {
    "font-family": "MyFontWhatever, sans-serif",
    "color": "#fff",
    "textShadow": "1px 1px 1px #000",
    "backgroundImage": "url(....)",  --> will be converted to "background-image"
    "background-attachment": "fixed",

    ... any CSS property name
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const css = ref({})

watch(
  () => props.modelValue,
  () => css.value = sanitizeDeclarationObject(props.modelValue),
  { immediate: true },
)


const usedTree = computed(() => {
  const retval = []
  const seenProps = {} // seenProps['font-family'] = true/false

  cssPropertiesTree.forEach((propGroup) => {
    if (!propGroup.children) {
      return
    }

    const usedProperties = propGroup.children.filter((prop) => typeof css.value[prop.value] !== 'undefined')
    const unusedProperties = propGroup.children.filter((prop) => typeof css.value[prop.value] === 'undefined')

    if (usedProperties.length) {
      retval.push({
        ...propGroup,
        children: usedProperties,
        unusedProperties,
      })

      usedProperties.forEach((cssProp) => seenProps[cssProp.value] = true)
    }
  })

  // CSS properties declared in the value but not present in
  // the property tree
  const unseenProps = []
  const cssVariableProps = []

  Object.keys(css.value).forEach((propName) => {
    if (!seenProps[propName]) {

      if (propName.startsWith('--')) {
        cssVariableProps.push({
          value: propName,
          text: propName,
        })
      } else {
        unseenProps.push({
          value: propName,
          text: propName,
        })
      }

    }
  })

  if (cssVariableProps.length) {
    retval.push({
      text: i18n.t('CssDeclaration.CustomCssVariables'),
      children: cssVariableProps,
    })
  }

  if (unseenProps.length) {
    retval.push({
      text: i18n.t('CssDeclaration.OtherCssProperties'),
      children: unseenProps,
    })
  }

  return retval
})

function onSelectItem($event) {
  if (typeof css.value[$event.value] !== 'undefined') { // Ignore if already declared
    return
  }

  if ($event.value === 'new') {
    const propName = prompt(i18n.t('CssDeclaration.PromptLabel'))
    if (!propName) {
      return false
    }

    const newProp = propName.replace(/[^a-zA-Z\-_:]/g, '').toLowerCase()
    if (!newProp) {
      return false
    }

    const parts = newProp.split(':', 2)
    css.value[parts[0]] = parts[1] || null

  } else {
    css.value[$event.value] = null
  }

  emitUpdate()
  return true
}

function removeProp(propName) {
  delete css.value[propName]
  emitUpdate()
}

function emitUpdate() {
  emit('update:modelValue', css.value)
}

function onQuickSelect($event) {
  css.value[$event] = null
  emitUpdate()
}
</script>

<template>
  <div class="CssDeclaration">
    <UiDetails
      v-for="(propGroup) in usedTree"
      :key="propGroup.text"
      open
      :text="propGroup.text"
      :subtext="propGroup.subtext"
    >
      <div class="CssDeclaration__properties">
        <CssInput
          v-for="(cssProp) in propGroup.children"
          :key="cssProp.value"
          v-model="css[cssProp.value]"
          :type="cssProp.type"
          :label="cssProp.text"
          @update:model-value="emitUpdate"
          @delete="removeProp(cssProp.value)"
        />
      </div>

      <!-- Quick adder -->
      <UiInput
        v-if="propGroup.unusedProperties?.length"
        class="CssDeclaration__quickAdd"
        type="select-native"
        :placeholder="i18n.t('CssDeclaration.QuickAdd')"
        :options="propGroup.unusedProperties"
        @update:model-value="$event => onQuickSelect($event)"
      />
    </UiDetails>

    <UiDialog>
      <template #trigger>
        <UiItem
          class="CssDeclaration__adder"
          :text="i18n.t('CssDeclaration.AddProperty')"
          icon="mdi:plus"
        />
      </template>
      <template #default="{ close }">
        <UiItemFinder
          :items="cssPropertiesTree"
          @select-item="$event => onSelectItem($event) && close()"
        />
      </template>
    </UiDialog>
  </div>
</template>