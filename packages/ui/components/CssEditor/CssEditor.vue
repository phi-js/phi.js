<script setup>
import { computed, ref, watch } from 'vue'

import { UiInput, UiItem, UiDialog, UiTabs, UiTab } from '../'
import { cssStringToObject, cssObjectToString } from './helpers.js'
import CssDeclaration from './CssDeclaration.vue'

import OpenAiCss from '@/packages/cms/plugins/openai/OpenAiCss.vue'
import { useI18n } from '../../../i18n'

const i18n = useI18n({
  en: {
    'CssEditor.Rules': 'Rules',
    'CssEditor.Source': 'Source',
  },
  es: {
    'CssEditor.Rules': 'Reglas',
    'CssEditor.Source': 'CSS',
  },
})

const props = defineProps({
  /*
  A String with CSS:

  "
  .someClass {
    background: red !important;
  }
  .someClass > h1 { color: red; }

  // !!! Not supported yet: media queries
  @media only screen and (max-width: 600px) {
    body {
      background-color: lightblue;
    }
  }
  "
  */
  modelValue: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerObject = ref()
const availableSelectors = computed(() => Object.keys(innerObject.value))
const selectedSelector = ref()
const isSourceOpen = ref(false)

watch(
  () => props.modelValue,
  (newValue) => {
    innerObject.value = cssStringToObject(newValue)
    if (!selectedSelector.value) {
      selectedSelector.value = Object.keys(innerObject.value)[0]
    }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', cssObjectToString(innerObject.value))
}

function onOpenAiInput($event) {
  emit('update:modelValue', $event)
}

</script>

<template>
  <div class="CssEditor">
    <div class="CssEditor__header">
      <slot name="header" />
      <div class="CssEditor__spacer" />

      <UiInput
        v-if="availableSelectors.length > 1"
        v-model="selectedSelector"
        :disabled="isSourceOpen"
        class="CssEditor__selectorPicker"
        type="select-native"
        :options="availableSelectors"
      />

      <UiTabs
        v-model="isSourceOpen"
        class="CssEditor__tabs"
      >
        <UiTab
          :value="false"
          :text="i18n.t('CssEditor.Rules')"
        />
        <UiTab
          :value="true"
          :text="i18n.t('CssEditor.Source')"
        />
      </UiTabs>


      <UiDialog>
        <template #trigger>
          <UiItem
            class="CssEditor__aiButton"
            icon="mdi:head-snowflake"
            text="OpenAI"
          />
        </template>
        <template #default="{ close }">
          <OpenAiCss
            :existing="props.modelValue"
            @input="$event => { onOpenAiInput($event); close(); }"
          />
        </template>
      </UiDialog>
    </div>

    <div class="CssEditor__body">
      <UiInput
        v-if="isSourceOpen"
        :model-value="props.modelValue"
        type="code"
        lang="css"
        @update:model-value="$event => emit('update:modelValue', $event)"
      />
      <CssDeclaration
        v-else-if="selectedSelector && innerObject[selectedSelector]"
        v-model="innerObject[selectedSelector]"
        @update:model-value="emitUpdate"
      />
    </div>
  </div>
</template>

<style lang="scss">
.CssEditor {
  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  &__spacer {
    flex: 1;
  }

  &__selectorPicker {
    select {
      max-width: 180px;
    }
  }

  &__aiButton {
    font-size: 0.9em;
    --ui-item-padding: 8px 12px;
    font-weight: bold;
    border-radius: 4px;
    margin: 3px;

    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }

    &--active {
      color: var(--ui-color-primary);
    }
  }

  &__tabs {
    .UiTabs__header {
      padding: 0;
    }
  }

  .OpenAiCss {
    margin: 6px;
  }
}
</style>