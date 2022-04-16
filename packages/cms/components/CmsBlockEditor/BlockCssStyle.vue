<script setup>
import { ref, watch, inject } from 'vue'
import { UiInput } from '@/packages/ui'
import SpacingEditor from './props/SpacingEditor.vue'
import PropBackground from './props/PropBackground.vue'

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


const injectedStoryEditor = inject('$_cms_story_builder', {})
const uploadsEndpoint = injectedStoryEditor.settings?.uploads?.endpoint

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
    <details>
      <summary>
        Content width
        <input
          type="checkbox"
          :checked="!!innerValue['--ui-content-width']"
          @change="toggleProperty('--ui-content-width', 'auto')"
        >
      </summary>
      <UiInput
        v-model="innerValue['--ui-content-width']"
        @update:modelValue="emitUpdate()"
      />
    </details>

    <details>
      <summary>Background</summary>
      <PropBackground
        v-model="innerValue"
        class="UiForm UiForm--wide"
        :endpoint="uploadsEndpoint"
        @update:modelValue="emitUpdate()"
      />
    </details>

    <details>
      <summary>
        Margin
        <input
          type="checkbox"
          :checked="!!innerValue.margin"
          @change="toggleProperty('margin', 'auto auto auto auto')"
        >
      </summary>
      <SpacingEditor
        v-model="innerValue.margin"
        class="UiForm UiForm--wide"
        @update:modelValue="emitUpdate()"
      />
    </details>

    <details>
      <summary>
        Padding
        <input
          type="checkbox"
          :checked="!!innerValue.padding"
          @change="toggleProperty('padding', '0 0 0 0')"
        >
      </summary>
      <SpacingEditor
        v-model="innerValue.padding"
        class="UiForm UiForm--wide"
        @update:modelValue="emitUpdate()"
      />
    </details>

    <details>
      <summary>Color</summary>
      <div class="UiForm UiForm--wide">
        <UiInput
          v-model="innerValue.color"
          label="Font color"
          type="color"
          @update:modelValue="emitUpdate()"
        />
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
      </div>
    </details>
  </div>
</template>