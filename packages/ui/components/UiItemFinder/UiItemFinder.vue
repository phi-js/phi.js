<script setup>
import { ref, computed, watch } from 'vue'
import FinderItem from './FinderItem.vue'

const props = defineProps({
  /*
  items = [
    {
      keywords: ... searchable words (other tan text and subtext)

      text: ...,
      subtext: ...,
      icon: ...,
      ... any additional data ...,

      children: [
        ... array of items
      ]
    }
  ]
  */
  items: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['select-item'])

const allItems = ref([])
watch(
  () => props.items,
  () => allItems.value = props.items.map(normalize),
  { immediate: true },
)

function normalize(objItem) {
  if (!objItem) {
    return null
  }

  const retval = { ...objItem }
  retval.searchKey = buildSearchKey(objItem)

  if (Array.isArray(objItem.children)) {
    retval.children = objItem.children
      .map(normalize)
      .filter((c) => !!c)

    retval.children.forEach((child) => retval.searchKey += child.searchKey)
  }

  return retval
}

function buildSearchKey(objItem) {
  return toKeywords(objItem.text || objItem.title)
    + toKeywords(objItem.subtext || objItem.description)
    + toKeywords(objItem.keywords)
}


// Search/Filter items
const searchString = ref('')

// filteredItems es el "source of truth"
const filteredItems = computed(() => {
  const q = toKeywords(searchString.value)
  if (!q) {
    return allItems.value
  }

  return allItems.value.map((item) => searchItem(item, q)).filter((c) => !!c)
})

/*
Returns a filtered copy of the item containing only elements matching
the keywords.
NULL if there is no match
*/

function searchItem(item, keywords) {
  if (!item || !keywords) {
    return null
  }

  if (item?.children?.length) {
    const filteredChildren = item.children.map((child) => searchItem(child, keywords)).filter((c) => !!c)
    return filteredChildren.length
      ? {
        ...item,
        children: filteredChildren,
      }
      : null
  }

  if (item.searchKey.includes(keywords)) {
    return item
  }

  return null
}

function toKeywords(string) {
  if (!string) {
    return ''
  }
  return string
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
}

const refEl = ref()

function onSearchEnter() {
  // FinderItem--item
  const firstElement = refEl.value.querySelector('.FinderItem--item')
  if (!firstElement) {
    return
  }

  firstElement.click()
}

function onClickItem(item) {
  emit('select-item', item)
  searchString.value = ''
}
</script>

<template>
  <div class="UiItemFinder">
    <input
      v-model="searchString"
      type="search"
      class="UiItemFinder__search"
      placeholder="Buscar ..."
      @keyup.enter="onSearchEnter()"
    >
    <div
      ref="refEl"
      class="UiItemFinder__body"
    >
      <slot name="body" />

      <FinderItem
        v-for="(item, i) in filteredItems"
        :key="i"
        :group="!searchString.trim() ? 'UiItemFinder' : null"
        :item="item"
        :open="i == 0 || !!searchString.trim()"
        @click-item="onClickItem"
      />
    </div>
  </div>
</template>

<style lang="scss">
.UiItemFinder {
  &__search {
    padding: 12px 12px;
    display: block;
    width: 100%;
    background-color: transparent;
    outline: none;
    border: 0;
    font-size: inherit;

    border-bottom: 1px solid var(--ui-color-ridge-bottom);
    color: inherit;
  }

  .UiDetails {
    border-radius: 0;
    border-top: 1px solid var(--ui-color-ridge-top);
    border-bottom: 1px solid var(--ui-color-ridge-bottom);

    & > summary {
      border-left: 0;
      border-right: 0;
      padding: 11px !important;
      border-radius: 0 !important;

      font-size: 0.9em;
      font-weight: bold;
    }
  }
}
</style>