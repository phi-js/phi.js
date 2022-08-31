<script setup>
/*
el valor de propValue se interpreta internamente asi:

propValue = "Hola"
type -> 'constant'

propValue = 123
type -> 'constant'

propValue = "{{algo}}"
type -> 'expression'

propValue = "{{algo ? 'si' : 'no'}}"
type -> 'expression'

*** not yet implemented
propValue = "lang(algunaCosa)"
type -> 'lang'

propValue = {
  "$i18n": {
    "en": "Some thing",
    "es": "Alguna cosa"
  }
}
type -> 'dictionary'

<CmsPropInput v-model="propValue" :block="block" />
*/
import { watch, computed, ref } from 'vue'
import { useI18n } from '@/packages/i18n'

import * as TypeEditors from './types/index.js'

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

const type = ref('')
watch(
  () => props.modelValue,
  (newValue) => type.value = findType(newValue),
  { immediate: true },
)

const editorComponent = computed(() => {
  return TypeEditors[type.value]
})

function findType(incomingValue) {
  // {"$i18n": { ... dictionary }}
  if (typeof incomingValue?.$i18n === 'object') {
    return 'dictionary'
  }

  if (!incomingValue || typeof incomingValue !== 'string') {
    return 'constant'
  }

  // Expression "{{a ? 'foo' : 'bar'}}"
  if (/{{([^}]*?)}}/.test(incomingValue)) {
    return 'expression'
  }

  // Lang strings "lang(comeLangKey)"
  if (/lang\(([^"]*?)\)/.test(incomingValue)) {
    return 'lang'
  }

  return 'constant'
}

const i18n = useI18n({
  en: {
    'CmsPropInput.constant': 'Constant',
    'CmsPropInput.dictionary': 'Translation',
    // 'CmsPropInput.lang': 'Lang string',
    'CmsPropInput.expression': 'Variable',
  },
  es: {
    'CmsPropInput.constant': 'Constante',
    'CmsPropInput.dictionary': 'Traducción',
    // 'CmsPropInput.lang': 'Lang string',
    'CmsPropInput.expression': 'Variable',
  },
})
</script>

<template>
  <div
    class="CmsPropInput"
    :class="`CmsPropInput--${type}`"
  >
    <label
      class="CmsPropInput__label UiInput__label"
      for=""
      v-text="$attrs.label"
    />

    <select
      v-model="type"
      class="CmsPropInput__typeSelect"
    >
      <option
        value="constant"
        v-text="i18n.t('CmsPropInput.constant')"
      />
      <option
        value="dictionary"
        v-text="i18n.t('CmsPropInput.dictionary')"
      />
      <option
        value="expression"
        v-text="i18n.t('CmsPropInput.expression')"
      />
      <!-- <option
        value="lang"
        v-text="i18n.t('CmsPropInput.lang')"
      /> -->
    </select>

    <Component
      :is="editorComponent"
      v-if="editorComponent"
      class="CmsPropInput__component"
      :model-value="props.modelValue"
      :block="props.block"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<style lang="scss">
.CmsPropInput {
  display: flex;
  flex-wrap: wrap;

  &__typeSelect {
    border: 0;
    background: transparent;
    color: inherit;
    font-size: 12px;
    font-weight: 600;

    margin-left: auto;

    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }

  &__component {
    min-width: 100%;

    input {
      width: 100%;
    }
  }
}
</style>