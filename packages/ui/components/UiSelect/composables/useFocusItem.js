import { ref, computed, unref, watch, nextTick } from 'vue'

export default function useFocusItem(arrItems, refScrollContainer = null) {
  const focusedIndex = ref(0)
  const focusedItem = computed(
    () => unref(arrItems)?.[focusedIndex.value] || null
  )

  function setFocus(targetIndex) {
    focusedIndex.value = Math.max(
      0,
      Math.min(targetIndex, unref(arrItems).length - 1)
    )
  }

  function focusNext() {
    return setFocus(focusedIndex.value + 1)
  }

  function focusPrevious() {
    return setFocus(focusedIndex.value - 1)
  }

  if (refScrollContainer) {
    watch(focusedIndex, async () => {
      await nextTick
      unref(refScrollContainer)
        .querySelector(`:scope > :nth-child(${focusedIndex.value + 1})`)
        ?.scrollIntoView({
          block: 'nearest',
          inline: 'nearest'
        })
    })
  }

  return {
    focusedItem,
    setFocus,
    focusNext,
    focusPrevious
  }
}
