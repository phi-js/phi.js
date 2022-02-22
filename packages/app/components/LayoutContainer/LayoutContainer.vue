<script setup>
import AppTabBar from '../AppTabBar/AppTabBar.vue'
import { navData } from '../../composables'
</script>

<template>
  <div class="LayoutContainer">
    <!-- Menu superior con lista de tabs -->
    <AppTabBar class="LayoutContainer__tabBar" />

    <div class="LayoutContainer__contents">
      <router-view v-slot="{ Component }">
        <Transition :name="`tabSwap--${navData.tab.isForward ? 'forward' : 'backward'}`">
          <component :is="Component" :key="navData.tab.key" />
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<style lang="scss">
.LayoutContainer {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__contents {
    flex: 1;
    position: relative;
  }
}

// Tab transition
.LayoutContainer .tabSwap {
  &--forward,
  &--backward {
    &-enter-active,
    &-leave-active {
      transition: all var(--ui-duration-quick);
      overflow: hidden;

      .TabContainer {
        &__body {
          transition: all var(--ui-duration-quick);
        }

        &__menu {
          transition: all var(--ui-duration-quick);
        }
      }
    }

    &-leave-active {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
    }

    &-enter-active {
      position: relative;
      z-index: 1;
    }

    &-leave-to {
      .TabContainer {
        &__body,
        &__menu,
        &__cover {
          opacity: 0;
        }
      }
    }
  }

  &--forward {
    &-enter-from {
      .TabContainer {
        &__body {
          transform: translateX(61px);
        }

        &__menu {
          transform: translateX(100%);
        }
      }
    }

    &-leave-to {
      .TabContainer {
        &__body {
          transform: translateX(-61px);
        }

        &__menu {
          transform: translateX(-100%);
        }
      }
    }
  }

  &--backward {
    &-enter-from {
      .TabContainer {
        &__body {
          transform: translateX(-61px);
        }

        &__menu {
          transform: translateX(-100%);
        }
      }
    }

    &-leave-to {
      .TabContainer {
        &__body {
          transform: translateX(61px);
        }

        &__menu {
          transform: translateX(100%);
        }
      }
    }
  }
}
</style>