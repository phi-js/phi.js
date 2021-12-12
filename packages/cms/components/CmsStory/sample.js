import page1 from '../../samples/1.jsonplaceholder.js'
import page2 from '../../samples/2.video.js'

export default {
  title: 'My Story',
  pages: [
    {
      id: 'start',
      component: 'LayoutPage',
      props: { path: 'zero' },
      slot: [
        {
          component: 'LayoutRow',
          slot: [
            {
              component: 'LayoutColumn',
              slot: [
                {
                  component: 'MediaHtml',
                  props: { value: '<h1>Page one</h1>' },
                },
                {
                  'component': 'InputSelect',
                  'v-model': 'temas',
                  'props': {
                    label: 'Temas',
                    type: 'select-list',
                    multiple: true,
                    options: [
                      { text: 'Matermaticas', value: 'math' },
                      { text: 'Quimica', value: 'chem' },
                      { text: 'Sociales', value: 'soc' },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      'id': 'page1',
      'v-if': {
        field: 'temas',
        op: 'enum.any',
        args: ['math'],
      },
      ...page1,
    },
    {
      id: 'page1b',
      ...page1,
    },
    {
      'id': 'page2',
      'v-if': {
        field: 'temas',
        op: 'enum.any',
        args: ['chem'],
      },
      ...page2,
    },
    {
      'id': 'page3',
      'v-if': {
        field: 'temas',
        op: 'enum.any',
        args: ['soc'],
      },
      ...page2,
    },
  ],

  paths: [
    { from: 'start', to: 'page1', text: 'Ir a matemáticas' },
    { from: 'page1', to: 'page2', text: 'Revisar Química' },
    { from: 'page1', to: 'page1b', text: 'Secreto' },
    { from: 'page1b', to: 'page2', text: 'Siguiente' },
    { from: 'page2', to: 'page3', text: 'Repasar sociales' },
    // { from: 'page3', to: 'start', text: 'Back to start' },
  ],
}