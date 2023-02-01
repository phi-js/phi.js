<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from '@/packages/i18n'

const i18n = useI18n()

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

  showCloseButton: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['update:open', 'open', 'close'])

const refDialog = ref()

const isOpen = ref(false)

onMounted(() => {
  isOpen.value = !!props.open
  if (isOpen.value) {
    refDialog.value?.showModal?.()
    document.body.style.overflow = 'hidden'
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
      document.body.style.overflow = 'hidden'
    } else if (refDialog.value) {
      refDialog.value?.close?.()
      document.body.style.overflow = null
    }
  },
  // { immediate: true },
)

function open() {
  refDialog.value?.showModal?.()
  document.body.style.overflow = 'hidden'
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
      <div class="UiDialog__box">
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

        <slot
          name="footer"
          :close="close"
        >
          <footer
            v-if="showCloseButton"
            class="UiDialog__footer"
          >
            <button
              class="UiDialog__closeButton UiButton UiButton--cancel"
              type="button"
              @click="close"
              v-text="i18n.t('Close')"
            />
          </footer>
        </slot>
      </div>
    </dialog>
  </div>
</template>

<style lang="scss">
.UiDialog {
  &__dialog {
    width: 600px;

    border: 0;
    border-radius: 5px;
    background-color: var(--ui-color-background);
    color: var(--ui-color-foreground);
    padding: 0;
    overflow: visible; // allows UiPopover inside dialog to show correctly
    margin-top: 8vh;

    &::backdrop {
      background: rgba(0,0,0, 0.6);
    }
  }

  &__box {
    max-height: 82vh;
    display: flex;
    flex-direction: column;
  }

  &__contents {
    flex: 1;

    overflow: auto;
    // &::-webkit-scrollbar {
    //   width: 7px;
    // }

    // &::-webkit-scrollbar-thumb {
    //   background-color: rgba(255,255,255, 0.1);
    //   border-radius: 6px;
    // }

    // &:hover::-webkit-scrollbar-thumb {
    //   background-color: #ccc;
    // }
  }

  &__footer {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 4px;
  }

  &__closeButton {
    margin-left: auto;
  }
}
</style>