<script setup>
import { computed, ref, watchEffect } from 'vue'
import { UiInput, UiDrawer, UiItem } from '../../../ui'
import { useI18n } from '../../../i18n'

const props = defineProps({
  modelValue: {
    validator: () => true,
    required: false,
    default: null,
  },

  block: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue', 'update:block'])

const i18n = useI18n()
const langValue = ref()
const dictionary = computed(() => props.block?.i18n || { en: {}, es: {}, de: {} })

function onUpdateDictionary() {
  const newDictionary = {}
  Object.keys(dictionary.value).forEach((langCode) => {
    newDictionary[langCode] = {
      ...dictionary.value[langCode],
      [langValue.value.text]: langValue.value.translations[langCode],
    }
  })

  emit('update:block', { ...props.block, i18n: newDictionary })
}

watchEffect(() => {
  if (typeof props.modelValue != 'string') {
    langValue.value = null
    return
  }

  const text = props.modelValue.match(/lang\(([^"]+?)\)/)?.[1]
  if (!text) {
    langValue.value = null
    return
  }

  const translations = {}
  Object.keys(dictionary.value).forEach((langCode) => {
    translations[langCode] = dictionary.value[langCode]?.[text] || '????'
  })

  langValue.value = {
    text,
    translations,
  }
})
</script>

<template>
  <div class="StoryPropInput">
    <UiDrawer v-if="langValue">
      <template #trigger>
        <UiInput v-bind="$attrs">
          <UiItem
            class="ui--clickable"
            icon="mdi:translate"
            :text="langValue.translations[i18n.locale]"
            :subtext="props.modelValue"
          />
        </UiInput>
      </template>
      <template #contents>
        <div style="padding: 12px 0 50px 12px">
          <!-- <UiInput
            v-model="langValue.text"
            label="Base text"
          /> -->
          <UiInput
            v-for="(word, langCode) in langValue.translations"
            :key="langCode"
            v-model="langValue.translations[langCode]"
            :label="langCode"
            @update:modelValue="onUpdateDictionary"
          />
        </div>
      </template>
    </UiDrawer>
    <UiInput
      v-else
      v-bind="$attrs"
      :model-value="props.modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
    />
  </div>
</template>