import { ref, watch, getCurrentInstance } from 'vue'

export default function bindProp(propName, defaultObject = null) {
  const instance = getCurrentInstance()
  const proxy = ref({})
  var _halt = false
  var _xalt = false

  // watch prop changes
  watch(
    () => instance.props[propName],
    (newValue) => {
      if (_xalt) {
        _xalt = false
        return
      }
      _halt = true

      proxy.value = {
        ...defaultObject,
        ...JSON.parse(JSON.stringify(newValue || null))
      }
    },
    { immediate: true }
  )

  // watch proxy (local object) changes
  watch(
    () => proxy.value,
    (newValue) => {
      if (_halt) {
        _halt = false
        return
      }
      _xalt = true

      instance.emit(`update:${propName}`, newValue)
    },
    { immediate: true, deep: true }
  )

  return proxy
}
