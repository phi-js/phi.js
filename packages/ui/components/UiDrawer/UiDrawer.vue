<script>
const UiDrawerGroups = {}
</script>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

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
const emit = defineEmits(['update:open', 'open', 'close'])

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

async function setOpen(newValue = false, _haltEmits = false) {
  if (isOpen.value == newValue || !contentsEl.value) {
    return
  }

  /*
  when opening, emit update:open BEFORE the animation starts and await the next tick
  in case the slot component is reacting to isOpen
  e.g.
  <UiDrawer v-slot="{isOpen}">
    <Component v-if="isOpen" />  <!-- I want to load the component only when the drawer is open -->
  </UiDrawer>

  that way the component will be mounted and its height determined BEFORE the animation starts
  */
  if (newValue) {
    isOpen.value = newValue
    emit('update:open', isOpen.value)
    await nextTick()
  }

  contentsEl.value.style.maxHeight = 'none'

  // Get full internal height
  let contentsHeight = contentsEl.value.getBoundingClientRect().height
  let sourceHeight = 0
  let targetHeight = 0

  if (newValue) {
    sourceHeight = 0
    targetHeight = contentsHeight + 'px'
  } else {
    sourceHeight = contentsHeight + 'px'
    targetHeight = 0
  }

  contentsEl.value.style.transition = `all ${props.duration}ms`
  contentsEl.value.style.maxHeight = sourceHeight
  contentsEl.value.style.overflow = 'hidden'

  setTimeout(() => {
    if (!contentsEl.value) {
      return
    }
    contentsEl.value.style.maxHeight = targetHeight
  }, 0)

  setTimeout(() => {
    /* Update local value and emit events only when animation is done */
    if (!newValue) {
      isOpen.value = false
      emit('update:open', isOpen.value)
    }

    isOpen.value ? emit('open') : emit('close')

    if (!contentsEl.value) {
      return
    }
    contentsEl.value.style.transition = null
    contentsEl.value.style.maxHeight = null
    contentsEl.value.style.overflow = null
  }, props.duration)


  /* Close all other drawers in the group (if group is present) */
  if (props.drawerGroup && isOpen.value && !_haltEmits) {
    UiDrawerGroups[props.drawerGroup].forEach((otherDrawerInstance) => {
      if (otherDrawerInstance !== drawerInstance) {
        otherDrawerInstance.setOpen(false, true)
      }
    })
  }
}

function onTriggerClick() {
  setOpen(!isOpen.value)
}
</script>

<template>
  <div class="UiDrawer" :class="{ 'UiDrawer--open': isOpen, 'UiDrawer--closed': !isOpen }">
    <div v-if="$slots.trigger" class="UiDrawer__trigger" @click="onTriggerClick">
      <slot name="trigger" :is-open="isOpen" />
    </div>

    <div ref="contentsEl" class="UiDrawer__contents">
      <slot name="contents" :close="() => setOpen(false)" :isOpen="isOpen">
        <slot name="default" :close="() => setOpen(false)" :isOpen="isOpen" />
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
.UiDrawer {
  position: relative;

  & > &__contents {
    overflow: auto; // This is to prevent margin collapse, so the child slot can have margins
  }

  &--closed > &__contents {
    overflow: hidden;
    max-height: 0px;
  }
}
</style>