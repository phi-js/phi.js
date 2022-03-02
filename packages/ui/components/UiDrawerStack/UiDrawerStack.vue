<script setup>
import { useSlots, computed } from 'vue'

import UiDrawer from '../UiDrawer/UiDrawer.vue'
import UiItem from '../UiItem/UiItem.vue'

const props = defineProps({
  modelValue: {
    validator: () => true,
    required: false,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

/*
drawers:
[
  {
    value: unique value,
    slot: a vue slot object (that works in <component :is="thing">)
    props: { props from the <UiTab>, like ...
      text: '',
      subtext: '',
      icon: '',
    }
  },
]
*/

// Populate drawer array with data from child <UiTab>s
const slots = useSlots()
const drawers = computed(() => {
  if (!slots?.default) {
    return []
  }

  const renderedSlot = slots.default()
  const tabNodes = []

  for (let i = 0; i < renderedSlot.length; i++) {
    let vNode = renderedSlot[i]
    if (vNode?.type?.name === 'UiTab') {
      tabNodes.push(vNode)
    } else if (Array.isArray(vNode?.children)) {
      vNode.children
        .filter((v) => v?.type?.name === 'UiTab')
        .forEach((childNode) => tabNodes.push(childNode))
    }
  }

  return tabNodes.map((vNode, vIndex) => {
    const tabValue = vNode?.props?.value !== undefined ? vNode.props.value : vIndex
    return {
      value: tabValue,
      props: vNode?.props || {},
      slot: vNode?.children?.default,
      isOpen: tabValue === props.modelValue
    }
  })
})
</script>

<template>
  <div class="UiDrawerStack">
    <UiDrawer
      v-for="drawer in drawers"
      :key="drawer.value"
      :open="drawer.isOpen"
      class="UiDrawerStack__drawer"
      :class="{ 'UiDrawerStack__drawer--open': drawer.isOpen }"
    >
      <template #trigger>
        <!-- { text, subtext, icon } set from <UiTab text="" .. /> -->
        <UiItem
          class="UiDrawerStack__item ui--clickable"
          v-bind="drawer.props"
          @click.stop="emit('update:modelValue', drawer.value)"
        />
      </template>
      <template #default>
        <div class="UiDrawerStack__component" v-if="drawer.slot">
          <Component :is="drawer.slot" />
        </div>
      </template>
    </UiDrawer>
  </div>
</template>