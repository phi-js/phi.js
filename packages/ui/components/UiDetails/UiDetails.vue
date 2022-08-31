<script>
const UiDetailsGroups = {}
</script>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { UiIcon } from '../UiIcon'
import { UiItem } from '../UiItem'

const props = defineProps({
  open: {
    type: Boolean,
    required: false,
    default: false,
  },

  text: {
    type: [String, Number],
    required: false,
    default: null,
  },

  subtext: {
    type: [String, Number],
    required: false,
    default: '',
  },

  icon: {
    type: [String, Number],
    required: false,
    default: null,
  },

  badge: {
    type: [String, Number],
    required: false,
    default: null,
  },

  /* Animation duration (ms.) */
  duration: {
    type: Number,
    required: false,
    default: 150,
  },

  /* Animation easing */
  easing: {
    type: String,
    required: false,
    default: 'ease-out',
  },

  /* Group name.  Only one item in the group is open at a time */
  group: {
    type: String,
    required: false,
    default: null,
  },

  onDelete: {
    type: Function,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:open', 'delete', 'open', 'close'])

const isOpen = ref(props.open)

const refEl = ref()
const refSummary = ref()
const refContents = ref()

let animation = null
const isClosing = ref(false)
const isExpanding = ref(false)
const isDeleting = ref(false)

watch(
  () => props.open,
  (newValue) => {
    if (newValue == refEl.value.open) {
      return
    }
    newValue ? open() : shrink()
    isOpen.value = newValue
  },
)

function onSummaryClick($event) {
  $event.preventDefault()

  if (isClosing.value || !refEl.value.open) {
    open()
  } else if (isExpanding.value || refEl.value.open) {
    shrink()
  }
}

function open() {
  refEl.value.style.height = `${refEl.value.offsetHeight}px`
  refEl.value.open = true
  window.requestAnimationFrame(() => expand())
}

async function expand() {
  if (!refEl.value) {
    return
  }

  refEl.value.style.overflow = 'hidden'
  isExpanding.value = true

  /*
  prevents content jumps in cases like:
  <UiDetails v-slot="{isOpen}">
    <Component v-if="isOpen">
  </UiDetails>
  */
  await nextTick()

  const startHeight = `${refEl.value.offsetHeight}px`
  const endHeight = `${refSummary.value.offsetHeight + refContents.value.offsetHeight}px`

  if (animation) {
    animation.cancel()
  }

  // Start a WAAPI animation
  animation = refEl.value.animate(
    { height: [startHeight, endHeight] },
    {
      duration: props.duration,
      easing: props.easing,
    },
  )

  animation.onfinish = () => onAnimationFinish(true)
  animation.oncancel = () => isExpanding.value = false

  // Close other items in the group
  closeOthersInGroup()
}

function shrink() {
  if (!refEl.value || !isOpen.value || isClosing.value) {
    return
  }

  refEl.value.style.overflow = 'hidden'
  isClosing.value = true
  const startHeight = `${refEl.value.offsetHeight}px`
  const endHeight = `${refSummary.value.offsetHeight}px`

  if (animation) {
    animation.cancel()
  }

  animation = refEl.value.animate(
    { height: [startHeight, endHeight] },
    {
      duration: props.duration,
      easing: props.easing,
    },
  )

  animation.onfinish = () => onAnimationFinish(false)
  animation.oncancel = () => isClosing.value = false
}

function onAnimationFinish(open) {
  animation = null
  isOpen.value = open
  isClosing.value = false
  isExpanding.value = false

  if (refEl.value) {
    refEl.value.open = open
    refEl.value.style.height = refEl.value.style.overflow = ''
  }

  emit('update:open', open)
  open ? emit('open') : emit('close')
}


// Group functionality.
const detailsInstance = {
  open,
  shrink,
}

onMounted(() => {
  // Store in global drawer group
  if (props.group) {
    if (typeof UiDetailsGroups[props.group] == 'undefined') {
      UiDetailsGroups[props.group] = []
    }
    UiDetailsGroups[props.group].push(detailsInstance)
  }
})

function closeOthersInGroup() {
  if (props.group && Array.isArray(UiDetailsGroups[props.group])) {
    UiDetailsGroups[props.group].forEach((otherInstance) => {
      if (otherInstance !== detailsInstance) {
        otherInstance.shrink()
      }
    })
  }
}
</script>

<template>
  <details
    ref="refEl"
    :open="props.open"
    class="UiDetails"
    :class="{
      'UiDetails--opening': isExpanding,
      'UiDetails--closing': isClosing,
      'UiDetails--deleting': isDeleting,
    }"
    :style="{ '--details-transition-duration': `${props.duration}ms`}"
  >
    <summary
      v-show="$slots.summary || $slots.actions || props.text || props.subtext || props.icon"
      ref="refSummary"
      class="UiDetails__summary"
      @click="onSummaryClick"
    >
      <UiItem
        v-bind="props"
        class="UiDetails__item"
      >
        <template #default>
          <slot
            name="summary"
            :is-open="isOpen"
            :close="shrink"
          />
        </template>

        <template #actions>
          <slot
            name="actions"
            :is-open="isOpen"
            :close="shrink"
          />
          <UiIcon
            v-if="props.onDelete"
            src="mdi:close"
            class="UiDetails__deleter"
            @mouseenter="isDeleting = true"
            @mouseleave="isDeleting = false"
            @click="emit('delete')"
          />
        </template>
      </UiItem>
    </summary>
    <div
      ref="refContents"
      class="UiDetails__contents"
    >
      <slot
        name="contents"
        :is-open="isOpen || isExpanding"
        :close="shrink"
      >
        <slot
          name="default"
          :is-open="isOpen || isExpanding"
          :close="shrink"
        />
      </slot>
    </div>
  </details>
</template>