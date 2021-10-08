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

  computed: {
    drawerGroupName() {
      return null
      // return `ui-menu-${this.depth}`
    },
  },
}
</script>

<template>
  <div
    class="ui-tree__item"
    :class="{ 'ui-tree__item--active': value.isActive }"
  >
    <UiDrawer
      v-if="value?.children?.length"
      :drawer-group="drawerGroupName"
      :open="value.isActive"
    >
      <template #trigger="{ isOpen }">
        <UiItem
          class="ui-clickable"
          v-bind="value"
          :children="undefined"
        >
          <template
            #actions
          >
            <UiIcon
              :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'"
            />
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
      v-bind="value"
      @click="$emit('click-item', value)"
    />
  </div>
</template>
