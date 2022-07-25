<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  open: {
    type: [String, Number, Boolean],
    required: false,
    default: false,
  },

  onCancel: {
    type: Function,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:open', 'open', 'close'])

const refDialog = ref()

const isOpen = ref(false)

onMounted(() => {
  isOpen.value = !!props.open
  if (isOpen.value) {
    refDialog.value?.showModal?.()
    document.body.style.overflow = 'clip'
  } else if (refDialog.value) {
    refDialog.value?.close?.()
    document.body.style.overflow = null
  }
})

watch(
  () => props.open,
  (newValue) => {
    isOpen.value = !!newValue
    if (isOpen.value) {
      refDialog.value?.showModal?.()
      document.body.style.overflow = 'clip'
    } else if (refDialog.value) {
      refDialog.value?.close?.()
      document.body.style.overflow = null
    }
  },
  // { immediate: true },
)

function open() {
  refDialog.value?.showModal?.()
  document.body.style.overflow = 'clip'
  isOpen.value = true
  emit('update:open', isOpen.value)
  emit('open')
}

function close() {
  refDialog.value?.close?.()
  document.body.style.overflow = null
  isOpen.value = false
  emit('update:open', isOpen.value)
  emit('close')
}

async function onDialogClose($event) {
  if (!$event.target.returnValue) {
    if (props.onCancel) {
      let res = await props.onCancel()
      if (res !== undefined && !res) {
        return
      }
    }
  }

  return close()
}
</script>

<template>
  <div
    class="UiDialog"
    :class="{ 'UiDialog--open': isOpen }"
  >
    <div
      v-if="$slots.trigger"
      class="UiDialog__trigger"
      @click="open()"
    >
      <slot
        name="trigger"
        :is-open="isOpen"
        :open="open"
        :close="close"
      />
    </div>

    <dialog
      ref="refDialog"
      class="UiDialog__dialog"
      @close="onDialogClose"
    >
      <div class="UiDialog__header">
        <slot
          name="header"
          :close="close"
        />
      </div>

      <div
        v-if="$slots.contents || $slots.default"
        class="UiDialog__contents"
      >
        <slot
          name="contents"
          :close="close"
        />
        <slot
          name="default"
          :close="close"
        />
      </div>

      <div
        v-if="$slots.footer"
        class="UiDialog__footer"
      >
        <slot
          name="footer"
          :close="close"
        />
      </div>
      <button
        v-else
        class="UiDialog__btnClose"
        @click="close"
      >
        &times;
      </button>
    </dialog>
  </div>
</template>

<style lang="scss">
.UiDialog {
  &__dialog {
    z-index: 1;

    border: 0;
    border-radius: 5px;
    background-color: var(--ui-color-background);
    color: var(--ui-color-foreground);

    // min-width: 500px;
    max-width: 70vw;

    &::backdrop {
      background: rgba(0,0,0, 0.5);
    }

    position: relative;

    &::-webkit-scrollbar {
      width: 7px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255,255,255, 0.1);
      border-radius: 6px;
    }

    &:hover::-webkit-scrollbar-thumb {
      background-color: #ccc;
    }

  }

  &__btnClose {
    position: absolute;
    top: 2px;
    right: 2px;

    background: transparent;
    color: inherit;
    border: 0;
    padding: 8px 12px;
    border-radius: 5px;

    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }
  }
}
</style>