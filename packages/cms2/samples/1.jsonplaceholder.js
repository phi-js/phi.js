export default {
  component: 'LayoutPage',

  setup: {
    chain: [
      {
        info: {
          text: 'fetch users',
          icon: 'mdi:plus-network',
        },
        do: {
          call: 'fetch',
          args: { url: 'https://jsonplaceholder.typicode.com/users?_limit=2' },
        },
        assign: 'users',
      },
    ],
  },

  slot: [
    {
      component: 'LayoutRow',
      slot: [
        {
          component: 'LayoutColumn',
          slot: [
            {
              component: 'MediaHtml',
              props: { value: '<h1>JsonPlaceholder User manager</h1>' },
            },
          ],
        },
      ],
    },

    {
      'v-for': 'users',
      'component': 'LayoutRow',
      'slot': [
        {
          component: 'LayoutColumn',
          props: { flex: 1 },
          slot: [
            {
              'component': 'InputText',
              'v-model': '$item.name',
              'props': { label: 'Nombre' },
            },
            {
              'component': 'InputText',
              'v-model': '$item.email',
              'props': { label: 'eMail' },
            },
          ],
        },
        {
          component: 'LayoutColumn',
          props: { flex: 2 },
          slot: [
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
              'component': 'InputButton',
              'props': {
                type: 'button',
                label: 'Guardar',
              },
              'v-on': {
                click: {
                  chain: [
                    {
                      info: {
                        text: 'save user',
                        icon: 'mdi:plus-network',
                      },
                      do: {
                        call: 'fetch',
                        args: {
                          url: 'https://jsonplaceholder.typicode.com/users/{{$item.id}}',
                          options: {
                            method: 'patch',
                            body: '{{$item}}',
                          },
                        },
                      },
                      assign: '$item',
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  ],
}