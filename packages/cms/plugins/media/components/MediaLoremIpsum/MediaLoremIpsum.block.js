import MediaLoremIpsum from './MediaLoremIpsum.vue'
import CmsPropsForm from '../../../../components/CmsPropsForm/CmsPropsForm.vue'

export default {
  name: 'MediaLoremIpsum',
  title: 'Lorem Ipsum',
  icon: 'mdi:translate',
  description: 'Lorem ipsum dolor sit amet',

  block: {
    component: MediaLoremIpsum,
    props: {
      nParagraphs: '1',
      nWords: '44',
    },
  },

  editor: {
    // toolbar: {
    //   'v-model': 'block',
    //   'component': UiForm,
    //   'props': {
    //     class: 'UiGroup',
    //     fields: [
    //       {
    //         type: 'text',
    //         model: 'props.nParagraphs',
    //         size: 2,
    //       },
    //       {
    //         type: 'text',
    //         model: 'props.nWords',
    //         size: 2,
    //       },
    //     ],
    //   },
    // },

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