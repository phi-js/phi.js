<script setup>
import { activeTab } from '../../composables'
import { UiTree, UiItem, UiIcon } from '@/packages/ui/components'
</script>

<template>
  <div class="TabContainer">
    <div class="TabContainer__menu">
      <UiTree v-if="activeTab?.menu?.length" :value="activeTab.menu">
        <template #default="{ item, children, isOpen, toggle }">
          <UiItem
            v-if="children?.length"
            class="TreeItem ui--clickable ui--noselect"
            :icon="item.icon"
            :text="item.text"
            :subtext="item.subtext"
            @click="toggle"
          >
            <template #actions>
              <UiIcon :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" />
            </template>
          </UiItem>
          <a v-else :href="item.href || '#'">
            <UiItem
              class="TreeItem ui--clickable ui--noselect"
              :icon="item.icon"
              :text="item.text"
              :subtext="item.subtext"
              @click="toggle"
            />
          </a>
        </template>
      </UiTree>
    </div>

    <div class="TabContainer__body">
      <router-view v-slot="{ Component, route }">
        <Transition name="pageSwap">
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<style lang="scss">
.TabContainer {
  display: flex;
  flex-wrap: nowrap;

  &__menu {
    margin: 20px;
    margin-top: 145px;
    width: 200px;

    .TreeItem {
      font-weight: 600;
      font-size: 0.9em;
      font-family: var(--ui-font-secondary);
      white-space: nowrap;
      color: rgba(0, 0, 0, 0.6);
      border-radius: var(--ui-radius);
    }

    .UiTree {
      &__children {
        margin-left: 18px;
        padding-left: 6px;
        border-left: 1px solid #ddd;
      }
    }
  }

  &__body {
    flex: 1;
    position: relative;
  }
}

// Page transition
.TabContainer {
  .pageSwap-enter-active,
  .pageSwap-leave-active {
    transition: opacity 0.5s ease;
  }

  .pageSwap-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  .pageSwap-enter-from,
  .pageSwap-leave-to {
    opacity: 0;
  }
}
</style>