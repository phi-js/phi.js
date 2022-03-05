<script setup>
import { ref, defineAsyncComponent, watch } from 'vue'
import { UiDrawer } from '../UiDrawer'
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

  /* Unique name (to use as drawer group base name) */
  name: {
    type: String,
    required: false,
    default: '',
  },
})

const children = ref()
const isOpen = ref(false)

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
</script>

<template>
  <div class="UiTree" :class="{ 'UiTree--open': isOpen, 'UiTree--closed': !isOpen }">
    <div
      class="UiTree__face"
      :class="{ 'UiTree__face--open': isOpen, 'UiTree__face--closed': !isOpen }"
    >
      <slot
        name="default"
        :item="props.value"
        :children="children"
        :isOpen="isOpen"
        :toggle="toggle"
        :expand="expand"
        :collapse="collapse"
        :depth="props.depth"
      />
    </div>
    <UiDrawer
      v-if="children"
      v-model:open="isOpen"
      :drawer-group="`UiTree-${props.name}-${props.depth}`"
    >
      <UiTree
        class="UiTree__children"
        :class="{ 'UiTree__children--open': isOpen, 'UiTree__children--closed': !isOpen }"
        v-bind="props"
        :value="children"
        :depth="props.depth + 1"
      >
        <template #default="slotProps">
          <slot name="default" v-bind="slotProps" />
        </template>
      </UiTree>
    </UiDrawer>
  </div>
</template>