<script setup>
import { normalize } from '/packages/ui/helpers'
import { UiIcon } from '/packages/ui/components'
import { ref, watch, computed } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: false,
    default: () => [],
  },

  multiple: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const emit = defineEmits(['update:options'])

const innerOptions = ref([])
watch(
  () => props.options,
  (newValue) => {
    innerOptions.value = Array.isArray(newValue) ? newValue : []
  },
  { immediate: true, deep: true },
)

const strOptions = computed({
  get() {
    return innerOptions.value
      .map((option) => option.text)
      .join('\n')
  },

  set(newValue) {
    let lines = newValue.replace('\n\n', '\n').split('\n')
    if (!lines.length) {
      return []
    }

    innerOptions.value = lines
      // .filter((line) => !!line.trim())
      .map((line) => ({
        text: line,
        value: normalize(line),
      }))

    emit('update:options', innerOptions.value)
  },
})
</script>

<template>
  <div class="SelectOptionsEditor">
    <div class="SelectOptionsEditor__bullets">
      <UiIcon
        v-for="n in innerOptions.length || 1"
        :key="n"
        :src="props.multiple ? 'mdi:checkbox-blank-outline' : 'mdi:radiobox-blank'"
        class="SelectOptionsEditor__bullet"
      />
    </div>
    <textarea
      v-model="strOptions"
      class="SelectOptionsEditor__textarea"
      placeholder="Escribe opciones aquí"
    />
  </div>
</template>

<style lang="scss">
.SelectOptionsEditor {
  --option-line-height: 38px;
  display: flex;
  align-items: stretch;

  &__bullets {
    margin: 0 8px;
  }

  &__bullet {
    display: flex;
    height: var(--option-line-height);
  }

  &__textarea {
    flex: 1;

    background: transparent;
    outline: none;
    border: none;
    display: block;
    resize: none;

    font-family: var(--ui-font-secondary);
    font-size: 1em;
    line-height: var(--option-line-height);
  }
}
</style>