import { computed, inject } from 'vue'
import useVmI18n from '../../i18n'
import { availableFunctions } from '../../plugins/registerPlugin.js'

export default function getAvailableStatements() {
  const injectedFunctions = inject('$_vm_functions', {})
  const i18n = useVmI18n()

  const items = computed(() => translateItem([
    ...(injectedFunctions.value || []),
    ...availableFunctions,
  ]))

  function translateItem(fxItem) {
    if (Array.isArray(fxItem)) {
      return fxItem.map(translateItem)
    }

    let stmt = fxItem.stmt || fxItem.expression// backwards compatibility

    if (!stmt && fxItem.name) {
      stmt = {
        call: fxItem.name,
        args: null,
      }
    }

    return ({
      ...fxItem,
      stmt,
      title: i18n.t(`VmExpression.${fxItem.name}.title`, null, fxItem.title || fxItem.name),
      description: i18n.t(`VmExpression.${fxItem.name}.description`, null, fxItem.description || ''),
      children: Array.isArray(fxItem.children) ? translateItem(fxItem.children) : undefined,
    })
  }

  return items
}
