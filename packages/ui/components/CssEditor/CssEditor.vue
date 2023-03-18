<script setup>
import { ref, watch } from 'vue'
import UiDetails from '../UiDetails/UiDetails.vue'

import Background from './properties/Background.vue'
import Spacing from './properties/Spacing.vue'
import Typography from './properties/Typography.vue'
import CssDisplay from './properties/CssDisplay.vue'

const props = defineProps({
  /*
  CSS Object:
  {
    fontFamily: 'MyFontWhatever, sans-serif',
    color: "#fff",
    textShadow: "1px 1px 1px #000",
    backgroundImage: "url(....)",
    backgroundAttachment: "fixed",
    ... every CSS property (yeah)
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
  () => css.value = convertToCamelCase(props.modelValue),
  { immediate: true },
)

function convertToCamelCase(obj) {
  const camelCaseObj = {}
  for (let prop in obj) {
    const camelCaseProp = prop.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
    camelCaseObj[camelCaseProp] = obj[prop]
  }
  return camelCaseObj
}
</script>

<template>
  <div class="CssEditor">
    <UiDetails
      open
      text="Spacing"
      class="CssEditor__spacing"
    >
      <Spacing
        v-model="css"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </UiDetails>

    <UiDetails
      text="Background"
      class="CssEditor__background"
    >
      <Background
        v-model="css"
        :endpoint="$attrs.endpoint"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </UiDetails>

    <UiDetails
      text="Display"
      class="CssEditor__display"
    >
      <CssDisplay
        v-model="css"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </UiDetails>

    <UiDetails
      text="Typography"
      class="CssEditor__typography"
    >
      <Typography
        v-model="css"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </UiDetails>
  </div>
</template>

<style lang="scss">
.CssEditor {
  &__background,
  &__display,
  &__typography {

    .UiInput {
      width: 100%;
      margin: 3px 0;
      padding: 3px 0;
      border-bottom: 1px solid var(--ui-color-hover);

      display: flex;
      flex-wrap: wrap;

      &__label {
        width: 90px;
        overflow: hidden;
        text-overflow: ellipsis;

        padding: 8px 0;
        font-size: 11px;
        font-weight: normal;
      }

      &__body {
        flex: 1;
      }

      &__element {
        width: 100%;
      }
    }

    .UiSelectButtons {
      flex-wrap: wrap;
    }

    .UiSelectButtons__button {
      // flex: 1;
      width: 130px;
    }
  }
}
</style>