export default {
  component: 'LayoutPage',
  slot: [
    {
      'component': 'InputSelect',
      'v-model': 'select',
      'props': {
        type: 'select-list',
        label: 'Escoge una',
        options: [
          {
            text: 'Si',
            value: '1',
          },
          {
            text: 'No',
            value: '0',
          },
        ],
      },
    },
    {
      'component': 'LayoutGroup',
      'props': { flex: 1 },
      'transition': true,
      'v-if': {
        and: [
          {
            op: 'enum.any',
            field: 'select',
            args: [
              '1',
            ],
          },
        ],
      },
      'slot': [
        {
          'component': 'MediaLoremIpsum',
          'props': {
            nParagraphs: 2,
            nWords: 56,
          },
          'id': 0,
          'transition': true,
          'v-if': null,
        },
        {
          component: 'MediaHtml',
          title: 'Text',
          props: { value: '<p>Texto debajo</p>' },
        },
      ],
    },
  ],
}