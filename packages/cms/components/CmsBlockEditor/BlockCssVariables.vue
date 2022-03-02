<script setup>
import { ref, reactive, watch } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  Object defining CSS rules/variables
  {
    "--ui-content-width": "70%",
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
    style.value['--ui-color-primary'] = raw.colorPrimary.hex

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
  <div class="BlockCssVariables UiForm">
    <fieldset>
      <legend>Spacing</legend>

      <UiInput label="Content width">
        <div class="UiGroup">
          <UiInput
            v-model="raw.contentWidth.value"
            type="number-slide"
            :min="raw.contentWidth.units == 'px' ? 100 : 5"
            :max="raw.contentWidth.units == 'px' ? 2048 : 100"
          />
          <select v-model="raw.contentWidth.units" class="UiInput">
            <option value="%">%</option>
            <option value="px">px</option>
          </select>
        </div>
      </UiInput>

      <UiInput v-model="raw.margin.value" label="Margin" type="number-slide" min="0" max="100" />
    </fieldset>

    <fieldset>
      <legend>Color</legend>
      <UiInput v-model="raw.colorPrimary.hex" label="Primary" type="color" />
    </fieldset>
  </div>
</template>