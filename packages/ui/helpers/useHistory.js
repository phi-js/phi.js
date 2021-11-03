import { ref, watch, computed } from 'vue'

export default function useHistory(sourceRef, onEmit, timeout = 300) {
  console.log('useHistory ftw!', sourceRef)
  const history = []
  const pointer = ref(-1)
  let debounceTimeout = null
  let _halt = false

  // watch(
  //   sourceRef,
  //   (newValue) => {
  //     console.log('watch triggered')
  //     if (_halt) {
  //       _halt = false
  //       console.log('watch ignored')
  //       return
  //     }
  //     debouncePush(newValue)
  //   },
  //   { deep: true },
  // )

  function push(data) {
    console.log('do push')
    if (_halt) {
      _halt = false
      console.log('push halted')
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
    console.log('emitting change')

    clearTimeout(debounceTimeout)
    _halt = true
    onEmit(JSON.parse(JSON.stringify(value)))
  }

  function debouncePush(data) {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => push(data), timeout)
  }

  function undo() {
    console.log('undo')
    if (typeof history[pointer.value - 1] == 'undefined') {
      return
    }
    pointer.value--
    emit(history[pointer.value])
  }

  function redo() {
    console.log('undo')
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