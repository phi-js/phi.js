<script setup>
import { UiTree, UiItem, UiIcon } from '@/packages/ui/components'

const props = defineProps({
  activeTab: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="AppPage">
    <div class="AppPage__cover"></div>
    <div class="AppPage__chungus">
      <div class="AppPage__menu">
        <UiTree v-if="activeTab?.menu?.length" :value="activeTab.menu">
          <template #default="{ item, children, isOpen, toggle }">
            <!-- <UiItem
              v-bind="(({ children, ...o }) => o)(item)"
              class="TreeItem ui--clickable ui--noselect"
              @click="toggle"
            >
              <template v-if="children?.length" #actions>
                <UiIcon :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" />
              </template>
            </UiItem>-->

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

      <div class="AppPage__content">
        <pre>props.activeTab: {{ props.activeTab }}</pre>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.AppPage {
  min-height: 50vh; // dammit
  position: relative;

  &__cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 175px;

    background-color: var(--ui-color-primary);
    background-image: url(./covers/curves.png);
    background-position: 0px 100%;
  }

  &__chungus {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
  }

  &__menu {
    margin: 20px;
    margin-top: 145px;
    width: 200px;
  }

  &__content {
    flex: 1;
    margin: 20px;
    border-radius: var(--ui-radius);
    padding: var(--ui-padding);
    background: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  }
}

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
</style>