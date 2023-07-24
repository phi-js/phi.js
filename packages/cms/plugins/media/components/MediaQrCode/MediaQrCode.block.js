import UiQrCode from '@/packages/ui/components/UiQrCode/UiQrCode.vue'
import { UiForm } from '@/packages/ui/components'

export default {
  name: 'MediaQrCode',
  title: 'QR Code',
  icon: 'mdi:qrcode',

  block: {
    component: UiQrCode,
    props: {
      value: '',
      size: 100,
    },
  },

  editor: {
    actions: [
      {
        'id': 'MediaQrCode',
        'title': 'QR Code options',
        'component': UiForm,
        'v-model': 'block',
        'props': {
          fields: [
            {
              type: 'json',
              label: 'Data',
              model: 'props.value',
            },
            {
              type: 'number',
              label: 'Size',
              model: 'props.size',
            },
          ],
        },
      },
    ],
  },
}