<script setup>
import { ref } from 'vue'

import { UiTree } from './index.js'
import { UiItem, UiIcon } from '../'
import sample from './sample.js'

const tree = ref(sample)
const activeItem = ref()

function clickItem(item, toggleFx) {
  if (item?.children?.length) {
    return toggleFx()
  }

  item.isActive = !item.isActive

  if (activeItem.value && activeItem.value !== item) {
    activeItem.value.isActive = false
  } else if (!item.isActive && activeItem.value === item) {
    activeItem.value = null
  }

  if (item.isActive) {
    activeItem.value = item
  }

}

</script>

<template>
  <h1>UiTree</h1>
  <label>Selected: {{ activeItem?.text || 'N.A.' }}</label>

  <UiTree
    class="myTree"
    :value="tree"
  >
    <template #default="{item, children, isOpen, toggle}">
      <UiItem
        v-bind="(({ children, ...o }) => o)(item)"
        class="myTreeItem ui--clickable ui--noselect"
        :class="{'myTreeItem--open': isOpen, 'myTreeItem--active': item.isActive}"
        :style="{'--item-color': item.color}"
        @click="clickItem(item, toggle)"
      >
        <template
          v-if="children?.length"
          #actions
        >
          <UiIcon :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" />
        </template>
      </UiItem>
    </template>
  </UiTree>
</template>

<style lang="scss">
.myTree {
  max-width: 400px;

  .UiTree {
    &__children {
      transition: margin-left var(--ui-duration-snap);
      margin-left: 0;

      &--open {
        margin-left: 12px;
      }
    }

    // &__face {
    // }
  }
}

.myTreeItem {
  border-radius: var(--ui-radius);
  transition: all var(--ui-duration-snap);

  &--open {
    background-color: var(--item-color, #999) !important;
    color: #fff;
  }

  &--active {
    color: red;
    font-weight: bold;
  }
}
</style>