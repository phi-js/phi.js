<script setup>
import { ref, defineAsyncComponent, watch } from 'vue'
import { UiDetails } from '../UiDetails'
import { UiItem } from '../UiItem'
import { UiIcon } from '../UiIcon'
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

  /*
  The object property containing the recursive item(s)
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

  open: {
    type: Boolean,
    required: false,
    default: false,
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

  /* Unique name (to use as drawer group base name) */
  name: {
    type: String,
    required: false,
    default: '',
  },
})

const children = ref()
const isOpen = ref(props.open)

watch(
  () => props.value,
  (newValue) => {
    children.value = newValue?.[props.childrenProp] || null
    if (typeof props.initialOpen === 'function') {
      isOpen.value = props.initialOpen(props.value)
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

function toggle() {
  if (!children.value) {
    return
  }

  isOpen.value = !isOpen.value
}

function expand() {
  if (!children.value) {
    return
  }

  isOpen.value = true
}

function collapse() {
  if (!children.value) {
    return
  }

  isOpen.value = false
}

function onDetailsOpen($event) {
  if ($event?.parentNode?.scrollIntoView) {
    setTimeout(() => {
      $event.parentNode.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }, 120)
  }
}
</script>

<template>
  <div
    class="UiTree"
    :class="{ 'UiTree--open': isOpen, 'UiTree--closed': !isOpen }"
  >
    <div
      class="UiTree__face"
      :class="{ 'UiTree__face--open': isOpen, 'UiTree__face--closed': !isOpen }"
    >
      <slot
        name="item"
        :item="props.value"
        :children="children"
        :is-open="isOpen"
        :toggle="toggle"
        :expand="expand"
        :collapse="collapse"
        :depth="props.depth"
        :navigate="toggle"
      >
        <UiItem
          :text="props.value.text"
          :subtext="props.value.subtext"
          :color="props.value.color"
          :icon="props.value.icon"
          @click="toggle"
        >
          <template
            v-if="children?.length"
            #actions
          >
            <UiIcon :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" />
          </template>
        </UiItem>
      </slot>
    </div>
    <UiDetails
      v-if="children?.length"
      v-model:open="isOpen"
      :drawer-group="`UiTree-${props.name}-${props.depth}`"
      :group="`UiTree-${props.name}-${props.depth}`"
      @open="onDetailsOpen"
    >
      <UiTree
        class="UiTree__children"
        :class="{ 'UiTree__children--open': isOpen, 'UiTree__children--closed': !isOpen }"
        v-bind="props"
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