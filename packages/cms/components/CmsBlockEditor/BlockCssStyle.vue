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
  <div class="BlockCssStyle">
    <details>
      <summary>
        <input
          type="checkbox"
          :checked="!!innerValue['--ui-content-width']"
          @change="toggleProperty('--ui-content-width', 'auto')"
        >
        Content width
      </summary>
      <section>
        <UiInput
          v-model="innerValue['--ui-content-width']"
          @update:model-value="emitUpdate()"
        />
      </section>
    </details>

    <details>
      <summary>Background</summary>
      <section>
        <PropBackground
          v-model="innerValue"
          :endpoint="uploadsEndpoint"
          @update:model-value="emitUpdate()"
        />
      </section>
    </details>

    <details>
      <summary>
        <input
          type="checkbox"
          :checked="!!innerValue.margin"
          @change="toggleProperty('margin', 'auto auto auto auto')"
        >
        Margin
      </summary>
      <section>
        <SpacingEditor
          v-model="innerValue.margin"
          @update:model-value="emitUpdate()"
        />
      </section>
    </details>

    <details>
      <summary>
        <input
          type="checkbox"
          :checked="!!innerValue.padding"
          @change="toggleProperty('padding', '0 0 0 0')"
        >
        Padding
      </summary>
      <section>
        <SpacingEditor
          v-model="innerValue.padding"
          @update:model-value="emitUpdate()"
        />
      </section>
    </details>

    <details>
      <summary>Palette</summary>
      <section>
        <UiInput
          v-model="innerValue.color"
          label="Font color"
          type="color"
          @update:model-value="emitUpdate()"
        />
        <UiInput
          v-model="innerValue['--ui-color-primary']"
          label="Primary"
          type="color"
          @update:model-value="emitUpdate()"
        />
        <UiInput
          v-model="innerValue['--ui-color-danger']"
          label="Danger"
          type="color"
          @update:model-value="emitUpdate()"
        />
      </section>
    </details>
  </div>
</template>