<script setup>
import { activeTab, navData } from '../../composables'
import { UiTree, UiItem, UiIcon } from '@/packages/ui/components'
</script>

<template>
  <div class="TabContainer">
    <div class="TabContainer__cover"></div>

    <div class="TabContainer__menu">
      <UiTree v-if="activeTab?.menu?.length" :value="activeTab.menu">
        <template #default="{ item, children, isOpen, toggle }">
          <UiItem
            v-if="children?.length"
            class="TreeItem ui--clickable ui--noselect"
            :class="{ 'TreeItem--active': item.isActive }"
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
              :class="{ 'TreeItem--active': item.isActive }"
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
        <Transition :name="navData.page.shouldAnimate ? 'pageSwap' : null">
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
  position: relative;

  &__cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 175px;

    background-color: var(--ui-color-primary);
    background-image: url(../../assets/covers/curves.png);
    background-position: 0px 100%;
  }

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
      padding: 2px 11px;
      margin: 6px 0 0 0; // margin-bottom jerks the bottom drawer

      &--active {
        color: var(--ui-color-primary);
      }
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
    margin: 24px;
    margin-top: 40px;
  }
}

// Page transition
.TabContainer {
  .pageSwap-enter-active,
  .pageSwap-leave-active {
    transition: all var(--ui-duration-snap);
  }

  .pageSwap-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }

  .pageSwap-enter-active {
    position: relative;
    z-index: 2;
  }

  // .pageSwap-enter-from,
  .pageSwap-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  .pageSwap-enter-from {
    transform: translateY(10px);
  }
}
</style>