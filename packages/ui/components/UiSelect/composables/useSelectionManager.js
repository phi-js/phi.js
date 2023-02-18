/*
Vue.js composable useSelectionManager
Returns an object containing functions and data related to managing selected items.

The function takes in three arguments: incomingValue, isMultiple, and onValueChange.

incomingValue is the input value that represents the current selection or an array of selected values.
isMultiple is a boolean that indicates whether the selection can contain multiple values or just a single value.
onValueChange is an optional callback function that is called whenever the selection changes.

The useSelectionManager function returns an object with the following properties:

selection: a reactive variable that holds an array of currently selected items.
isSelected(value): a function that takes a value as its argument and returns a boolean indicating whether that value is currently selected.
select(value): a function that adds a new value to the selection, replacing the old selection if isMultiple is false.
deselect(value): a function that removes a value from the selection array.
toggle(value): a function that toggles the selection state of a value between selected and deselected.
*/
import { ref, watch } from 'vue'

export default function useSelectionManager(incomingValue, isMultiple, onValueChange = null) {
  const selection = ref([])
  watch(
    incomingValue,
    (newValue) => {
      selection.value = Array.isArray(newValue)
        ? newValue.concat()
        : newValue !== undefined ? [newValue] : []
    },
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
