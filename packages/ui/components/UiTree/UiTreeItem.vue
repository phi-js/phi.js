<script setup>
import { defineAsyncComponent, computed } from 'vue'
import { UiDetails } from '../UiDetails'
const UiTree = defineAsyncComponent(() => import('./UiTree.vue'))

const props = defineProps({
  /*
  An item OBJECT
  {
    ... anything ...
    [childrenProp]: ... another object
  }
  */
  value: {
    type: Object,
    required: true,
  },

  getChildren: {
    type: Function,
    required: true,
  },

  getOpen: {
    type: Function,
    required: true,
  },

  /* For internal use */
  depth: {
    type: Number,
    required: false,
    default: 0,
  },
})

const children = computed(() => props.getChildren(props.value))
const isOpen = computed(() => props.getOpen(props.value))

// function onDetailsOpen($event) {
//   if ($event?.parentNode?.scrollIntoView) {
//     setTimeout(() => {
//       $event.parentNode.scrollIntoView({ block: 'nearest', inline: 'nearest' })
//     }, 120)
//   }
// }
</script>

<template>
  <div
    class="UiTree"
    :class="[
      {'UiTree--open': isOpen},
      {'UiTree--closed': !isOpen},
      value.class
    ]"
    :style="value.style"
  >
    <!-- ITEM FACE -->
    <div
      class="UiTree__face"
      :class="{
        'UiTree__face--open': isOpen,
        'UiTree__face--closed': !isOpen
      }"
    >
      <slot
        name="item"
        :item="props.value"
        :is-open="isOpen"
        :depth="props.depth"
      />
    </div>

    <!-- ITEM CHILDREN -->
    <UiDetails
      v-if="children?.length"
      :open="isOpen"
    >
      <UiTree
        class="UiTree__children"
        :class="{
          'UiTree__children--open': isOpen,
          'UiTree__children--closed': !isOpen
        }"
        v-bind="{...props, value: undefined}"
        :value="children"
        :depth="props.depth + 1"
      >
        <template #item="slotProps">
          <slot
            name="item"
            v-bind="slotProps"
          />
        </template>
      </UiTree>
    </UiDetails>
  </div>
</template>