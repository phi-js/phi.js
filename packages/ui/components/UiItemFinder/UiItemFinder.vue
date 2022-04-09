<script setup>
import { UiTabs, UiTab } from '../UiTabs'
import { ref, computed, watchEffect } from 'vue'
import { normalize } from '../../helpers'
import UiItemGrid from '../UiItemGrid/UiItemGrid.vue'

const props = defineProps({
  items: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['select-item'])

const sanitizedItems = computed(() => props.items.map((item, _index) => ({
  ...item,
  _index,
  searchable: normalize(`${item.text} ${item.keywords}`),
  tabs: item.tabs?.length ? item.tabs : [],
})))


const searchString = ref('')
const filteredItems = computed(() => {
  const words = normalize(searchString.value).split(' ')
  return sanitizedItems.value.filter((item) => words.every((word) => item.searchable.includes(word)))
})


const currentTab = ref(null)

const availableTabs = computed(() => {
  const allTabs = {}
  filteredItems.value.forEach((item) => item.tabs.forEach((tabName) => {
    const nName = normalize(tabName)
    if (!allTabs[nName]) {
      allTabs[nName] = {
        id: nName,
        value: nName,
        text: tabName,

        items: [],
      }
    }
    allTabs[nName].items.push(item)
  }))

  return Object.values(allTabs)
})

// make sure currentTab is always set
watchEffect(() => {
  if (currentTab.value === null) {
    currentTab.value = availableTabs.value?.[0]?.value
  }
})

const visibleItems = computed(() => {
  const activeTab = availableTabs.value.find((t) => t.value === currentTab.value)
  return activeTab?.items || []
})


function onClickItem(item) {
  const originalItem = props.items[item._index]
  emit('select-item', originalItem)
}
</script>

<template>
  <div class="UiItemFinder">
    <input
      v-model="searchString"
      type="search"
      placeholder="Buscar ..."
      class="UiItemFinder__search"
    >

    <UiTabs
      v-model="currentTab"
      class="UiItemFinder__tabs"
    >
      <UiTab
        v-for="tab in availableTabs"
        :key="tab.id"
        v-bind="tab"
        class="UiItemFinder__tab"
      />
    </UiTabs>

    <UiItemGrid
      class="UiItemFinder__grid"
      :items="visibleItems"
      @click-item="onClickItem"
    />
  </div>
</template>

<style lang="scss">
.UiItemFinder {
  position: relative;

  &__search {
    display: block;
    width: 100%;
    border: 0;
    margin: 0;
    padding: 8px 16px;
    background: transparent;
    color: inherit;
    outline: none;

    &:focus {
      background: rgba(255,255,255, 0.1);
    }
  }

  .UiItemGrid {
    &__item {
      cursor: pointer;
      user-select: none;
      border-radius: 5px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.08);
      }
    }
  }
}
</style>