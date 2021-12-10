<script>
import { defineAsyncComponent } from 'vue'
const UiTree = defineAsyncComponent(() => import('./UiTree.vue'))

import { UiIcon } from '../UiIcon'
import { UiItem } from '../UiItem'
import { UiDrawer } from '../UiDrawer'

export default {
  name: 'UiTreeItem',
  components: {
    UiTree,
    UiIcon,
    UiItem,
    UiDrawer,
  },

  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    depth: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  emits: ['click-item'],

  data() {
    return { isOpen: this.isOpen }
  },

  computed: {
    drawerGroupName() {
      // return null
      return `ui-menu-${this.depth}`
    },

    itemBindings() {
      const copy = { ...this.value }
      delete copy.children
      return copy
    },
  },
}
</script>

<template>
  <div
    class="ui-tree__item"
    :class="{ 'ui-tree__item--active': isOpen }"
  >
    <UiDrawer
      v-if="value?.children?.length"
      v-model:open="isOpen"
      :drawer-group="drawerGroupName"
    >
      <template #trigger>
        <UiItem
          class="ui--clickable"
          v-bind="itemBindings"
        >
          <template #actions>
            <UiIcon :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" />
          </template>
        </UiItem>
      </template>
      <template #contents>
        <UiTree
          :depth="depth + 1"
          :value="value.children"
          @click-item="$emit('click-item', $event)"
        >
          <template
            v-if="$slots.item"
            #item="slotProps"
          >
            <slot
              name="item"
              v-bind="slotProps"
            />
          </template>
        </UiTree>
      </template>
    </UiDrawer>
    <template v-else-if="$slots.item">
      <slot
        name="item"
        :item="value"
      />
    </template>
    <UiItem
      v-else
      v-bind="itemBindings"
      @click="$emit('click-item', value)"
    />
  </div>
</template>
