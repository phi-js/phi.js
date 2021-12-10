<script setup>
const tree = [
  {
    text: 'Un elemento',
    subtext: 'Un subtexto',
    color: 'red',
    children: [
      {
        text: 'Hijo 1',
        children: [{ text: 'Hijo 1' }, { text: 'Hijo 2' }, { text: 'Hijo 3' }],
      },
      {
        text: 'Hijo 2',
        children: [
          { text: 'Hijo 1' },
          {
            text: 'Hijo 2',
            children: [
              { text: 'Hijo 1' },
              { text: 'Hijo 2' },
              { text: 'Hijo 3' },
            ],
          },
          { text: 'Hijo 3' },
        ],
      },
      {
        text: 'Hijo 3',
        children: [{ text: 'Hijo 1' }, { text: 'Hijo 2' }, { text: 'Hijo 3' }],
      },
    ],
  },
  {
    text: 'Otro elemento',
    subtext: 'Otro subtexto (sin hijos)',
    color: 'blue',
  },
  {
    text: 'Otro elemento',
    subtext: 'Otro subtexto',
    color: 'purple',
    children: [
      { text: 'Hijo 1' },
      {
        text: 'Hijo 2',
        children: [
          { text: 'Hijo 1' },
          { text: 'Hijo 2' },
          {
            text: 'Hijo 3',
            children: [
              { text: 'Hijo 1' },
              { text: 'Hijo 2' },
              { text: 'Hijo 3' },
            ],
          },
        ],
      },
      { text: 'Hijo 3' },
    ],
  },
]

import { UiTree } from './index.js'

import { UiItem, UiIcon } from '../'
</script>

<template>
  <h1>UiTree</h1>
  <UiTree
    v-slot="{item, children, isOpen, toggle}"
    class="myTree"
    :value="tree"
  >
    <UiItem
      v-bind="item"
      class="myTreeItem ui--clickable"
      :class="{'myTreeItem--open': isOpen}"
      :style="{'--item-color': item.color}"
      @click="toggle"
    >
      <template
        v-if="children?.length"
        #actions
      >
        <UiIcon :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" />
      </template>
    </UiItem>
  </UiTree>
</template>

<style lang="scss">
.myTree {
  max-width: 400px;

  .UiTree {
    // &__face {
    // }

    &__children {
      margin-left: 12px;
    }
  }
}

.myTreeItem {
  border-radius: var(--ui-radius);
  transition: all var(--ui-duration-snap);

  &--open {
    background-color: var(--item-color, #999) !important;
    color: #fff;
  }
}
</style>