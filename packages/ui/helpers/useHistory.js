import { ref, computed } from 'vue'

export default function useHistory(sourceRef, onEmit, timeout = 300) {
  const history = []
  const pointer = ref(-1)
  let debounceTimeout = null
  let _halt = false

  // watch(
  //   sourceRef,
  //   (newValue) => {
  //     if (_halt) {
  //       _halt = false
  //       return
  //     }
  //     debouncePush(newValue)
  //   },
  //   { deep: true },
  // )

  function push(data) {
    if (_halt) {
      _halt = false
      return
    }

    // Delete all items from the pointer onwards
    if (pointer.value > 0) {
      history.length = pointer.value + 1
    }

    history.push(JSON.parse(JSON.stringify(data)))
    pointer.value = history.length - 1
  }

  function emit(value) {
    clearTimeout(debounceTimeout)
    _halt = true
    onEmit(JSON.parse(JSON.stringify(value)))
  }

  function debouncePush(data) {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => push(data), timeout)
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
    push: debouncePush,
    pointer,
    hasUndo: computed(() => pointer.value > 0),
    hasRedo: computed(() => pointer.value < history.length - 1),
    undo,
    redo,
  }
}