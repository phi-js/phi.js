<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiSelect } from '@/packages/ui'

const i18n = useI18n()
const countryOptions = ref([])

watchEffect(async () => {
  let imported = null
  try {
    imported = await import(`./data/${i18n.baseLanguage.value}.json`)
  } catch (err) {
    imported = await import('./data/en.json')
  }

  countryOptions.value = Object.keys(imported.default)
    .map((countryCode) => {
      return {
        text: imported[countryCode],
        value: countryCode,
      }
    })
})

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = computed({
  get() {
    if (!props.modelValue) {
      return []
    }

    if (Array.isArray(props.modelValue)) {
      return props.modelValue.filter((v)=>!!v)
    }

    return props.modelValue.split('_')
  },
  set(newValue) {
    emit('update:modelValue', newValue.join('_'))
  },
})
</script>

<template>
  <UiSelect
    v-model="innerValue"
    class="UiSelectNationality"
    :options="countryOptions"
    multiple
  />
</template>