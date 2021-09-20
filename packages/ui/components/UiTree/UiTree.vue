<script>
import UiTreeItem from './UiTreeItem.vue'
export default {
  name: 'UiTree',
  components: { UiTreeItem },
  props: {
    value: {
      type: Array,
      required: false,
      default: () => []
    },

    depth: {
      type: Number,
      required: false,
      default: 0
    }
  },
  emits: ['click-item']
}
</script>

<template>
  <div class="ui-tree" :class="{ 'ui-tree--submenu': depth > 0 }">
    <UiTreeItem
      v-for="(item, i) in value"
      :key="i"
      :value="item"
      :depth="depth"
      @click-item="$emit('click-item', $event)"
    >
      <template v-if="$slots.item" #item="itemSlotProps">
        <slot name="item" v-bind="itemSlotProps"></slot>
      </template>
    </UiTreeItem>
  </div>
</template>

<style lang="scss">
.ui-tree {
  &--submenu {
    border-left: 1px solid rgba(0, 0, 0, 0.04);
    margin-left: var(--ui-breathe);
    padding-left: var(--ui-breathe);
    margin-bottom: var(--ui-breathe);
  }
}
</style>
