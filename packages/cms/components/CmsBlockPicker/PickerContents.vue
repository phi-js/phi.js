<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiItem, UiInput } from '@/packages/ui'
import { getPluginData } from '../../functions'

import findNearestElement from './findNearestElement.js'

import dictionary from './PickerContents.i18n.js'
const i18n = useI18n(dictionary)

const emit = defineEmits(['input'])

const pluginData = getPluginData()
const objAllBlocks = pluginData?.blocks || {}

// Raw array of all available blocks
// (All those without disabled:true in their definition i.e. LayoutPage)
const allBlocks = ref([])
for (const [blockName, blockDefinition] of Object.entries(objAllBlocks)) {
  if (blockDefinition?.disabled) {
    continue
  }

  allBlocks.value.push({
    ...blockDefinition,
    name: blockName,
    searchKey: normalize(blockDefinition.title) + normalize(blockDefinition.name),
  })
}


function launchBlock(blockDefinition) {
  if (!blockDefinition?.block) {
    console.warn('Cannot launch block from object:', blockDefinition)
    return
  }

  const jsonBlock = JSON.parse(JSON.stringify({
    ...blockDefinition.block,
    component: blockDefinition.name,
  }))
  emit('input', jsonBlock)

  searchString.value = ''
}


// Search/Filter blocks
const searchString = ref('')

// filteredBlocks es el "source of truth"
const filteredBlocks = computed(() => {
  const q = normalize(searchString.value)
  if (!q) {
    return allBlocks.value
  }
  return allBlocks.value.filter((block) => block.searchKey.includes(q))
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


// Tree of blocks (blocks grouped by tag:)
/*
tree: [
  {
    id: tagName,
    text: 'Group name',
    subtext: 'Group description',
    icon: 'Group icon',
    children: [
      { ...blockDef:  name, title, icon, block, editor ... },
      { ...blockDef:  id,text,subtext,icon | name, title, icon, block, editor ... }, // id,text,subtext,icon determined from definition
    ]
  }
]
*/
const tree = computed(() => {
  const retval = []

  filteredBlocks.value.forEach((block, _index) => {
    const blockTags = Array.isArray(block.tags) ? block.tags : ['default']
    blockTags.forEach((tagName) => {
      let foundParent = retval.find((i) => i.id === tagName)
      if (!foundParent) {
        foundParent = {
          id: tagName,
          text: i18n.t(`PickerContents.Tab.${tagName}`),
          children: [],
        }
        retval.push(foundParent)
      }

      foundParent.children.push({ ...block, _index })
    })
  })

  return retval
})

// index of filteredBlocks.value that is currently focused
const focusedIndex = ref(0)
const elTree = ref()

function onSearchChange() {
  focusedIndex.value = 0
}

function onSearchEnter() {
  launchBlock(filteredBlocks.value?.[focusedIndex.value])
}

function onSearchArrow(key) {
  const focusedElement = elTree.value.querySelector('.PickerContents__item--focused')
  if (!focusedElement) {
    return
  }

  const nearestElement = findNearestElement(
    elTree.value.querySelectorAll('.PickerContents__item'),
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
    const focusedElement = elTree.value.querySelector('.PickerContents__item--focused')
    focusedElement && focusedElement.scrollIntoView({ block: 'nearest' })
  }),
)
</script>

<template>
  <div class="PickerContents">
    <UiInput
      v-model="searchString"
      type="search"
      class="PickerContents__search"
      placeholder="Buscar ..."
      @update:model-value="onSearchChange"

      @keydown.up="onSearchArrow('up')"
      @keydown.down="onSearchArrow('down')"
      @keydown.left="onSearchArrow('left')"
      @keydown.right="onSearchArrow('right')"
      @keydown.enter="onSearchEnter()"
    />
    <div
      ref="elTree"
      class="PickerContents__tree"
    >
      <details
        v-for="groupItem in tree"
        :key="groupItem.id"
        class="PickerContents__details"
        open
      >
        <summary>{{ groupItem.text }}</summary>
        <section>
          <UiItem
            v-for="(blockDef) in groupItem.children"
            :key="blockDef.name"
            class="PickerContents__item"
            :class="{'PickerContents__item--focused': blockDef._index === focusedIndex}"
            :icon="blockDef.icon"
            :text="blockDef.title || blockDef.name"
            :data-item-index="blockDef._index"
            @click="launchBlock(blockDef)"
          />
        </section>
      </details>
    </div>
  </div>
</template>

<style lang="scss">
.PickerContents {
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
    max-height: 400px;
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
      // font-size: 15px;
    }

    & > section {
      display: flex;
      flex-wrap: wrap;
      padding: 0 12px 18px 12px;

      & > * {
        margin: 5px;
        width: calc(50% - 10px); // 50% - 2*margin
      }
    }
  }
}
</style>