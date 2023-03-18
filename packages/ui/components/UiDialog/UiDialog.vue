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

  onAccept: {
    type: Function,
    required: false,
    default: null,
  },

  onCancel: {
    type: Function,
    required: false,
    default: null,
  },

  tabindex: {
    type: [String, Number],
    required: false,
    default: '',
  },

  // Show a close button
  closeButton: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const emit = defineEmits(['update:open', 'open', 'close', 'accept', 'cancel'])

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
    if (isOpen.value === newValue) {
      return
    }
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
}

async function onDialogClose($event) {
  if (!$event.target.returnValue && props.onCancel) {
    let res = await props.onCancel()
    if (res !== undefined && !res) {
      return
    }
  }

  if ($event.target.returnValue == 'accept' && props.onAccept) {
    await props.onAccept()
  }

  $event.target.returnValue = '' // reset dialog's returnValue

  document.body.style.overflow = null
  isOpen.value = false
  emit('update:open', isOpen.value)
  emit('close')
}
</script>

<template>
  <div
    class="UiDialog"
    :class="{ 'UiDialog--open': isOpen }"
  >
    <div
      v-if="$slots.trigger || $slots.summary"
      class="UiDialog__trigger"
      :tabindex="tabindex"
      @click="open()"
      @keypress.enter.prevent="open()"
    >
      <slot
        name="trigger"
        :is-open="isOpen"
        :open="open"
        :close="close"
      />

      <!-- for naming convenience, switching between UiDetails -->
      <slot
        name="summary"
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
          <form
            v-if="onAccept || onCancel || closeButton"
            class="UiDialog__footer"
            method="dialog"
          >
            <button
              v-if="onAccept"
              class="UiDialog__acceptButton UiButton UiButton--main"
              type="submit"
              value="accept"
              v-text="i18n.t('Accept')"
            />
            <button
              v-if="onCancel"
              class="UiDialog__cancelButton UiButton UiButton--cancel"
              type="submit"
              v-text="i18n.t('Cancel')"
            />
            <button
              v-else-if="closeButton"
              class="UiDialog__cancelButton UiButton UiButton--cancel"
              type="submit"
              v-text="i18n.t('Close')"
            />
          </form>
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
    background-color: var(--ui-color-z1);
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
  }

  &__footer {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 4px;
  }

  &__cancelButton {
    margin-left: auto;
  }
}
</style>