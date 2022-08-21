import { useI18n } from '@/packages/i18n'
import * as dictionary from './dictionary.js'

export default function useVmI18n() {
  return useI18n(dictionary)
}