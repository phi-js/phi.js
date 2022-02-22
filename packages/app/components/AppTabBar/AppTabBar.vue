<script setup>
import { ref } from 'vue'
import { appTree, closeTab } from '../../composables'
import { UiItem, UiIcon, UiOverflow, UiInput } from '@/packages/ui/components'

const endangeredTabId = ref(null)
const counter = ref({
  hidden: 0,
  visible: 0,
})

function selectHiddenTabId(tabId) {
  arrayMove(appTree.tabs, counter.value.visible - 1, counter.value.visible) // push the last visible index into the first hidden position

  const fromIndex = appTree.tabs.findIndex(t => t.id === tabId) // Move the target tab to the last visible position
  const tab = appTree.tabs[fromIndex]
  arrayMove(appTree.tabs, fromIndex, counter.value.visible - 1)

  window.location = tab.href || tab.menu?.[0].href || '#'
}

function arrayMove(arr, fromIndex, toIndex) {
  const element = arr[fromIndex]
  arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
}
</script>

<template>
  <div class="AppTabBar">
    <div class="AppTabBar__logo"></div>
    <UiOverflow v-model:hiddenCount="counter.hidden" v-model:visibleCount="counter.visible">
      <TransitionGroup class="AppTabBar__tabs" name="tab-list" tag="div">
        <a
          v-for="(tab, i) in appTree.tabs"
          :key="tab.id"
          :href="tab.href || tab.menu?.[0].href || '#'"
        >
          <UiItem
            class="AppTabBar__tab ui--clickable ui--noselect"
            :class="{
              'AppTabBar__tab--active': tab.isActive,
              'AppTabBar__tab--endangered': endangeredTabId === tab.id,
              'AppTabBar__tab--occluded': i == counter.visible
            }"
            :text="tab.text"
            :subtext="tab.subtext"
            :icon="tab.icon"
          >
            <template #actions v-if="tab.isClosable">
              <UiIcon
                src="mdi:close"
                class="AppTabBar__close"
                @click="closeTab(tab)"
                @mouseenter="endangeredTabId = tab.id"
                @mouseleave="endangeredTabId = null"
              />
            </template>
          </UiItem>
        </a>
      </TransitionGroup>
    </UiOverflow>
    <div class="AppTabBar__picker" v-show="counter.hidden > 0">
      <UiInput
        type="select"
        placeholder="&bull;&bull;&bull;"
        :options="appTree.tabs.slice(counter.visible).map(tab => ({
          value: tab.id,
          text: tab.text
        }))"
        @update:modelValue="selectHiddenTabId($event)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.AppTabBar {
  // background-color: #fafafa;
  background-color: #fff;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  &__logo {
    margin: 0 40px;
    width: 75px;
    height: 23px;

    background-image: url(../../assets/label.png);
    background-color: var(--ui-color-primary);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  .UiOverflow {
    flex: 1;
  }

  &__tabs {
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    & > a {
      display: block;
      max-width: 300px;
      transition: all var(--ui-duration-snap) ease-out;
    }
  }

  &__picker {
    white-space: nowrap;

    font-weight: 600;
    font-size: 0.85em;
    font-family: var(--ui-font-secondary);
    color: rgba(0, 0, 0, 0.5);
  }

  &__tab {
    font-weight: 600;
    font-size: 0.85em;
    font-family: var(--ui-font-secondary);
    color: rgba(0, 0, 0, 0.5);

    border-radius: var(--ui-radius);
    margin: 6px;
    padding: 4px 12px;
    padding-right: 18px;
    white-space: nowrap;

    transition: all var(--ui-duration-snap) ease;

    &--active {
      color: #fff;
      background-color: var(--ui-color-primary) !important;
    }

    &--occluded {
      opacity: 0;
      pointer-events: none;
    }

    &--endangered {
      color: #fff;
      background-color: var(--ui-color-danger) !important;
    }

    .UiItem__actions {
      position: absolute;
      top: 0;
      right: 0;
      opacity: 0;
      transition: all var(--ui-duration-snap) ease;
    }

    &:hover {
      .UiItem__actions {
        opacity: 1;
      }
    }
  }

  &__close {
    cursor: pointer;
    padding: 0px 3px;
  }

  // Transition for appearing/disappearing tabs
  .tab-list-enter-from,
  .tab-list-leave-to {
    max-width: 0;

    .AppTabBar__tab {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>