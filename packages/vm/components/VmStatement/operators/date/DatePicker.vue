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
        @update:model-value="$emit('update:modelValue', rangeValue)"
      />
      <UiInput
        v-model="rangeValue[1]"
        type="date"
        :format="fieldFormat"
        @update:model-value="$emit('update:modelValue', rangeValue)"
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
    modelValue: {
      type: Object,
      required: false,
      default: null,
    },

    fieldSchema: {
      type: Object,
      required: false,
      default: null,
    },

    range: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  emits: ['update:modelValue'],

  computed: {
    fieldFormat() {
      return this.fieldSchema?.format || 'timestamp'
    },

    rangeValue() {
      return this.modelValue?.length == 2 ? this.modelValue : [null, null]
    },

    singleValue: {
      get() {
        return this.modelValue || null
      },

      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
}
</script>