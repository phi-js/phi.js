<script setup>
import { ref, watch } from "vue";
import { UiInput } from "/packages/ui/components";
import useLocation from "../../services/location"
const { getCities } = useLocation()

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },

  state: {
    type: [String, Number],
    required: true
  },
})

// Cities for states
const cities = ref([]);
watch(
  () => props.state,
  async (state) => cities.value = await getCities(state),
  { immediate: true }
)
</script>

<template>
  <div class="LocationPickerCity">
    <UiInput
      type="select-native"
      label="Ciudad"
      placeholder="Seleccionar una ciudad"
      :options="cities"
      optionText="name"
      optionValue="iso2"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
    />
  </div>
</template>