<template>
  <div class="ArrayHasAny">
    <UiInput
      v-if="availableValues.length"
      v-model="selectValue"
      type="select"
      :multiple="true"
      :options="availableValues"
    />
    <UiInput
      v-else
      type="json"
      :value="value"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
import { UiInput } from '/packages/ui/components'

export default {
  name: 'ArrayHasAny',
  components: { UiInput },

  props: {
    // El atributo ARGS del statement  {"op": "hasAny", "field": "...", "args": XXXXXXXXXXX}
    value: {
      required: false,
      default: null,
    },

    fieldSchema: {
      required: false,
      default: null,
    },
  },

  computed: {
    availableValues() {
      return this.fieldSchema?.items?.enum || []
    },

    selectValue: {
      get() {
        return Array.isArray(this.value) ? this.value : []
      },

      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>