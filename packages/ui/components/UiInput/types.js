import { UiInputCode } from '../UiInputCode'
import { UiInputColorCss } from '../UiInputColorCss'
import { UiInputDateRange } from '../UiInputDateRange'
import { UiInputHtml } from '../UiInputHtml'
import { UiInputJson } from '../UiInputJson'
import { UiInputNumberSlide } from '../UiInputNumberSlide'
import { UiInputTimer } from '../UiInputTimer'
import { UiInputUrl } from '../UiInputUrl'
import { UiSelect } from '../UiSelect'
import { UiSelectButtons } from '../UiSelectButtons'
import { UiSelectList } from '../UiSelectList'
import { UiSelectNative } from '../UiSelectNative'
import { UiUpload } from '../UiUpload'

// import { TranslationInput } from '@/packages/i18n/components'
// !!! TranslationInput includes UiInput, leading to a circular dependency
// break dependency by declaring it async
import { defineAsyncComponent } from 'vue'
const TranslationInput = defineAsyncComponent(() => import('@/packages/i18n/components/TranslationInput/TranslationInput.vue'))

export default {
  'code': UiInputCode,
  'color-css': UiInputColorCss,
  'date-range': UiInputDateRange,
  'html': UiInputHtml,
  'json': UiInputJson,
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
