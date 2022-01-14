import MediaLoremIpsum from './MediaLoremIpsum.vue'
import { UiForm } from '@/packages/ui/components'

export default {
  name: 'MediaLoremIpsum',
  title: 'Lorem Ipsum',
  icon: 'mdi:translate',
  description: 'Lorem ipsum dolor sit amet',

  block: {
    component: MediaLoremIpsum,
    props: {
      nParagraphs: 2,
      nWords: 56,
    },
  },

  editor: {
    toolbar: {
      'v-model': 'block',
      'component': UiForm,
      'props': {
        class: 'ui__group',
        fields: [
          {
            type: 'text',
            model: 'props.nParagraphs',
            size: 2,
          },
          {
            type: 'text',
            model: 'props.nWords',
            size: 2,
          },
        ],
      },
    },

    actions: [
      {
        'title': 'Editor de Lipsum',
        'component': UiForm,
        'v-model': 'block',
        'props': {
          fields: [
            {
              type: 'text',
              label: 'Cantidad de parrafos',
              model: 'props.nParagraphs',
            },
            {
              type: 'text',
              label: 'Cantidad de palabras',
              model: 'props.nWords',
            },
          ],
        },
      },
    ],
  },
}