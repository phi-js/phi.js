export default {
  theme: 'default',
  setup: {
    chain: [
      {
        info: {
          text: 'fetch users',
          icon: 'mdi:plus-network',
        },
        do: {
          call: 'fetch',
          args: { url: 'https://jsonplaceholder.typicode.com/users' },
        },
        assign: 'users',
      },
    ],
  },
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
                  'component': 'MediaItem',
                  'props': {
                    icon: 'mdi:badge-account',
                    text: '{{$item.name}}',
                    subtext: '{{$item.email}}',
                    badge: {
                      if: {
                        field: 'selectedUser.id',
                        op: 'eq',
                        args: '{{$item.id}}',
                      },
                      then: '1',
                      else: null,
                    },
                    class: 'ui--clickable',
                  },
                  'v-for': 'users',
                  'v-on': {
                    click: {
                      chain: [
                        {
                          do: {
                            call: 'console.log',
                            args: [
                              'Clicked user {{$item.id}}',
                              '{{$item}}',
                            ],
                          },
                        },
                        {
                          do: {
                            if: {
                              field: '$item.id',
                              op: 'eq',
                              args: '{{selectedUser.id}}',
                            },
                            then: {
                              chain: [
                                {
                                  do: null,
                                  assign: 'selectedUser',
                                },
                              ],
                            },
                            else: {
                              chain: [
                                {
                                  do: '{{$item}}',
                                  assign: 'selectedUser',
                                },
                              ],
                            },
                          },
                        },
                        {
                          do: '{{$item.name}}',
                          assign: 'nombre',
                        },
                      ],
                    },
                  },
                  'id': 'block-2',
                  'class': '',
                },
              ],
              id: 'col-0',
              flex: 384,
              title: 'Column 1',
              class: '',
              initialFlex: 323,
            },
            {
              id: 0,
              title: 'new column',
              flex: 913,
              class: '',
              blocks: [
                {
                  'v-for': 'users',
                  'component': 'MediaHtml',
                  'props': { value: '<h1>{{$item.name}}</h1>' },
                  'id': 'block-1',
                  'class': '',

                  'slot': [
                    {
                      component: 'MediaItem',
                      props: {
                        icon: 'mdi:badge-account',
                        text: '{{$item.name}}',
                        subtext: '{{$item.email}}',
                        class: 'ui--noselect',
                      },
                    },
                    {
                      'component': 'InputText',
                      'v-model': '$item.name',
                    },
                    {
                      'component': 'InputText',
                      'v-model': '$item.email',
                    },
                  ],

                },
                {
                  component: 'MediaLoremIpsum',
                  props: {
                    nParagraphs: '{{ cantidad }}',
                    nWords: '{{ palabras }}',
                    style: { border: '{{cantidad}}px solid red' },
                  },
                  id: 'block-3',
                  class: '',

                },
                {
                  'component': 'InputNumber',
                  'v-model': 'cantidad',
                  'props': { type: 'number' },
                },
                {
                  'component': 'InputNumber',
                  'v-model': 'palabras',
                  'props': { type: 'number' },
                },

                // {
                //   'v-for': 'users',
                //   'component': 'InputText',
                //   'v-model': '$item.name',
                // },
                // {
                //   'v-for': 'users',
                //   'component': 'InputText',
                //   'v-model': '$item.email',
                // },
              ],
              initialFlex: 974,
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