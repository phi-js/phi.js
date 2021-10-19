<script setup>
import { ref, watch, computed } from 'vue'
import { UiDialog } from '/packages/ui/components'

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})

const story = ref({})
const currentNodeId = ref(null)
const history = ref([])
const hasBack = computed(() => history.value?.length > 1)

watch(
  () => props.modelValue,
  (newValue) => {
    story.value = newValue ? JSON.parse(JSON.stringify(newValue)) : {}
    if (!currentNodeId.value) {
      goTo(story.value?.nodes?.[0])
    }
  },
  { immediate: true },
)

const currentNode = computed(() => {
  if (!currentNodeId.value) {
    return { id: null }
  }

  const found = story.value.nodes.find((node) => node.id == currentNodeId.value) || { id: null }
  return {
    ...found,
    exits: story.value.paths?.length ? story.value.paths.filter((path) => path.from == found.id) : [],
  }
})

const dialogNode = ref()

function goTo(nodeId) {
  nodeId = nodeId?.id || nodeId
  const fromId = currentNodeId.value
  if (nodeId == fromId) {
    return
  }

  currentNodeId.value = nodeId

  history.value.push({
    from: fromId,
    to: currentNodeId.value,
    timestamp: Math.floor(new Date().getTime() / 1000),
  })
}

function openDialog(nodeId, onAccept = null, onCancel = null) {
  dialogNode.value = story.value.nodes.find((node) => node.id == nodeId)
}

function goBack() {
  if (!hasBack.value) {
    return
  }
  const lastPath = history.value.pop()
  currentNodeId.value = lastPath.from
}

const duration = ref('0.3s')

defineExpose({
  currentNode,
  history,
  hasBack,
  goTo,
  goBack,
  openDialog,
})
</script>

<template>
  <div
    class="UiStory"
    :style="{'--ui-story-transition-duration': duration}"
  >
    <transition name="tr-page">
      <div
        :key="currentNode.id"
        class="UiStory__node"
      >
        <slot
          name="contents"
          :node="currentNode"
        />
      </div>
    </transition>

    <UiDialog
      :open="!!dialogNode"
    >
      <template
        v-if="!!dialogNode"
        #contents
      >
        <slot
          name="contents"
          :node="dialogNode"
        />
      </template>
      <template
        v-if="!!dialogNode"
        #footer="{ close }"
      >
        <button
          type="button"
          class="ui-button --main"
          @click="close()"
        >
          Aceptar
        </button>
        <button
          type="button"
          class="ui-button --cancel"
          @click="close()"
        >
          Cancelar
        </button>
      </template>
    </UiDialog>
  </div>
</template>

<style lang="scss">
.UiStory {
  --ui-story-transition-duration: var(--ui-duration-quick);
  position: relative;

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