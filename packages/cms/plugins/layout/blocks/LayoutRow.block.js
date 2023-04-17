export default {
  name: 'LayoutRow',
  title: 'Row',
  icon: 'mdi:view-column',

  block: {
    component: 'LayoutGroup',
    title: 'Row',
    props: {
      direction: 'row',
      style: {
        'display': 'flex',
        'flex-direction': 'row',
        'align-items': 'flex-start',
        'justify-contents': 'space-evenly',
      },
    },
    slot: [
      {
        component: 'MediaHtml',
        props: { value: '<h1>Heading</h1>' },
      },
    ],
  },

  staging: false,
}