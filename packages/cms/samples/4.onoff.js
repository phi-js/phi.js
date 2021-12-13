export default {
  component: 'LayoutPage',
  slot: [
    {
      component: 'LayoutRow',
      slot: [
        {
          component: 'LayoutColumn',
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
              'id': 0,
            },
          ],
        },
      ],
      id: 0,
    },
    {
      'component': 'LayoutRow',
      'slot': [
        {
          component: 'LayoutColumn',
          props: { flex: 1 },
          slot: [
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
              _suggested: true,
              id: 1,
            },
          ],
        },
      ],
      'id': 1,
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
    },
  ],
}