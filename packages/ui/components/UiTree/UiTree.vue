<script setup>
import { ref, watch } from 'vue'
import UiTreeItem from './UiTreeItem.vue'

const props = defineProps({
  /*
  An arbitrary object, or an ARRAY of arbitrary objects
  */
  value: {
    type: [Array, Object],
    required: false,
    default: null,
  },

  /*
  The object property containing a "tree" object (i.e. an object, or array of objects)
  */
  childrenProp: {
    type: String,
    required: false,
    default: 'children',
  },

  /* For internal use */
  depth: {
    type: Number,
    required: false,
    default: 0,
  },

  initialOpen: {
    type: Function,
    required: false,
    default: null,
  },

  /* Unique name (to use as drawer group base name) */
  name: {
    type: String,
    required: false,
    default: () => 'UiTree_' + Math.floor(Math.random() * 100000),
  },

  /*
  Currently selected path
  An ARRAY of indexes. e.g. [2,1,2]
  */
  path: {
    type: Array,
    required: false,
    default: () => [],
  },

  allowMultipleOpen: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const emit = defineEmits(['click-item'])

const items = ref([])

watch(
  () => props.value,
  (newValue) => items.value = Array.isArray(newValue) ? newValue : [newValue],
  { immediate: true },
)
</script>

<template>
  <div class="UiTree">
    <UiTreeItem
      v-for="(_, i) in items"
      :key="i"
      :value="items[i]"
      :depth="props.depth"
      :children-prop="props.childrenProp"
      :initial-open="props.initialOpen"
      :allow-multiple-open="props.allowMultipleOpen"
      :name="props.name"
      :open="props.path[0] == i"
      :path="props.path[0] == i ? props.path.slice(1) : []"
      @click-item="emit('click-item', $event)"
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