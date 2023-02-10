import { inject } from 'vue'

export default function onBeforeSubmitPage(callback) {
  const _LayoutPage_onBeforeSubmit = inject('_LayoutPage_onBeforeSubmit', () => null)
  return _LayoutPage_onBeforeSubmit(callback)
}