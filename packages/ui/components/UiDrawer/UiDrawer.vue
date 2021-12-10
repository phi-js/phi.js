<script>
const UiDrawerGroups = {}
</script>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: false,
    default: false,
  },

  drawerGroup: {
    type: String,
    required: false,
    default: null,
  },

  duration: {
    type: Number,
    required: false,
    default: 240,
  },
})
const emit = defineEmits(['update:open'])

const isOpen = ref(false)
watch(
  () => props.open,
  (newValue) => setOpen(newValue),
)

const drawerInstance = {
  isOpen,
  setOpen,
}

onMounted(() => {
  isOpen.value = props.open

  // Store in global drawer group
  if (props.drawerGroup) {
    if (typeof UiDrawerGroups[props.drawerGroup] == 'undefined') {
      UiDrawerGroups[props.drawerGroup] = []
    }
    UiDrawerGroups[props.drawerGroup].push(drawerInstance)
  }
})

const contentsEl = ref()

function setOpen(newValue = false) {
  if (isOpen.value == newValue || !contentsEl.value) {
    return
  }

  contentsEl.value.style.maxHeight = 'none'
  const contentsHeight = contentsEl.value.getBoundingClientRect().height + 'px'

  let sourceHeight = 0
  let targetHeight = 0

  if (newValue) {
    sourceHeight = 0
    targetHeight = contentsHeight
  } else {
    sourceHeight = contentsHeight
    targetHeight = 0
  }

  contentsEl.value.style.transition = `all ${props.duration}ms`
  contentsEl.value.style.maxHeight = sourceHeight
  contentsEl.value.style.overflow = 'hidden'

  setTimeout(() => contentsEl.value.style.maxHeight = targetHeight, 0)

  setTimeout(() => {
    contentsEl.value.style.transition = null
    contentsEl.value.style.maxHeight = null
    contentsEl.value.style.overflow = null
  }, props.duration)

  isOpen.value = newValue
  emit('update:open', isOpen.value)

  /* Close all other drawers in the group (if group is present) */
  if (props.drawerGroup && isOpen.value) {
    UiDrawerGroups[props.drawerGroup].forEach((otherDrawerInstance) => {
      if (otherDrawerInstance !== drawerInstance) {
        otherDrawerInstance.setOpen(false)
      }
    })
  }
}

function onTriggerClick() {
  setOpen(!isOpen.value)
}
</script>

<template>
  <div
    class="UiDrawer"
    :class="{'UiDrawer--open': isOpen, 'UiDrawer--closed': !isOpen}"
  >
    <div
      v-if="$slots.trigger"
      class="UiDrawer__trigger"
      @click="onTriggerClick"
    >
      <slot
        name="trigger"
        :is-open="isOpen"
      />
    </div>

    <div
      ref="contentsEl"
      class="UiDrawer__contents"
    >
      <slot
        name="contents"
        :close="() => setOpen(false)"
      >
        <slot
          name="default"
          :close="() => setOpen(false)"
        />
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
.UiDrawer {
  position: relative;

  &--closed > &__contents {
    overflow: hidden;
    max-height: 0px;
  }
}
</style>