<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'

var tippyInstance = null
const elTrigger = ref()
const elTooltip = ref()

const props = defineProps({
  open: {
    type: Boolean,
    required: false,
    default: false,
  },

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
})

const emit = defineEmits(['update:open', 'open', 'close'])

onMounted(() => {
  tippyInstance = tippy(elTrigger.value, {
    plugins: [hideOnEsc],
    interactive: true,
    duration: [100, 50],
    content: elTooltip.value,
    trigger: 'click',
    placement: props.placement,
    arrow: true,
    inertia: true,
    maxWidth: 'none',
    onShow: () => {
      emit('update:open', true)
      emit('open')
    },
    onHide: () => {
      emit('update:open', false)
      emit('close')
    },

    ...props.tippy,
  })
})

onUnmounted(() => tippyInstance.destroy())

function close() {
  tippyInstance.hide()
}

watch(
  () => props.open,
  (newValue) => {
    if (!newValue) {
      tippyInstance.hide()
    }
  },
)

const hideOnEsc = {
  name: 'hideOnEsc',
  defaultValue: true,
  fn({ hide }) {
    function onKeyDown(event) {
      if (event.keyCode === 27) {
        hide()
      }
    }

    return {
      onShow() {
        document.addEventListener('keydown', onKeyDown)
      },
      onHide() {
        document.removeEventListener('keydown', onKeyDown)
      },
    }
  },
}

</script>

<template>
  <div
    class="UiPopover"
  >
    <div
      ref="elTrigger"
      class="UiPopover__trigger"
    >
      <slot
        name="trigger"
        :close="close"
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