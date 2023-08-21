<script setup>
import { nextTick, ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '../UiInput'

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

  isWaiting: {
    type: [Boolean, String],
    required: false,
    default: false,
  },

  /* form attribute to be set to all <input>s (see https://www.w3schools.com/tags/att_form.asp)*/
  form: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:open', 'open', 'close'])

const refDialog = ref()
const isOpen = ref(false)

watch(
  () => props.open,
  (newValue) => {
    if (!refDialog.value) { // happens on "immediate" watch execution
      nextTick(() => newValue ? open() : close())
    } else {
      newValue ? open() : close()
    }
  },
  { immediate: true },
)

function open() {

  try {
    refDialog.value?.showModal?.()
  } catch (err) {
    // showModal() throws an exception when dialog is already open
  }
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

async function accept() {
  if (!props.onAccept) {
    return close()
  }
  const acceptResponse = await props.onAccept(refDialog.value)
  if (acceptResponse === false) {
    return
  }
  close()
}

async function cancel() {
  if (!props.onCancel) {
    return close()
  }

  const cancelResponse = await props.onCancel(refDialog.value)
  if (cancelResponse === false) {
    return
  }

  close()
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
      @cancel.prevent="cancel"
    >
      <form
        class="UiDialog__box"
        method="dialog"
        @submit.prevent="accept"
      >
        <div class="UiDialog__header">
          <slot
            name="header"
            :accept="accept"
            :cancel="cancel"
            :close="close"
          />
        </div>

        <div
          v-if="$slots.default"
          class="UiDialog__contents"
        >
          <slot
            name="default"
            :accept="accept"
            :cancel="cancel"
            :close="close"
          />
        </div>

        <footer class="UiDialog__footer">
          <slot
            name="footer"
            :accept="accept"
            :cancel="cancel"
            :close="close"
          >
            <UiInput
              v-if="props.onAccept"
              :form="props.form"
              class="UiDialog__acceptButton"
              type="submit"
              value="accept"
              :is-loading="props.isWaiting"
              v-text="i18n.t('Accept')"
            />
            <UiInput
              v-if="props.onCancel"
              :form="props.form"
              class="UiDialog__cancelButton UiButton--cancel"
              type="button"
              @click="cancel"
              v-text="i18n.t('Cancel')"
            />
            <UiInput
              v-else
              :form="props.form"
              class="UiDialog__cancelButton UiButton--cancel"
              type="button"
              @click="close"
              v-text="i18n.t('Close')"
            />
          </slot>
        </footer>
      </form>
    </dialog>
  </div>
</template>