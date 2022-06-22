<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
// import 'tippy.js/themes/light-border.css'

var tippyInstance = null

const elRoot = ref()
const elTrigger = ref()
const elTooltip = ref()

const props = defineProps({
  open: {
    type: Boolean,
    required: false,
    default: false,
  },

  /*
  Tippy placement attribute
  https://atomiks.github.io/tippyjs/#placements
  top, top-start, top-end
  right, right-start, right-end
  bottom, bottom-start, bottom-end
  left, left-start, left-end
  */
  placement: {
    type: String,
    required: false,
    default: 'bottom',
  },

  tippy: {
    type: Object,
    required: false,
    default: null,
  },

  trigger: {
    type: String,
    required: false,
    default: 'click',
  },
})

const emit = defineEmits(['update:open', 'open', 'close'])

onMounted(() => {
  tippyInstance = tippy(elTrigger.value, {
    plugins: [hideOnEsc],
    interactive: true,
    duration: [100, 50],
    content: elTooltip.value,
    trigger: 'manual',
    hideOnClick: false,
    placement: props.placement,
    arrow: true,
    inertia: true,
    maxWidth: 'none',
    onShow: () => {
      isOpen.value = true
      emit('update:open', true)
      emit('open')
    },
    onHide: () => {
      isOpen.value = false
      emit('update:open', false)
      emit('close')
    },

    appendTo: () => document.body,

    ...props.tippy,
  })
})

onUnmounted(() => tippyInstance.destroy())

const isOpen = ref(false)

watch(
  () => props.open,
  (newValue) => {
    isOpen.value = newValue
    if (tippyInstance) {
      newValue ? tippyInstance.show() : tippyInstance.hide()
    }
  },
  { immediate: true },
)

/*
Tippy plugin to hide on esc AND hide on click outside (since onHideClick doesn't work properly with trigger=manual)
*/
const hideOnEsc = {
  name: 'hideOnEsc',
  defaultValue: true,
  fn({ hide }) {
    function onKeyDown(event) {
      if (event.keyCode === 27) {
        hide()
      }
    }

    function onClickOutside(event) {
      if (elRoot.value.contains(event.target)) {
        return
      }

      // ojo, el contenido se pudo haber <Teleport> a body, asi que el click outside tiene que ....
      if (elTooltip.value.contains(event.target)) {
        return
      }

      hide()
    }

    return {
      onShow() {
        document.addEventListener('keydown', onKeyDown)
        document.addEventListener('click', onClickOutside)
      },
      onHide() {
        document.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('click', onClickOutside)
      },
    }
  },
}

function onTriggerClick() {
  if (props.trigger !== 'click') {
    return
  }

  isOpen.value = !isOpen.value
  isOpen.value ? tippyInstance.show() : tippyInstance.hide()
}

function open() {
  isOpen.value = true
  tippyInstance.show()
}

function close() {
  isOpen.value = false
  tippyInstance.hide()
}

function toggle() {
  isOpen.value ? close() : open()
}
</script>

<template>
  <div
    ref="elRoot"
    class="UiPopover"
  >
    <div
      ref="elTrigger"
      class="UiPopover__trigger"
      @click="onTriggerClick"
    >
      <slot
        name="trigger"
        :open="open"
        :close="close"
        :toggle="toggle"
      />
    </div>
    <div
      ref="elTooltip"
      class="UiPopover__tooltip"
    >
      <slot
        name="contents"
        :close="close"
      >
        <slot
          name="default"
          :close="close"
        />
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
.tippy-content {
  padding: 0;
}
</style>