<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { UiDialog } from '@/packages/ui/components'

const props = defineProps({
  /*
  String. Nombre/ID del nodo activo
  */
  active: {
    type: [String, Number],
    required: false,
    default: null,
  },

  /*
  Function (async) que retorna un objeto (nodo) dado un Nombre/ID
  */
  onFetch: {
    type: Function,
    required: false,
    default: () => () => null,
  },
})

const emit = defineEmits(['update:active'])

const history = reactive([])

watch(
  () => props.active,
  (newValue) => push(newValue, null),
  { immediate: true },
)

const bodySlot = ref()
const dialogSlot = ref()

async function fetchNode(nodeId, target = null) {
  const node = await props.onFetch(nodeId)
  if (!node) {
    console.warn('UiStory: node not found', nodeId)
    return
  }

  switch (target) {
  case 'dialog':
    dialogSlot.value = {
      nodeId,
      node,
      push,
      back,
    }
    break

  default:
    bodySlot.value = {
      nodeId,
      node,
      push,
      back: computed(() => !dialogSlot.value && history.length > 1 ? back : undefined),
    }

    dialogSlot.value = null
    break
  }

  return node
}

async function push(nodeId, target = null) {
  if (nodeId === null || nodeId == history[history.length - 1]?.nodeId) {
    return
  }

  await fetchNode(nodeId, target)

  history.push({
    nodeId,
    target,
    timestamp: Math.floor(new Date().getTime() / 1000),
  })

  emit('update:active', nodeId)
}


async function back() {
  if (history?.length <= 1) {
    return
  }
  history.pop()

  const prevPath = history[history.length - 1]
  await fetchNode(prevPath.nodeId, prevPath.target)
  emit('update:active', prevPath.nodeId)
}

defineExpose({
  push,
  back,
  history,
})
</script>

<template>
  <div class="UiStory">
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.0/animate.min.css"
      rel="stylesheet"
      type="text/css"
    >

    <transition
      v-if="bodySlot"

      name="tr-page"
      xmode="out-in"
      xname="custom-classes-transition"
      xenter-active-class="animate__animated animate__bounceInRight"
      xleave-active-class="animate__animated animate__bounceOutLeft"
      :duration="222"
    >
      <div

        :key="bodySlot.nodeId"
        class="UiStory__node"
      >
        <slot
          name="default"
          v-bind="bodySlot"
        />
        <slot
          name="footer"
          v-bind="bodySlot"
        />
      </div>
    </transition>

    <UiDialog
      :open="!!dialogSlot"
      @update:open="back()"
    >
      <template
        v-if="!!dialogSlot"
        #contents
      >
        <slot
          name="default"
          v-bind="dialogSlot"
        />
      </template>
      <template
        v-if="!!dialogSlot"
        #footer
      >
        <slot
          name="footer"
          v-bind="dialogSlot"
        />
      </template>
    </UiDialog>
  </div>
</template>

<style lang="scss">
.UiStory {
  --ui-story-transition-duration: var(--ui-duration-quick);
  position: relative;

  &__node {
    border: 1px solid transparent; // prevent border/margin collapse
  }

  .tr-page-enter-active {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  .tr-page-enter-active,
  .tr-page-leave-active {
    transition: all var(--ui-story-transition-duration) ease;
    opacity: 1;
    transform: translateX(0);
  }

  .tr-page-enter-from,
  .tr-page-leave-to {
    opacity: 0;
  }

  .tr-page-enter-from {
    transform: translateX(64px);
  }

  .tr-page-leave-to {
    transform: translateX(-64px);
  }
}
</style>