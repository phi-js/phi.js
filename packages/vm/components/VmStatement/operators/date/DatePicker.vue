<template>
  <div class="DatePicker">
    <div
      v-if="range"
      class="UiGroup"
    >
      <UiInput
        v-model="rangeValue[0]"
        type="date"
        :format="fieldFormat"
        @input="$emit('input', rangeValue)"
      />
      <UiInput
        v-model="rangeValue[1]"
        type="date"
        :format="fieldFormat"
        @input="$emit('input', rangeValue)"
      />
    </div>
    <UiInput
      v-else
      v-model="singleValue"
      type="date"
      :format="fieldFormat"
    />
  </div>
</template>

<script>
import { UiInput } from '@/packages/ui/components'

export default {
  name: 'DatePicker',
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

    range: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  computed: {
    fieldFormat() {
      return this.fieldSchema?.format || 'timestamp'
    },

    rangeValue() {
      return this.value?.length == 2 ? this.value : [null, null]
    },

    singleValue: {
      get() {
        return this.value || null
      },

      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>