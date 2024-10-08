<script setup>
import { ref, computed, useSlots, watch } from 'vue'
import { UiItem } from '../UiItem'
import useLocationHashPage from '@/packages/cms/functions/useLocationhashPage.js'

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

// Currently selected value
const innerValue = ref()

// Obtain tabs from default slot contents
const slots = useSlots()

// const tabs = ref(getTabs())
const tabs = computed(() => getTabs())

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

const hasHashed = tabs.value.some((tab) => tab.props.href && tab.props.href.startsWith('#'))
if (hasHashed) {
  const locationHash = useLocationHashPage('#')
  watch(
    locationHash,
    (newValue) => {
      const foundTab = tabs.value.find((tab) => tab.props.href == '#' + newValue)
      if (foundTab) {
        console.log('foudn tab', foundTab)
        innerValue.value = foundTab.value
      }
    },
    { immediate: true },
  )
}

function getTabs() {
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
}

const markedTabs = computed(() => {
  return tabs.value.map((t, i) => ({
    ...t,
    isSelected: t.value === innerValue.value,
    isIncoming: i === incomingTabIndex.value,
    isOutgoing: i === outgoingTabIndex.value,
  }))
})

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
      <div class="UiTabs__left">
        <slot name="left" />
      </div>
      <div class="UiTabs__tabList">
        <component
          :is="tab.props.href ? 'a' : 'div'"
          v-for="(tab, i) in markedTabs"
          :key="i"
          class="UiTab"
          :class="{
            'UiTab--selected': tab.isSelected,
            'UiTab--incoming': tab.isIncoming,
            'UiTab--outgoing': tab.isOutgoing
          }"

          :href="tab.props?.href"
          :target="tab.props?.target"
          :title="tab.props?.title"
        >
          <component
            :is="tab.slotTab"
            v-if="tab.slotTab"
            :select="() => selectTab(tab)"
          />
          <UiItem
            v-else
            v-bind="{...tab.props, href: undefined}"
            class="ui--clickable"
            style="white-space: nowrap"
            @click="selectTab(tab)"
          />
        </component>
      </div>
      <div class="UiTabs__right">
        <slot name="right" />
      </div>
    </div>
    <div class="UiTabs__contents">
      <component
        :is="currentContent"
        v-if="currentContent"
      />
    </div>
  </div>
</template>