<script setup>
import { ref, computed, useSlots, watch } from 'vue'
import { UiItem } from '../UiItem'

const props = defineProps({
  modelValue: {
    validator: () => true,
    required: false,
    default: null,
  },

  /*
  name to be used as a key for localStorage
  to remember tab positions
  */
  name: {
    type: String,
    required: false,
    default: null,
  },

  /*
  Select first tab on null modelValue
  */
  autoSelect: {
    type: Boolean,
    required: false,
    default: true,
  },
})
const emit = defineEmits(['update:modelValue'])


// Obtain tabs from default slot contents
const slots = useSlots()

const tabs = computed(() => {
  if (!slots?.default) {
    return []
  }

  let renderedSlot = slots.default()
  let tabNodes = []

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

  return tabNodes.map((vNode, vIndex) => ({
    value: vNode?.props?.value !== undefined ? vNode.props.value : vIndex,
    props: vNode?.props || {},
    slotTab: vNode?.children?.tab,
    slotContent: vNode?.children?.default || vNode?.children?.contents,
  }))
})

const markedTabs = computed(() => {
  return tabs.value.map((t, i) => ({
    ...t,
    isSelected: t.value === innerValue.value,
    isIncoming: i === incomingTabIndex.value,
    isOutgoing: i === outgoingTabIndex.value,
  }))
})


// Handle selected value
const innerValue = ref()

const root = ref(null)
const direction = ref('left')
const incomingTabIndex = ref(-1)
const outgoingTabIndex = ref(-1)
const selectedIndex = computed(() => tabs.value.findIndex((t) => t.value === innerValue.value))
const currentContent = computed(() => tabs.value?.[selectedIndex.value]?.slotContent)

// Wake up (must be declared before immediate prop watcher)
// Handle innerValue persistense in localStorage
if (props.name) {
  innerValue.value = JSON.parse(localStorage.getItem(`UiTabs:${props.name}`))
  watch(
    innerValue,
    () => localStorage.setItem(`UiTabs:${props.name}`, JSON.stringify(innerValue.value)),
  )
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) {
      innerValue.value = newValue
    }

    if (props.autoSelect && !innerValue.value) {
      innerValue.value = tabs.value?.[0]?.value
    }
  },
  { immediate: true },
)

function selectTab(incomingTab, scrollIntoView = true) {
  if (!incomingTab || incomingTab.value === innerValue.value) {
    return
  }

  let outIndex = selectedIndex.value
  let inIndex = markedTabs.value.indexOf(incomingTab)

  direction.value = inIndex - outIndex > 0 ? 'right' : 'left'
  innerValue.value = incomingTab.value
  incomingTabIndex.value = inIndex
  outgoingTabIndex.value = outIndex
  emit('update:modelValue', innerValue.value)

  if (scrollIntoView) {
    let tabEl = root?.value.querySelectorAll('.UiTab')?.[inIndex]
    tabEl && tabEl.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }
}

</script>

<template>
  <div
    ref="root"
    class="UiTabs"
    :class="`UiTabs--direction-${direction}`"
  >
    <div class="UiTabs__header">
      <slot name="left" />
      <div class="UiTabs__tabList">
        <div
          v-for="(tab, i) in markedTabs"
          :key="i"
          class="UiTab"
          :class="{
            'UiTab--selected': tab.isSelected,
            'UiTab--incoming': tab.isIncoming,
            'UiTab--outgoing': tab.isOutgoing
          }"
        >
          <component
            :is="tab.slotTab"
            v-if="tab.slotTab"
            :select="() => selectTab(tab)"
          />
          <UiItem
            v-else
            v-bind="tab.props"
            class="ui--clickable"
            style="white-space: nowrap"
            @click="selectTab(tab)"
          />
        </div>
      </div>
      <slot name="right" />
    </div>
    <div class="UiTabs__contents">
      <component
        :is="currentContent"
        v-if="currentContent"
      />
    </div>
  </div>
</template>

<style lang="scss">
// Tab placement
.UiTabs {
  &__header {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    overflow-x: auto;

    /*firefox only*/
    scrollbar-width: thin;

    /*webkit based browsers only*/
    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  &__tabList {
    flex: 1;

    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
  }
}

// Tab bottom border + animations
.UiTabs {
  .UiTab {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      border-radius: 2px;
      background-color: var(--ui-color-primary);

      transform: scaleX(0);
      transition: transform var(--ui-duration-snap);
    }

    &--selected {
      &::after {
        transform: scaleX(1);
      }
    }
  }

  &--direction-left {
    .UiTab {
      &--incoming::after {
        transform-origin: bottom right;
      }
      &--outgoing::after {
        transform-origin: bottom left;
      }
    }
  }

  &--direction-right {
    .UiTab {
      &--incoming::after {
        transform-origin: bottom left;
      }
      &--outgoing::after {
        transform-origin: bottom right;
      }
    }
  }
}
</style>
