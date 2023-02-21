/* eslint-disable max-len */
// import { UiInputCode } from '../UiInputCode'
// import { UiInputColorCss } from '../UiInputColorCss'
// import { UiInputDateRange } from '../UiInputDateRange'
// import { UiInputHtml } from '../UiInputHtml'
// import { UiInputJson } from '../UiInputJson'
// import { UiInputNumberSlide } from '../UiInputNumberSlide'
// import { UiInputTimer } from '../UiInputTimer'
// import { UiInputUrl } from '../UiInputUrl'
// import { UiSelect } from '../UiSelect'
// import { UiSelectButtons } from '../UiSelectButtons'
// import { UiSelectList } from '../UiSelectList'
// import { UiSelectNative } from '../UiSelectNative'
// import { UiUpload } from '../UiUpload'

// import { TranslationInput } from '@/packages/i18n/components'
// !!! TranslationInput includes UiInput, leading to a circular dependency
// break dependency by declaring it async

import { defineAsyncComponent } from 'vue'

const TranslationInput = defineAsyncComponent(() => import('@/packages/i18n/components/TranslationInput/TranslationInput.vue'))
const UiInputCode = defineAsyncComponent(() => import('../UiInputCode/UiInputCode.vue'))
const UiInputColorCss = defineAsyncComponent(() => import('../UiInputColorCss/UiInputColorCss.vue'))
const UiInputDateRange = defineAsyncComponent(() => import('../UiInputDateRange/UiInputDateRange.vue'))
const UiInputHtml = defineAsyncComponent(() => import('../UiInputHtml/UiInputHtml.vue'))
const UiInputJson = defineAsyncComponent(() => import('../UiInputJson/UiInputJson.vue'))
const UiInputNumberSlide = defineAsyncComponent(() => import('../UiInputNumberSlide/UiInputNumberSlide.vue'))
const UiInputTimer = defineAsyncComponent(() => import('../UiInputTimer/UiInputTimer.vue'))
const UiInputUrl = defineAsyncComponent(() => import('../UiInputUrl/UiInputUrl.vue'))
const UiSelect = defineAsyncComponent(() => import('../UiSelect/UiSelect.vue'))
const UiSelectButtons = defineAsyncComponent(() => import('../UiSelectButtons/UiSelectButtons.vue'))
const UiSelectCountry = defineAsyncComponent(() => import('../UiSelectCountry/UiSelectCountry.vue'))
const UiSelectList = defineAsyncComponent(() => import('../UiSelectList/UiSelectList.vue'))
const UiSelectNationality = defineAsyncComponent(() => import('../UiSelectNationality/UiSelectNationality.vue'))
const UiSelectNative = defineAsyncComponent(() => import('../UiSelectNative/UiSelectNative.vue'))
const UiUpload = defineAsyncComponent(() => import('../UiUpload/UiUpload.vue'))


export default {
  'code': UiInputCode,
  'color-css': UiInputColorCss,
  'country': UiSelectCountry,
  'date-range': UiInputDateRange,
  'html': UiInputHtml,
  'json': UiInputJson,
  'nationality': UiSelectNationality,
  'number-slide': UiInputNumberSlide,
  'select-buttons': UiSelectButtons,
  'select-list': UiSelectList,
  'select-native': UiSelectNative,
  'select': UiSelect,
  'timer': UiInputTimer,
  'translation': TranslationInput,
  'upload': UiUpload,
  'url': UiInputUrl,
}
