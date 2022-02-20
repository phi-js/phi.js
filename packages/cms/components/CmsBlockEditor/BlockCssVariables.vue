<script setup>
import { ref, reactive, watch } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  Object defining CSS rules/variables
  {
    "--ui-content-width": "70%",
    "--ui-padding-vertical": "20px",
    ...
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

const style = ref({})

const raw = reactive({
  contentWidth: { value: 100, units: '%' },
  paddingVertical: { value: 0, units: 'px' },
  paddingHorizontal: { value: 0, units: 'px' },
  radius: { value: 0, units: 'px' },
  breathe: { value: 0, units: 'px' },
  colorPrimary: { hex: '', opacity: 100 },
  colorSecondary: { hex: '', opacity: 100 },

  margin: { value: 0, units: 'px' },
})


/* Parse incoming variables object */
let ignoreRawChange = true

watch(
  () => props.modelValue,
  (variables) => {
    ignoreRawChange = true

    raw.contentWidth = parseUnits(variables['--ui-content-width'], 100, '%')
    raw.paddingVertical = parseUnits(variables['--ui-padding-vertical'], 0, 'px')
    raw.paddingHorizontal = parseUnits(variables['--ui-padding-horizontal'], 0, 'px')
    raw.radius = parseUnits(variables['--ui-radius'], 0, 'px')
    raw.breathe = parseUnits(variables['--ui-breathe'], 0, 'px')

    raw.margin = parseUnits(variables.margin, 0, 'px')
  },
  { immediate: true },
)

watch(
  () => raw,
  () => {
    if (ignoreRawChange) {
      ignoreRawChange = false
      return
    }

    style.value['--ui-content-width'] = raw.contentWidth.value + raw.contentWidth.units
    style.value['--ui-padding-vertical'] = raw.paddingVertical.value + raw.paddingVertical.units
    style.value['--ui-padding-horizontal'] = raw.paddingHorizontal.value + raw.paddingHorizontal.units
    style.value['--ui-radius'] = raw.radius.value + raw.radius.units
    style.value['--ui-breathe'] = raw.breathe.value + raw.breathe.units
    style.value['--ui-color-primary'] = raw.colorPrimary.hex
    style.value['--ui-color-secondary'] = raw.colorSecondary.hex

    style.value.margin = raw.margin.value + raw.margin.units
    emit('update:modelValue', { ...style.value })
  },
  { immediate: true, deep: true },
)

function parseUnits(incoming, defaultValue = null, defaultUnits = null) {
  if (!incoming) {
    return { value: defaultValue, units: defaultUnits }
  }

  if (incoming.slice(-2) === 'px') {
    return {
      value: incoming.slice(0, -2),
      units: 'px',
    }
  }

  if (incoming.slice(-1) === '%') {
    return {
      value: incoming.slice(0, -1),
      units: '%',
    }
  }

  return { value: defaultValue, units: defaultUnits }
}
</script>

<template>
  <div class="BlockCssVariables">
    <fieldset>
      <legend>Spacing</legend>

      <UiInput
        label="Content width"
        class="UiInput--flex"
      >
        <div class="ui__group">
          <UiInput
            v-model="raw.contentWidth.value"
            type="number-slide"
            :min="raw.contentWidth.units == 'px' ? 100 : 5"
            :max="raw.contentWidth.units == 'px' ? 2048 : 100"
          />
          <select
            v-model="raw.contentWidth.units"
            class="ui__input"
          >
            <option value="%">
              %
            </option>
            <option value="px">
              px
            </option>
          </select>
        </div>
      </UiInput>

      <UiInput
        v-model="raw.radius.value"
        class="UiInput--flex"
        label="Border radius"
        type="number-slide"
        min="0"
        max="100"
      />

      <UiInput
        v-model="raw.breathe.value"
        class="UiInput--flex"
        label="Breathe"
        type="number-slide"
        min="0"
        max="100"
      />

      <UiInput
        v-model="raw.margin.value"
        class="UiInput--flex"
        label="Margin"
        type="number-slide"
        min="0"
        max="100"
      />
    </fieldset>


    <fieldset>
      <legend>Padding</legend>
      <UiInput
        v-model="raw.paddingVertical.value"
        class="UiInput--flex"
        label="Vertical"
        type="number-slide"
        min="0"
        max="300"
      />

      <UiInput
        v-model="raw.paddingHorizontal.value"
        class="UiInput--flex"
        label="Horizontal"
        type="number-slide"
        min="0"
        max="300"
      />
    </fieldset>

    <fieldset>
      <legend>Color</legend>
      <UiInput
        v-model="raw.colorPrimary.hex"
        class="UiInput--flex"
        label="Primary"
        type="color"
      />

      <UiInput
        v-model="raw.colorSecondary.hex"
        class="UiInput--flex"
        label="Secondary"
        type="color"
      />
    </fieldset>
  </div>
</template>

<style lang="scss">
.UiInput--flex {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .UiInput {
    &__label {
      width: 128px;
    }

    &__body {
      flex: 1;
    }
  }
}
</style>