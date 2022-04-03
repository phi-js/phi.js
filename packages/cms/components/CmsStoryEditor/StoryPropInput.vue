<script setup>
import { computed, ref, watchEffect } from 'vue'
import { UiInput, UiDrawer, UiIcon } from '../../../ui'
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
    translations[langCode] = dictionary.value[langCode]?.[text] || text
  })

  langValue.value = {
    text,
    translations,
  }
})

function langify() {
  emit('update:modelValue', `lang(${props.modelValue})`)
}

function delangify() {
  const text = props.modelValue.match(/lang\(([^"]+?)\)/)?.[1]
  if (!text) {
    return
  }

  emit('update:modelValue', text)
}
</script>

<template>
  <div class="StoryPropInput">
    <UiDrawer v-if="langValue">
      <template #trigger>
        <UiInput v-bind="$attrs">
          <div class="StoryPropInput__row">
            <!-- <UiIcon src="mdi:translate" /> -->
            <input
              type="text"
              class="UiInput"
              :value="langValue.translations[i18n.locale]"
              disabled="disabled"
            >
            <UiIcon
              class="ui--clickable"
              src="mdi:translate-off"
              title="De-langify"
              @click="delangify()"
            />
          </div>
        </UiInput>
      </template>
      <template #contents>
        <div style="padding: 12px 0 50px 12px">
          <UiInput
            v-for="(word, langCode) in langValue.translations"
            :key="langCode"
            v-model="langValue.translations[langCode]"
            :label="langCode"
            @update:model-value="onUpdateDictionary"
          />
        </div>
      </template>
    </UiDrawer>
    <div v-else>
      <UiInput
        class="StoryPropInput__input"
        v-bind="$attrs"
      >
        <div class="StoryPropInput__row">
          <input
            type="text"
            class="UiInput"
            :value="props.modelValue"
            @input="emit('update:modelValue', $event.target.value)"
          >
          <UiIcon
            class="ui--clickable"
            src="mdi:translate"
            title="Internationalize"
            @click="langify()"
          />
        </div>
      </UiInput>
    </div>
  </div>
</template>

<style lang="scss">
.StoryPropInput {
  &__row {
    display: flex;
    flex-wrap: nowrap;

    & > .UiInput {
      flex: 1;
    }

    .UiIcon {
      width: 32px;
    }
  }
}
</style>