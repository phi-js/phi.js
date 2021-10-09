<script setup>
defineProps({
  block: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:block'])
</script>

<template>
  <div class="UiInputEditor">
    <template v-if="block.component === 'InputButton'">
      <input
        class="ui-button"
        :value="block.props.label"
        type="text"
        placeholder="Título"
        @input="emit('update:block', { ...block, props: {...block.props, label: $event.target.value} })"
        @focus="$event.target.select()"
      >
    </template>
    <template v-else>
      <div class="UiInputEditor__label">
        <input
          :value="block.props.label"
          type="text"
          placeholder="Título"
          @input="emit('update:block', { ...block, props: {...block.props, label: $event.target.value} })"
          @focus="$event.target.select()"
        >
      </div>

      <div class="UiInputEditor__body">
        <input
          class="ui-input__elem ui-native"
          type="text"
          :value="block.props.placeholder"
          @input="emit('update:block', { ...block, props: {...block.props, placeholder: $event.target.value} })"
          @focus="$event.target.select()"
        >
      </div>

      <div class="UiInputEditor__subtext">
        <input
          :value="block.props.subtext"
          type="text"
          placeholder="Subtext"
          @input="emit('update:block', { ...block, props: {...block.props, subtext: $event.target.value} })"
          @focus="$event.target.select()"
        >
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.UiInputEditor {
  input.ui-button {
    display: inline-block;
    font-family: var(--ui-font-secondary);
    font-size: 15px;
    font-weight: 500;
  }

  &__label,
  &__subtext {
    input {
      display: block;
      width: 100%;
      border: 0;
      background: transparent;
    }

    &:hover {
      background-color: #ff8;
    }
  }

  &__label {
    input {
      font-family: var(--ui-font-secondary);
    }
  }

  &__subtext {
    input {
      font-size: 1em;
    }
  }

  &__body {
    input {
      color: rgba(0, 0, 0, 0.36);
    }
  }
}
</style>