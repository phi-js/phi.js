import MediaLoremIpsum from './MediaLoremIpsum.vue'
import CmsPropsForm from '../../../../components/CmsPropsForm/CmsPropsForm.vue'
import { UiForm } from '@/packages/ui'

export default {
  name: 'MediaLoremIpsum',
  title: 'Lorem Ipsum',
  icon: 'mdi:translate',
  description: 'Lorem ipsum dolor sit amet',

  block: {
    component: MediaLoremIpsum,
    props: {
      nParagraphs: '1',
      nWords: '120',
    },
  },

  editor: {
    toolbar: {
      'v-model': 'block',
      'component': UiForm,
      'props': {
        class: 'UiGroup',
        fields: [
          {
            type: 'number',
            model: 'props.nParagraphs',
            size: 2,
          },
          {
            type: 'number',
            model: 'props.nWords',
            size: 2,
          },
        ],
      },
    },

    actions: [
      {
        'id': 'paragraphs',
        'title': 'Paragraphs',
        'component': CmsPropsForm,
        'v-model': 'block',
        'props': {
          fields: [
            {
              type: 'number',
              label: 'Cantidad de parrafos',
              model: 'props.nParagraphs',
            },
            {
              type: 'number',
              label: 'Cantidad de palabras',
              model: 'props.nWords',
            },
          ],
        },
      },
    ],
  },
}