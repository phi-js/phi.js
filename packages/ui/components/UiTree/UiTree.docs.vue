<script setup>
import { ref } from 'vue'

import { UiTree } from './index.js'
import { UiItem, UiIcon } from '../'
import sample from './sample.js'

const tree = ref(sample)
</script>

<template>
  <h1>UiTree</h1>

  <input
    v-model="tree[0].text"
    type="text"
  >

  <input
    v-model="tree[2].isOpen"
    type="checkbox"
  >

  <UiTree
    :value="tree"
    class="myTree"
  >
    <template #item="{item}">
      <UiItem
        v-bind="(({ children, ...o }) => o)(item)"
        class="myTreeItem ui--clickable"
        :class="{'myTreeItem--open': item.isOpen}"
        :style="{'--item-color': item.color}"
        @click="item.isOpen = !item.isOpen"
      >
        <template
          v-if="item.children?.length"
          #actions
        >
          <UiIcon :src="item.isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" />
        </template>
      </UiItem>
    </template>
  </UiTree>

  <pre>{{ tree }}</pre>
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