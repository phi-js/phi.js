<script setup>
/*
The block's "transitions" object defines CSS class names to be applied to the element
during navigation events and v-if transitions

transitions: {
  "navigation-forward-enter": "fadeInRight",
  "navigation-forward-leave": "fadeOutLeft",
  "navigation-back-enter": "fadeInRight",
  "navigation-back-leave": "fadeOutLeft",
  "show": "fadeIn",
  "hide": "fadeOut",
}

A list of available transitions can be found in:
/components/CmsStory/transitions/**.scss

... which are basically the same classes defined in Animate.css
e.g.: animate__backInDown see: https://animate.style/


This editor also provides a list of pre-created transition names (i.e. "transition templates")

[
  {
    id: 'nav-fade-horizontal',
    name: 'horizontal fade',
    transitions: {
      'navigation-forward-enter': 'fadeInRight',
      'navigation-forward-leave': 'fadeOutLeft',
      'navigation-back-enter': 'fadeInRight',
      'navigation-back-leave': 'fadeOutLeft',
    },
  },
  {
    id: 'nav-fade-vertical',
    name: 'vertical fade',
    transitions: {
      'navigation-forward-enter': 'fadeInTop',
      'navigation-forward-leave': 'fadeOutBottom',
      'navigation-back-enter': 'fadeInTop',
      'navigation-back-leave': 'fadeOutBottom',
    },
  },
  ...
]
*/
import { computed, ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'

const i18n = useI18n({
  en: {
    'BlockTransitionsEditor.Navigation': 'Navigation',
    'BlockTransitionsEditor.onNavigationEnter': 'On navigation enter',
    'BlockTransitionsEditor.onNavigationLeave': 'On navigation leave',
    'BlockTransitionsEditor.movingForward': 'Moving forward',
    'BlockTransitionsEditor.movingBack': 'Moving back',
  },

  es: {
    'BlockTransitionsEditor.Navigation': 'Navegación',
    'BlockTransitionsEditor.onNavigationEnter': 'Al entrar en la pagina',
    'BlockTransitionsEditor.onNavigationLeave': 'Al salir de la pagina',
    'BlockTransitionsEditor.movingForward': 'Avanzando',
    'BlockTransitionsEditor.movingBack': 'Retrocediendo',
  },
})

const availableTransitions = [
  'bounceInLeft',
  'bounceInRight',
  'bounceOutLeft',
  'bounceOutRight',

  'fadeInLeft',
  'fadeInRight',
  'fadeOutLeft',
  'fadeOutRight',

  'fadeInTop',
  'fadeInBottom',
  'fadeOutTop',
  'fadeOutBottom',
]

const availableTemplates = [
  {
    id: 'nav-fade-horizontal',
    name: 'Horizontal slide',
    transitions: {
      'navigation-forward-enter': 'fadeInRight',
      'navigation-forward-leave': 'fadeOutLeft',
      'navigation-back-enter': 'fadeInLeft',
      'navigation-back-leave': 'fadeOutRight',
    },
  },
  {
    id: 'nav-bounce-horizontal',
    name: 'Horizontal bounce',
    transitions: {
      'navigation-forward-enter': 'bounceInRight',
      'navigation-forward-leave': 'bounceOutLeft',
      'navigation-back-enter': 'bounceInLeft',
      'navigation-back-leave': 'bounceOutRight',
    },
  },
  {
    id: 'nav-fade-vertical',
    name: 'Vertical slide',
    transitions: {
      'navigation-forward-enter': 'fadeInBottom',
      'navigation-forward-leave': 'fadeOutTop',
      'navigation-back-enter': 'fadeInTop',
      'navigation-back-leave': 'fadeOutBottom',
    },
  },
  {
    id: 'custom',
    name: 'Custom',
  },
]


const props = defineProps({
  /**
   * @model Block object
   */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const transitions = ref()

watch(
  () => props.modelValue,
  () => transitions.value = props.modelValue?.transitions || {},
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', {
    ...props.modelValue,
    transitions: transitions.value,
  })
}

const currentTemplateId = computed({
  get() {
    return transitions.value?.id || 'custom'
  },
  set(templateId) {
    const tpl = availableTemplates.find((t) => t.id == templateId)
    if (tpl?.transitions) {
      transitions.value = {
        id: templateId,
        ...tpl.transitions,
      }
    } else {
      transitions.value.id = 'custom'
    }
    emitUpdate()
  },
})
</script>

<template>
  <div class="BlockTransitionsEditor">
    <UiInput
      v-model="currentTemplateId"
      type="select-native"
      :options="availableTemplates"
      :label="i18n.t('BlockTransitionsEditor.Navigation')"
      option-value="$.id"
      option-text="$.name"
    />

    <template v-if="currentTemplateId == 'custom'">
      <fieldset>
        <legend>{{ i18n.t('BlockTransitionsEditor.movingForward') }}</legend>
        <UiInput
          v-model="transitions['navigation-forward-enter']"
          type="select-native"
          :label="i18n.t('BlockTransitionsEditor.onNavigationEnter')"
          :options="availableTransitions"
          @update:model-value="emitUpdate"
        />
        <UiInput
          v-model="transitions['navigation-forward-leave']"
          type="select-native"
          :label="i18n.t('BlockTransitionsEditor.onNavigationLeave')"
          :options="availableTransitions"
          @update:model-value="emitUpdate"
        />
      </fieldset>

      <fieldset>
        <legend>{{ i18n.t('BlockTransitionsEditor.movingBack') }}</legend>
        <UiInput
          v-model="transitions['navigation-back-enter']"
          type="select-native"
          :label="i18n.t('BlockTransitionsEditor.onNavigationEnter')"
          :options="availableTransitions"
          @update:model-value="emitUpdate"
        />
        <UiInput
          v-model="transitions['navigation-back-leave']"
          type="select-native"
          :label="i18n.t('BlockTransitionsEditor.onNavigationLeave')"
          :options="availableTransitions"
          @update:model-value="emitUpdate"
        />
      </fieldset>
    </template>
  </div>
</template>