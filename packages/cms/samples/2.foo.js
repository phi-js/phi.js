// export default {
//   blocks: [
//     {
//       component: 'MediaHtml',
//       props: { value: '<h1>Hola {{nombre}}</h1>' },
//     },
//     {
//       component: 'MediaImage',
//       props: {
//         src: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
//         align: 'center',
//         width: 'auto',
//         href: 'https://phidias.co',
//       },
//     },
//   ],
// }

export default {
  theme: 'default',
  sections: [
    {
      id: 'section-0',
      class: '',
      rows: [
        {
          columns: [
            {
              blocks: [
                {
                  'id': 'added-bl-11',
                  'component': 'MediaVideo',
                  'v-model': 'video',
                  'v-model:activeChapters': 'capis',
                  'props': {
                    url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/webcam-1636372525001.mkv',
                    chapters: [
                      {
                        name: 'uno',
                        start: 1000,
                        end: 2000,
                      },
                      {
                        name: 'dos',
                        start: 2000,
                        end: 3000,
                      },
                      {
                        name: 'tres',
                        start: 3000,
                        end: 4000,
                      },
                    ],
                  },
                },
                {
                  id: 'added-bl-12',
                  component: 'MediaHtml',
                  title: 'Text',
                  props: { value: '<p>Capis: {{capis}}</p>' },
                  _suggested: true,
                },
                {
                  'id': 'added-bl-13',
                  'component': 'InputSelect',
                  'v-model': 'capis',
                  'props': {
                    type: 'select-list',
                    options: [
                      {
                        text: 'uno',
                        value: 'uno',
                      },
                      {
                        text: 'dos',
                        value: 'dos',
                      },
                      {
                        text: 'tres',
                        value: 'tres',
                      },
                    ],
                    multiple: true,
                  },
                },
                {
                  'id': 'added-bl-14',
                  'component': 'InputSelect',
                  'v-model': 'capis',
                  'props': { type: 'text' },
                },
                {
                  'id': 'added-bl-15',
                  'component': 'InputSelect',
                  'v-model': 'msg',
                  'props': { type: 'text' },
                },
              ],
              id: 'col-0',
              flex: 1,
              title: 'Column 1',
              class: '',
            },
          ],
          id: 'row-0',
          title: 'Row 1',
          class: '',
        },
      ],
    },
  ],
}