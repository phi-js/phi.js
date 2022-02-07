<script setup>
import { ref, watch } from "vue";
import { UiInput } from "/packages/ui/components";
import useLocation from "../../services/location"
const { getStates } = useLocation()

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },

  country: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// States for country
const states = ref([]);
watch(
  () => props.country,
  async (country) => states.value = await getStates(country),
  { immediate: true }
)
</script>

<template>
  <div class="LocationPickerState">
    <UiInput
      type="select"
      label="Departamento"
      placeholder="Seleccionar un departamento"
      :options="states"
      optionText="name"
      optionValue="iso2"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
    />
  </div>
</template>