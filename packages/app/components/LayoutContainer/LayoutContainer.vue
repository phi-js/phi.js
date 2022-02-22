<script setup>
import AppTabBar from '../AppTabBar/AppTabBar.vue'
import { activeTab } from '../../composables'
</script>

<template>
  <div class="LayoutContainer">
    <!-- Menu superior con lista de tabs -->
    <AppTabBar class="LayoutContainer__tabBar" />

    <div class="LayoutContainer__contents">
      <router-view v-slot="{ Component, route }">
        <Transition name="tabSwap">
          <KeepAlive>
            <component :is="Component" :key="activeTab?.id" />
          </KeepAlive>
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
.LayoutContainer {
  .tabSwap-enter-active,
  .tabSwap-leave-active {
    transition: all 0.5s ease;
  }

  // .tabSwap-enter-active,
  .tabSwap-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  .tabSwap-enter-from,
  .tabSwap-leave-to {
    opacity: 0;
  }

  .tabSwap-enter-from {
    transform: translateX(30px);
  }

  .tabSwap-leave-to {
    transform: translateX(-30px);
  }
}
</style>