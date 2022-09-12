<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  open: {
    type: [String, Number, Boolean],
    required: false,
    default: false,
  },
})

const emit = defineEmits(['update:open'])

const isOpen = ref(false)

watch(
  () => props.isOpen,
  (newValue) => isOpen.value = !!newValue,
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

function toggle() {
  return isOpen.value ? close() : open()
}

let _ignoreNextClick = false
function onMouseenter() {
  open()
  _ignoreNextClick = true
  setTimeout(() => _ignoreNextClick = false, 420)
}

function onMouseleave() {
  close()
}

function onTriggerClick() {
  if (_ignoreNextClick) {
    _ignoreNextClick = false
    return
  }
  toggle()
}
</script>

<template>
  <div
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
        :isOpen="isOpen"
        :open="open"
        :close="close"
        :toggle="toggle"
      />
    </div>

    <div
      class="UiDropdown__container"
      @mouseleave="close"
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