<script>
import { UiIcon } from '@/packages/ui'

export default {
  name: 'UiInputRating',
  components: { UiIcon },
  props: {
    modelValue: {
      type: [Number, String],
      required: false,
      default: 0,
    },
    max: {
      type: Number,
      required: false,
      default: 5,
    },
  },
  emits: ['update:modelValue'],
}
</script>

<template>
  <div class="UiInputRating">
    <UiIcon
      v-for="n in max"
      :key="n"
      color="var(--ui-color-primary)"
      class="UiInputRating__star"
      :src="n <= modelValue ? 'mdi:star' : 'mdi:star-outline'"
      tabindex="0"
      @click="$emit('update:modelValue', n == modelValue ? 0 : n)"
      @keyup.enter="$emit('update:modelValue', n == modelValue ? 0 : n)"
    />
  </div>
</template>

<style lang="scss">
.UiInputRating {
  &__star {
    cursor: pointer;
    font-size: 32px;
    margin: 0 0.2em;
    color: var(--ui-color-primary);
  }
}
</style>