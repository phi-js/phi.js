<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'
import SpacingEditor from './props/SpacingEditor.vue'

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

const innerValue = ref({})

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = typeof newValue == 'object' ? { ...newValue } : {}
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...innerValue.value })
}

function toggleProperty(propName, defaultValue = null) {
  innerValue.value[propName] = innerValue.value?.[propName] ? null : defaultValue
  emitUpdate()
}
</script>

<template>
  <div class="BlockCssStyle UiForm">
    <fieldset>
      <legend>
        Content width
        <input
          type="checkbox"
          :checked="!!innerValue['--ui-content-width']"
          @change="toggleProperty('--ui-content-width', 'auto')"
        />
      </legend>
      <UiInput v-model="innerValue['--ui-content-width']" @update:modelValue="emitUpdate()" />
    </fieldset>

    <fieldset>
      <legend>
        Margin
        <input
          type="checkbox"
          :checked="!!innerValue.margin"
          @change="toggleProperty('margin', 'auto auto auto auto')"
        />
      </legend>
      <SpacingEditor v-model="innerValue.margin" @update:modelValue="emitUpdate()" />
    </fieldset>

    <fieldset>
      <legend>
        Padding
        <input
          type="checkbox"
          :checked="!!innerValue.padding"
          @change="toggleProperty('padding', '0 0 0 0')"
        />
      </legend>
      <SpacingEditor v-model="innerValue.padding" @update:modelValue="emitUpdate()" />
    </fieldset>

    <fieldset>
      <legend>Color</legend>
      <UiInput
        v-model="innerValue['--ui-color-primary']"
        label="Primary"
        type="color"
        @update:modelValue="emitUpdate()"
      />
      <UiInput
        v-model="innerValue['--ui-color-danger']"
        label="Danger"
        type="color"
        @update:modelValue="emitUpdate()"
      />
    </fieldset>

    <!-- <fieldset>
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
    </fieldset>-->
  </div>
</template>