<script setup>
import { nextTick, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  open: {
    type: [String, Number, Boolean],
    required: false,
    default: false,
  },

  trigger: {
    type: String,
    required: false,
    default: 'click', // 'click' | 'hover'
  },
})

const emit = defineEmits(['update:open'])

const isOpen = ref(false)

watch(
  () => props.open,
  (newValue) => isOpen.value = !!newValue,
  { immediate: true },
)

function open() {
  isOpen.value = true
  emit('update:open', isOpen.value)

  nextTick(() => {
    document.addEventListener('click', onClickOutside, true)
  })
}

function close() {
  document.removeEventListener('click', onClickOutside, true)
  isOpen.value = false
  emit('update:open', isOpen.value)

}

function toggle() {
  return isOpen.value ? close() : open()
}

let _ignoreNextClick = false
function onMouseenter() {
  if (props.trigger != 'hover') {
    return
  }

  open()
  _ignoreNextClick = true
  setTimeout(() => _ignoreNextClick = false, 420)
}

function onMouseleave() {
  if (props.trigger != 'hover') {
    return
  }

  close()
}

function onTriggerClick() {
  if (_ignoreNextClick) {
    _ignoreNextClick = false
    return
  }
  toggle()
}


const elContainer = ref()

function onClickOutside(event) {
  if (elContainer.value && elContainer.value.contains(event.target)) {
    return
  }
  close()
}

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside, true)
})
</script>

<template>
  <div
    ref="elContainer"
    class="UiDropdown"
    :class="{'UiDropdown--open': isOpen}"
    @mouseleave="onMouseleave"
  >
    <div
      v-if="$slots.trigger"
      class="UiDropdown__trigger"
      @mouseenter="onMouseenter"
      @click="onTriggerClick"
    >
      <slot
        name="trigger"
        :is-open="isOpen"
        :open="open"
        :close="close"
        :toggle="toggle"
      />
    </div>

    <div
      class="UiDropdown__container"
      @mouseleave="onMouseleave"
    >
      <div class="UiDropdown__body">
        <slot
          name="default"
          :close="close"
        />
      </div>
    </div>
  </div>
</template>