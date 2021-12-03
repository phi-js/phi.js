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
        },
        {
          component: 'LayoutColumn',
          slot: [
            {
              component: 'MediaImage',
              props: {
                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Phi_uc_lc.svg/170px-Phi_uc_lc.svg.png',
                align: 'left',
              },
            },
            {
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
        },
      ],
    },
  ],
}