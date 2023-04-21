<script setup>
import { computed, ref, watch } from 'vue'

import { UiInput, UiIcon, UiDialog } from '../'
import { cssStringToObject, cssObjectToString } from './helpers.js'
import CssDeclaration from './CssDeclaration.vue'

import OpenAiCss from '@/packages/cms/plugins/openai/OpenAiCss.vue'

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

      <UiDialog>
        <template #trigger>
          <UiIcon
            title="Edit styles with ChatGPT"
            class="CssEditor__button"
            src="mdi:head-snowflake"
          />
        </template>
        <template #default="{ close }">
          <OpenAiCss
            :existing="props.modelValue"
            @input="$event => { onOpenAiInput($event); close(); }"
          />
        </template>
      </UiDialog>

      <UiIcon
        class="CssEditor__button"
        :class="{'CssEditor__button--active': isSourceOpen}"
        src="mdi:code-json"
        @click="isSourceOpen = !isSourceOpen"
      />
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

  &__button {
    width: 38px;
    height: 38px;
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

  .OpenAiCss {
    margin: 6px;
  }
}
</style>