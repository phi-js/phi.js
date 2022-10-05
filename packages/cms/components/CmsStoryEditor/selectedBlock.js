/*
The currently selected Block (a singleton instance of SlotItem)
*/
import { shallowRef } from 'vue'

export const selectedBlock = shallowRef()

export function setSelectedBlock(SlotItem) {
  if (selectedBlock.value === SlotItem) {
    return
  }
  if (!selectedBlock.value) {
    registerBlurListeners()
  }
  selectedBlock.value = SlotItem
}

export function clearSelectedBlock() {
  selectedBlock.value = null
  unregisterBlurListeners()
}

function registerBlurListeners() {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onPressEscape)
}

function unregisterBlurListeners() {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onPressEscape)
}

function onClickOutside(event) {
  // clicked block's DOM element
  if (selectedBlock.value.$el.contains(event.target)) {
    return
  }
  clearSelectedBlock()
}

function onPressEscape(event) {
  if (event.keyCode === 27) {
    document.activeElement?.blur?.()
    clearSelectedBlock()
  }
}