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
                  component: 'MediaHtml',
                  props: { value: '<p>{{users.length}} usuarios</p><h1>{{selectedUser.name}}</h1><pre><code>{{selectedUser}}</code></pre>' },
                  id: 'block-1',
                  class: '',
                },
                {
                  component: 'MediaLoremIpsum',
                  props: {
                    nParagraphs: '{{ cantidad }}',
                    nWords: '{{ palabras }}',
                  },
                  id: 'block-3',
                  class: '',
                },
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