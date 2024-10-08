<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import FinderItem from './FinderItem.vue'

const i18n = useI18n()

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

const emit = defineEmits(['select-item', 'update:searchString'])

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

  const words = keywords.split(' ')
  if (words.every(((word) => item.searchKey.includes(word)))) {
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
    .replace(/-/g, ' ')
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

  searchString.value = ''
  emit('update:searchString', '')
}

function onClickItem(item) {
  emit('select-item', item)
  searchString.value = ''
  emit('update:searchString', '')
}
</script>

<template>
  <div class="UiItemFinder">
    <input
      v-model="searchString"
      type="search"
      class="UiItemFinder__search"
      :placeholder="i18n.t('Search')"
      @update:model-value="emit('update:searchString', $event)"
      @keydown.enter.stop.prevent="onSearchEnter()"
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