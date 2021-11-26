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
              id: 1,
              title: 'new column',
              flex: 407,
              class: '',
              blocks: [
                {
                  'id': 'added-bl-11',
                  'component': 'MediaVideo',
                  'v-model': 'video',
                  'v-model:activeChapters': 'chaps',
                  'props': {
                    url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/webcam-1636555992902.mkv',
                    chapters: [
                      {
                        name: 'uno',
                        start: 4672,
                        end: 9168,
                      },
                      {
                        name: 'dos',
                        start: 6111,
                        end: 9168,
                      },
                      {
                        name: 'tres',
                        start: 7333,
                        end: 9168,
                      },
                    ],
                  },
                },
              ],
              initialFlex: 426,
            },
            {
              blocks: [
                {
                  id: 'added-bl-11',
                  component: 'MediaImage',
                  props: {
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Phi_uc_lc.svg/170px-Phi_uc_lc.svg.png',
                    align: 'left',
                  },
                },
                {
                  'id': 'added-bl-15',
                  'component': 'MediaMath',
                  'props': { value: '{\\frac {a+b}{a}}={\\frac {a}{b}}=\\varphi' },
                  'v-if': {
                    and: [
                      {
                        op: 'enum.any',
                        field: 'chaps',
                        args: [
                          'uno',
                        ],
                      },
                    ],
                  },
                },
                {
                  'id': 'added-bl-16',
                  'component': 'MediaMath',
                  'props': { value: '{\\displaystyle {\\frac {a+b}{a}}={\\frac {a}{a}}+{\\frac {b}{a}}=1+{\\frac {b}{a}}=1+{\\frac {1}{\\varphi }}.}' },
                  'v-if': {
                    and: [
                      {
                        op: 'enum.any',
                        field: 'chaps',
                        args: [
                          'dos',
                        ],
                      },
                    ],
                  },
                },
                {
                  'id': 'added-bl-17',
                  'component': 'MediaMath',
                  'props': { value: '1+{\\frac {1}{\\varphi }}=\\varphi .' },
                  'v-if': {
                    and: [
                      {
                        op: 'enum.any',
                        field: 'chaps',
                        args: [
                          'tres',
                        ],
                      },
                    ],
                  },
                },
              ],
              id: 'col-0',
              flex: 907,
              title: 'Column 1',
              class: '',
              initialFlex: 888,
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