const MediaLoremIpsum = () => import('./MediaLoremIpsum.vue')
import { UiForm } from '/packages/ui/components'

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
        inline: true,
        fields: [
          {
            type: 'text',
            label: 'Cantidad de parrafos',
            model: 'props.nParagraphs',
            props: {
              size: 2,
              style: 'width: 80px',
            },
          },
          {
            type: 'text',
            label: 'Cantidad de palabras',
            model: 'props.nWords',
            props: {
              size: 3,
              style: 'width: 80px',
            },
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