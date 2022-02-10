<script setup>
import { ref, watch } from "vue";
import { LocationPickerCountry } from "../LocationPickerCountry"
import { LocationPickerCity } from "../LocationPickerCity"
import { LocationPickerState } from "../LocationPickerState"
import useLocation from "../../services/location"
const { toText } = useLocation()

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

// Init clone data
const location = ref({});
watch(
  () => props.modelValue,
  (value) => location.value = JSON.parse(JSON.stringify(value)),
  { immediate: true }
)

async function emitInput() {
  let output = JSON.parse(JSON.stringify(location.value));
  output.text = await toText(output);
  emit('update:modelValue', output)
}

// Watch country
watch(
  () => location.value.country,
  () => {
    location.value.province = null
    location.value.city = null
    emitInput();
  }
)

// Watch province
watch(
  () => location.value.province,
  () => {
    location.value.city = null
    emitInput();
  }
)

// Watch city
watch(
  () => location.value.city,
  () => emitInput()
)
</script>

<template>
  <div class="LocationPicker">
    <LocationPickerCountry v-model="location.country" :lang="location.lang" />

    <LocationPickerState
      v-if="location.country"
      v-model="location.province"
      :country="location.country"
    />

    <LocationPickerCity
      v-if="location.country && location.province"
      v-model="location.city"
      :state="location.province"
    />
  </div>
</template>