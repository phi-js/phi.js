<script setup>
import { ref, onMounted, computed } from "vue";
import { UiInput } from "/packages/ui/components";
import useLocation from "../../services/location"
const { getCountries } = useLocation()

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },

  lang: {
    type: String,
    default: 'es'
  }
})

const emit = defineEmits(['update:modelValue'])

const langItem = computed(() => {
  return "translations[" + props.lang + "]"
})

const countries = ref([]);
onMounted(async () => countries.value = await getCountries())
</script>

<template>
  <div class="LocationPickerCountry">
    <UiInput
      type="select"
      label="pais"
      placeholder="seleccionar un pais"
      :options="countries"
      :optionText="langItem"
      optionValue="iso2"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
    />
  </div>
</template>