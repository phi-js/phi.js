<script setup>
import { ref, watch } from 'vue'
import UiTreeItem from './UiTreeItem.vue'

const props = defineProps({
  /*
  An arbitrary object, or an ARRAY of arbitrary objects (called ITEMS)
  */
  value: {
    type: [Array, Object],
    required: false,
    default: null,
  },

  /*
  A function that given an ITEM, returns its children
  */
  getChildren: {
    type: Function,
    required: false,
    default: (item) => item.children,
  },

  /*
  A function that given an ITEM, returns a BOOLEAN indicating its open state
  */
  getOpen: {
    type: Function,
    required: false,
    default: (item) => item.isOpen,
  },

  /* For internal use */
  depth: {
    type: Number,
    required: false,
    default: 0,
  },
})

const items = ref([])

watch(
  () => props.value,
  (newValue) => {
    items.value = Array.isArray(newValue)
      ? newValue
      : [newValue]
  },
  { immediate: true },
)
</script>

<template>
  <div class="UiTree">
    <UiTreeItem
      v-for="(_, i) in items"
      :key="i"
      :value="items[i]"
      :get-children="props.getChildren"
      :get-open="props.getOpen"
      :depth="props.depth"
    >
      <template #item="slotProps">
        <slot
          name="item"
          v-bind="slotProps"
        />
      </template>
    </UiTreeItem>
  </div>
</template>