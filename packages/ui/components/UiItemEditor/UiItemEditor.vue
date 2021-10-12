<template>
  <div class="UiItemEditor">
    <UiIconPicker
      v-model="innerModel.icon"
      @update:modelValue="emitInput()"
    />

    <div class="UiItemEditor__body">
      <UiInputSpan
        v-model="innerModel.text"
        @update:modelValue="emitInput()"
      >
        <h1 class="UiItemEditor__text">
          {{ innerModel.text || 'Agregar texto' }}
        </h1>
      </UiInputSpan>

      <UiInputSpan
        v-model="innerModel.subtext"
        @update:modelValue="emitInput()"
      >
        <h2 class="UiItemEditor__subtext">
          {{ innerModel.subtext || 'Agregar descripcion' }}
        </h2>
      </UiInputSpan>
    </div>
  </div>
</template>

<script>
import UiIconPicker from '../UiIconPicker/UiIconPicker.vue'
import UiInputSpan from '../UiInputSpan/UiInputSpan.vue'

export default {
  name: 'UiItemEditor',
  components: { UiInputSpan, UiIconPicker },

  props: {
    modelValue: {
      type: Object,
      required: false,
      default: null,
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
        this.innerModel = newValue
          ? JSON.parse(JSON.stringify(newValue))
          : newValue

        this.innerModel = Object.assign(
          {
            icon: null,
            text: '',
            subtext: '',
          },
          this.innerModel,
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

<style lang="scss">
.UiItemEditor {
  display: inline-flex;

  &__body {
    flex: 1;
  }

  &__text {
    margin: 0;
    font-family: var(--ui-font-secondary);
    font-size: 1em;
    font-weight: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__subtext {
    margin: 0;
    opacity: 0.8;
    font-size: 0.82em;
  }
}
</style>