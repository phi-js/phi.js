import { ref, computed } from 'vue'

export default function useUndo(initialValue, onEmit) {
  const history = [
    JSON.parse(JSON.stringify(initialValue)),
  ]
  const pointer = ref(0)
  let debounceTimeout = null

  function push(newData, debounce = 0) {
    if (debounce > 0) {
      clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => _push(newData), debounce)
    } else {
      _push(newData)
    }
  }

  function _push(data) {
    // Delete all items from the pointer onwards
    if (pointer.value > 0) {
      history.length = pointer.value + 1
    }

    history.push(JSON.parse(JSON.stringify(data)))
    pointer.value = history.length - 1
  }

  function emit(value) {
    clearTimeout(debounceTimeout)
    onEmit(JSON.parse(JSON.stringify(value)))
  }

  function undo() {
    if (typeof history[pointer.value - 1] == 'undefined') {
      return
    }
    pointer.value--
    emit(history[pointer.value])
  }

  function redo() {
    if (typeof history[pointer.value + 1] == 'undefined') {
      return
    }
    pointer.value++
    emit(history[pointer.value])
  }

  return {
    push,
    pointer,
    hasUndo: computed(() => pointer.value > 0),
    hasRedo: computed(() => pointer.value < history.length - 1),
    undo,
    redo,
  }
}