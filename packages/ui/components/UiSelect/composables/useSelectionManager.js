import { ref, watch } from 'vue'

export default function useSelectionManager(
  incomingValue,
  isMultiple,
  onValueChange = null,
) {
  const selection = ref([])
  watch(
    incomingValue,
    (newValue) =>
      (selection.value = Array.isArray(newValue)
        ? newValue.concat()
        : newValue !== undefined && newValue !== null
          ? [newValue]
          : []),
    { immediate: true },
  )

  function select(value) {
    let foundIndex = selection.value.indexOf(value)
    if (foundIndex >= 0) {
      return
    }
    if (isMultiple.value) {
      selection.value.push(value)
    } else {
      selection.value = [value]
    }
    emitChange()
  }

  function deselect(value) {
    selection.value.splice(selection.value.indexOf(value), 1)
    emitChange()
  }

  function isSelected(value) {
    return selection.value.indexOf(value) >= 0
  }

  function toggle(value) {
    return isSelected(value) ? deselect(value) : select(value)
  }

  function emitChange() {
    if (!onValueChange) {
      return
    }
    onValueChange(isMultiple.value ? selection.value : selection.value?.[0])
  }

  return { selection, isSelected, select, deselect, toggle }
}
