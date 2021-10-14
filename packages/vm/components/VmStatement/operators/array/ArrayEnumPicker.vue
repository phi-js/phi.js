<template>
  <div class="ArrayEnumPicker">
    <UiInput
      v-if="availableValues.length"
      v-model="selectValue"
      type="select-list"
      multiple
      :options="availableValues"
    />
    <UiInput
      v-else
      type="json"
      :model-value="modelValue"
      @input="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script>
import { UiInput } from '/packages/ui/components'

export default {
  name: 'ArrayEnumPicker',
  components: { UiInput },

  props: {
    // El atributo ARGS del statement  {"op": "hasAny", "field": "...", "args": XXXXXXXXXXX}
    modelValue: {
      validator: () => true,
      required: false,
      default: null,
    },

    fieldSchema: {
      type: Object,
      required: false,
      default: null,
    },
  },

  emits: ['update:modelValue'],

  computed: {
    availableValues() {
      return this.fieldSchema?.items?.enum || []
    },

    selectValue: {
      get() {
        return Array.isArray(this.modelValue) ? this.modelValue : []
      },

      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
}
</script>