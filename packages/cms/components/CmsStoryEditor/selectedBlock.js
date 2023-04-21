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

  // The clicked element dissapeard on click.  So it was maybe a dialog or window.
  // in that case do not deselect the blodk
  if (!document.contains(event.target)) {
    return
  }

  if (document.querySelector('.CmsStoryBuilder__blockWindow')?.contains?.(event.target)) {
    return
  }

  // Do not clear selection if clicking inside .BlockScaffold__topArea
  if (document.getElementById('omg-testing')?.contains?.(event.target)) {
    return
  }

  // Do not clear selection if clicking inside .tippy-box
  if (document.querySelector('.tippy-box')?.contains?.(event.target)) {
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