<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
const props = defineProps({
  open: {
    type: Boolean,
    required: false,
    default: false,
  },

  onCancel: {
    type: Function,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:open'])

const isOpen = ref(false)
watch(
  () => props.open,
  (newValue) => isOpen.value = newValue,
  { immediate: true },
)

function open() {
  isOpen.value = true
  emit('update:open', isOpen.value)
}

function close() {
  isOpen.value = false
  emit('update:open', isOpen.value)
}

async function cancel() {
  if (props.onCancel) {
    let res = await props.onCancel()
    if (res !== undefined && !res) {
      return
    }
  }
  return close()
}

function escapeListener(event) {
  if (event?.key === 'Escape') {
    cancel()
  }
}

watch(
  isOpen,
  (newValue) => {
    if (newValue) {
      document.addEventListener('keydown', escapeListener)
    } else {
      document.removeEventListener('keydown', escapeListener)
    }
  },
  { immediate: true },
)

const widgetEl = ref()
// onMounted(() => {
//   document.body.appendChild(widgetEl.value)
// })
// onUnmounted(() => {
//   try {
//     document.body.removeChild(widgetEl.value)
//   } catch (e) {
//     // El elemento ya estaba desmontado (?)  pasa en casos cuando se usa <ui-dialog v-if="XXX">
//   }
// })
</script>

<template>
  <div
    class="UiDialog"
    :class="{'UiDialog--open': isOpen}"
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

    <transition name="UiDialog__transition">
      <div
        v-show="isOpen"
        ref="widgetEl"
        class="UiDialog__widget"
      >
        <div
          class="UiDialog__scrim"
          @click="cancel()"
        />

        <div class="UiDialog__container">
          <div
            v-if="$slots.header"
            class="UiDialog__header"
          >
            <slot
              name="header"
              :close="close"
            />
          </div>

          <div
            v-if="$slots.contents"
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
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.UiDialog {
  &__widget {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 4; // !!! se pelea con el z-index de UiWindow (y otros elementos "fixed")

    display: flex;
    justify-content: center;
    align-items: baseline;
    padding-top: 10%;
  }

  &__scrim {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);

    z-index: -1;
  }

  &__container {
    display: flex;
    flex-direction: column;

    width: 90vw;
    max-width: 1000px;
    max-height: 80%;
    overflow: hidden;

    background-color: #fff;
    border-radius: var(--ui-radius);
  }

  &__contents {
    flex: 1;
    overflow: auto;
    padding: var(--ui-padding);
    max-height: 800px;
  }

  &__footer {
    text-align: right;
    padding: var(--ui-padding);
    background-color: var(--ui-color-darken);
  }

  &__transition {
    &-enter-active,
    &-leave-active {
      transition: opacity var(--ui-duration-snap);
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
    }
  }
}
</style>