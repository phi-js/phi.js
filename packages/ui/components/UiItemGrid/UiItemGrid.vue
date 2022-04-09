<script setup>
import { UiItem } from '../UiItem'

const props = defineProps({
  items: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['click-item'])
</script>

<template>
  <div class="UiItemGrid">
    <UiItem
      v-for="(item, i) in props.items"
      :key="i"
      tabindex="1"
      v-bind="item"
      class="UiItemGrid__item"
      :title="item.text"
      @click="emit('click-item', props.items[i])"
    />
  </div>
</template>

<style lang="scss">
.UiItemGrid {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;

  &__item {
    display: block;

    width: 110px;
    margin: 6px;
    padding: 8px;
    text-align: center;

    .UiItem {
      &__icon {
        width: 48px;
        height: 48px;
      }

      &__text {
        font-size: 12px;
      }
    }
  }
}
</style>