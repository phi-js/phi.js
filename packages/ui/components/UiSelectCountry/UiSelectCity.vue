<script setup>
import { ref, watch, watchEffect, reactive, computed } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'

// defaults[country] = [provinceCode, cityCode]
const defaults = {
  CO: ['11', '11001'],
  ES: ['28', '079'],
  CU: ['09', '9011'],
}

const i18n = useI18n({
  en: {
    'UiSelectCity.Country': 'Country',
    'UiSelectCity.Province': 'Province',
    'UiSelectCity.City': 'City',
  },
  es: {
    'UiSelectCity.Country': 'País',
    'UiSelectCity.Province': 'Provincia',
    'UiSelectCity.City': 'Ciudad',
  },
  de: {
    'UiSelectCity.Country': 'Land',
    'UiSelectCity.Province': 'Provinz',
    'UiSelectCity.City': 'Stadt',
  },
})

const props = defineProps({
  /*
  Country ISO code
  */
  country: {
    type: String,
    required: false,
    default: null,
  },

  province: {
    type: [String, Number],
    required: false,
    default: null,
  },

  city: {
    type: [String, Number],
    required: false,
    default: null,
  },

  text: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:country', 'update:province', 'update:city', 'update:text'])

const innerValue = reactive({
  country: '',
  province: '',
  city: '',
  text: '',
})


watch(
  () => [props.country, props.province, props.city, props.text],
  () => {
    innerValue.country = props.country || ''
    innerValue.province = props.province || ''
    innerValue.city = props.city || ''
    innerValue.text = props.text || ''
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:country', innerValue.country)
  emit('update:province', innerValue.province)
  emit('update:city', innerValue.city)
  emit('update:text', innerValue.text)
}

function nameSort(a, b) {
  const nameA = a?.name ? a.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : ''
  const nameB = b?.name ? b.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : ''
  return (nameA > nameB) ? 1 : (nameA < nameB ? -1 : 0)
}

const availableProvinces = ref([])
watchEffect(async () => {
  if (!innerValue.country) {
    return
  }

  try {
    const countryCode = innerValue.country.toLowerCase()
    const imported = await import(`./cities/${countryCode}.json`)
    availableProvinces.value = Object.values(imported.default)
    availableProvinces.value.sort(nameSort)
  } catch (err) {
    availableProvinces.value = []
  }
})

const availableCities = computed(() => {
  if (!innerValue.province) {
    return []
  }

  const foundProvince = availableProvinces.value.find((p) => p.code == innerValue.province)
  if (!foundProvince?.cities) {
    return []
  }

  const retval = Object.values(foundProvince.cities)
  retval.sort(nameSort)
  return retval
})

// preselect defaults when values change
watch(
  () => innerValue.country,
  () => {
    if (defaults?.[innerValue.country]) {
      innerValue.province = defaults[innerValue.country][0]
      innerValue.city = defaults[innerValue.country][1]
    } else {
      innerValue.province = isNaN(innerValue.province) ? innerValue.province : ''
      innerValue.city = isNaN(innerValue.city) ? innerValue.city : ''
    }
  },
)

// select first city when province changes
watch(
  () => innerValue.province,
  () => {
    innerValue.city = availableCities.value?.[0]?.code || innerValue.city
  },
)

watchEffect(() => {
  let provinceText = innerValue.province
  const foundProvince = availableProvinces.value.find((p) => p.code == innerValue.province)
  if (foundProvince) {
    provinceText = foundProvince.name
  }

  let cityText = innerValue.city
  if (foundProvince?.cities) {
    const foundCity = Object.values(foundProvince.cities).find((c) => c.code == innerValue.city)
    if (foundCity) {
      cityText = foundCity.name
    }
  }

  const parts = []
  cityText && parts.push(cityText)
  provinceText && parts.push(provinceText)
  innerValue.country && parts.push(innerValue.country)

  innerValue.text = parts.join(', ')
})

watch(
  () => innerValue.text,
  () => emitUpdate(),
)
</script>

<template>
  <div class="UiSelectCity">
    <UiInput
      v-model="innerValue.country"
      type="country"
      :placeholder="i18n.t('UiSelectCity.Country')"
      @update:model-value="emitUpdate()"
    />
    <UiInput
      v-if="availableProvinces.length"
      v-model="innerValue.province"
      type="select-native"
      :options="availableProvinces"
      option-value="$.code"
      option-text="$.name"
      @update:model-value="emitUpdate()"
    />
    <UiInput
      v-else
      v-model="innerValue.province"
      :placeholder="i18n.t('UiSelectCity.Province')"
      type="text"
      @update:model-value="emitUpdate()"
    />
    <UiInput
      v-if="availableCities.length"
      v-model="innerValue.city"
      type="select-native"
      :options="availableCities"
      option-value="$.code"
      option-text="$.name"
      @update:model-value="emitUpdate()"
    />
    <UiInput
      v-else
      v-model="innerValue.city"
      :placeholder="i18n.t('UiSelectCity.City')"
      type="text"
      @update:model-value="emitUpdate()"
    />
  </div>
</template>