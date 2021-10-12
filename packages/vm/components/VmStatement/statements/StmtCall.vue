<template>
  <div class="StmtCall">
    <input
      v-model="innerModel.call"
      type="text"
      class="ui-native"
      @input="emitInput"
    >

    <VmStatement
      v-model="innerModel.args"
      @update:modelValue="emitInput"
    />
  </div>
</template>

<script>
import VmStatement from '../VmStatement.vue'
export default {
  name: 'StmtCall',
  components: { VmStatement },

  props: {
    modelValue: {
      required: false,
      default: null,
      validator: () => true,
    },
  },

  emits: ['update:modelValue'],

  data() {
    return { innerModel: null }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        let clone = newValue ? JSON.parse(JSON.stringify(newValue)) : newValue
        this.innerModel = Object.assign(
          {
            call: null,
            args: {},
          },
          clone,
        )
      },
    },
  },

  methods: {
    emitInput() {
      this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.innerModel)))
    },
  },
}
</script>