<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { UiItem, UiInput } from '../'
import findNearestElement from './findNearestElement.js'

const props = defineProps({
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
  () => {
    allItems.value = props.items.map((item) => ({
      ...item,
      searchKey: normalize(item.text) + normalize(item.subtext),
    }))
  },
  { immediate: true },
)


// Search/Filter items
const searchString = ref('')

// filteredItems es el "source of truth"
const filteredItems = computed(() => {
  const q = normalize(searchString.value)
  if (!q) {
    return allItems.value
  }
  return allItems.value.filter((item) => item.searchKey.includes(q))
})

function normalize(string) {
  if (!string) {
    return ''
  }
  return string
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}


// Tree of item tabs (items grouped by tab:)
/*
tree: [
  {
    id: tabName,
    text: 'Tab name',
    subtext: 'Tab description',
    icon: 'Tab icon',
    children: [
      { ...item:  id,icon,text,subtext ... },
    ]
  }
]
*/
const tree = computed(() => {
  const retval = []

  filteredItems.value.forEach((item, _index) => {
    const itemTabs = Array.isArray(item.tabs) ? item.tabs : ['default']
    itemTabs.forEach((tabName) => {
      let foundParent = retval.find((i) => i.id === tabName)
      if (!foundParent) {
        foundParent = {
          id: tabName,
          text: tabName,
          children: [],
        }
        retval.push(foundParent)
      }

      foundParent.children.push({ ...item, _index })
    })
  })

  return retval
})

// index of filteredItems.value that is currently focused
const focusedIndex = ref(0)
const elTree = ref()

function onSearchChange() {
  focusedIndex.value = 0
}

function onSearchEnter() {
  emit('select-item', filteredItems.value?.[focusedIndex.value])
  searchString.value = ''
}

function onItemClick(item) {
  emit('select-item', filteredItems.value[item._index])
  searchString.value = ''
}

function onSearchArrow(key) {
  const focusedElement = elTree.value.querySelector('.UiItemFinder__item--focused')
  if (!focusedElement) {
    return
  }

  const nearestElement = findNearestElement(
    elTree.value.querySelectorAll('.UiItemFinder__item'),
    focusedElement,
    key,
  )

  if (nearestElement?.dataset?.itemIndex >= 0) {
    focusedIndex.value = parseInt(nearestElement.dataset.itemIndex)
    return
  }

  // Not found.  wrap around left/right
  if (key == 'left') {
    focusedIndex.value = parseInt(focusedElement.previousElementSibling?.dataset?.itemIndex) || focusedIndex.value
  } else if (key == 'right') {
    focusedIndex.value = parseInt(focusedElement.nextElementSibling?.dataset?.itemIndex) || focusedIndex.value
  }
}

// Keep focused element in view of parent scroll container
watch(
  focusedIndex,
  () => nextTick(() => {
    const focusedElement = elTree.value.querySelector('.UiItemFinder__item--focused')
    focusedElement && focusedElement.scrollIntoView({ block: 'nearest' })
  }),
)
</script>

<template>
  <div class="UiItemFinder">
    <UiInput
      v-model="searchString"
      type="search"
      class="UiItemFinder__search"
      placeholder="Buscar ..."
      @update:model-value="onSearchChange"

      @keydown.up="onSearchArrow('up')"
      @keydown.down="onSearchArrow('down')"
      @keydown.left="onSearchArrow('left')"
      @keydown.right="onSearchArrow('right')"
      @keyup.enter="onSearchEnter()"
    />
    <div
      ref="elTree"
      class="UiItemFinder__tree"
    >
      <details
        v-for="groupItem in tree"
        :key="groupItem.id"
        class="UiItemFinder__details"
        open
      >
        <summary>{{ groupItem.text }}</summary>
        <section>
          <div
            v-for="(item) in groupItem.children"
            :key="item.id"
          >
            <UiItem
              class="UiItemFinder__item"
              :class="{'UiItemFinder__item--focused': item._index === focusedIndex}"
              :icon="item.icon"
              :text="item.text"
              :subtext="item.subtext"
              :data-item-index="item._index"
              @click="onItemClick(item)"
            />
          </div>
        </section>
      </details>
    </div>
  </div>
</template>

<style lang="scss">
.UiItemFinder {
  display: flex;
  flex-direction: column;

  &__search {
    display: block;
    border-bottom: 1px inset #777;

    .UiInput__element { // !!! ugh
      outline: none !important;

      width: 100%;
      background: transparent;
      border-radius: 0;
      border: 0;
      margin: 0;
      color: inherit;
      &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: inherit;
        opacity: 1; /* Firefox */
      }
    }
  }

  &__tree {
    flex: 1;
    max-height: 300px;
    overflow-y: auto;
    user-select: none;

    &::-webkit-scrollbar {
      width: 12px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.4);
      border-radius: 6px;
      border: 2px solid #333;
    }
  }

  &__item {
    margin: 5px;

    --ui-item-padding: 8px 12px;
    border: 1px solid rgba(255,255,255, 0.1);
    border-radius: 4px;

    &--focused {
      border: 1px solid var(--ui-color-primary);
    }

    cursor: pointer;
    &:hover {
      background-color: rgba(255,255,255, 0.1);
    }
  }


  &__details {
    & > summary {
      padding: 12px;
      font-weight: bold;
    }

    & > section {
      display: flex;
      flex-wrap: wrap;
      padding: 0 12px 18px 12px;

      & > div {
        flex: 1;
        min-width: 200px;
      }
    }
  }
}
</style>