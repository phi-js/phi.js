export default {
  blocks: [
    {
      component: 'MediaHtml',
      props: { value: '<h2>Hola {{ nombre }}!</h2>' },
    },
    // {
    //   'component': 'InputText',
    //   'props': { placeholder: 'Nombre aqui' },
    //   'v-model': 'nombre',
    // },
    // {
    //   component: 'MediaHtml',
    //   props: { value: '<h2>Hola de nuevo {{ nombre }}!</h2>' },
    //   // 'v-if': true,
    // },
    {
      component: 'MediaHtml',
      props: { value: '<h2>{{users.length}} usuarios</h2><pre>selectedUser: {{selectedUser}}</pre>' },
      // 'v-if': {
      //   and: [
      //     {
      //       field: 'users.length',
      //       op: 'gte',
      //       args: '{{ limit }}',
      //     },
      //   ],
      // },
    },
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
        class: 'ui-clickable',
      },
      'v-for': 'users',
      'v-on': {
        click: {
          chain: [
            {
              do: {
                call: 'console.log',
                args: ['Clicked user {{$item.id}}', '{{$item}}'],
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
                  chain: [{
                    do: null,
                    assign: 'selectedUser',
                  } ],
                },
                else: {
                  chain: [{
                    do: '{{$item}}',
                    assign: 'selectedUser',
                  } ],
                },
              },
            },
            {
              // do: '{{selectedUser.name}}',
              do: '{{$item.name}}',
              assign: 'nombre',
            },
          ],
        },
      },
    },
    // {
    //   'component': 'MediaHtml',
    //   'props': {
    //     value: '<li><strong>{{$item.title}}</strong></li>',
    //     class: 'ui-clickable',
    //   },
    //   'v-for': 'posts',
    // },
    {
      component: 'MediaLoremIpsum',
      props: {
        nParagraphs: '{{ cantidad }}',
        nWords: '{{ palabras }}',
      },
    },
    {
      'component': 'InputButton',
      'props': { label: 'Test' },
      'v-on': {
        click: {
          chain: [
            {
              do: 'damn yu',
              assign: 'nombre',
            },
            {
              do: 'damn yu again',
              assign: 'nombre',
            },
            {
              do: 'damn yu again 2',
              assign: 'nombre',
            },
          ],
        },
      },
    },
  ],

  setup: {
    chain: [
      {
        info: { text: 'fetch users', icon: 'mdi:plus-network' },
        do: {
          call: 'fetch',
          args: { url: 'https://jsonplaceholder.typicode.com/users' },
        },
        assign: 'users',
      },
      {
        info: { text: 'fetch posts', icon: 'mdi:plus-network' },
        do: {
          call: 'fetch',
          args: { url: 'https://jsonplaceholder.typicode.com/posts' },
        },
        assign: 'posts',
      },
    ],
  },
}