export default {
  text: 'Restaurante Vesubio',
  nodes: [
    {
      id: 'home',
      card: { text: 'Inicio' },
      page: {
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
                        component: 'MediaHtml',
                        props: { value: '<h1>Vesubio</h1>' },
                        id: 'block-0',
                        class: '',
                      },
                      {
                        'component': 'MediaItem',
                        'props': {
                          text: 'Menú del día',
                          icon: 'mdi:food',
                          class: 'ui--clickable',
                        },
                        'v-on': {
                          click: {
                            call: 'CmsStory.goTo',
                            args: 'menu',
                          },
                        },
                        'id': 'block-2',
                        'class': '',
                      },
                      {
                        'component': 'MediaItem',
                        'props': {
                          text: 'Entrantes',
                          icon: 'mdi:food',
                          class: 'ui--clickable',
                        },
                        'v-on': {
                          click: {
                            call: 'CmsStory.goTo',
                            args: 'entrantes',
                          },
                        },
                        'id': 'block-3',
                        'class': '',
                      },
                      {
                        'component': 'MediaItem',
                        'props': {
                          text: 'Primeros',
                          icon: 'mdi:food',
                          class: 'ui--clickable',
                        },
                        'v-on': {
                          click: {
                            call: 'CmsStory.goTo',
                            args: 'primeros',
                          },
                        },
                        'id': 'block-4',
                        'class': '',
                      },
                    ],
                    id: 'col-0',
                    flex: 353,
                    title: 'Column 1',
                    class: '',
                    initialFlex: 657,
                  },
                  {
                    id: 0,
                    title: 'new column',
                    flex: 961,
                    class: '',
                    blocks: [
                      {
                        component: 'MediaImage',
                        props: { src: 'https://picsum.photos/1024/300' },
                        id: 'block-1',
                        class: '',
                      },
                    ],
                    initialFlex: 657,
                  },
                ],
                id: 'row-0',
                title: 'Row 1',
                class: '',
              },
            ],
          },
        ],
      },
    },

    {
      id: 'menu',
      card: { text: 'Menú del dia' },
      page: {
        blocks: [
          {
            'component': 'InputButton',
            'props': { label: 'Regresar' },
            'v-on': {
              click: {
                call: 'CmsStory.goTo',
                args: 'home',
              },
            },
          },
          {
            component: 'MediaHtml',
            props: { value: '<h1>Menú del dia</h1><p> + componente de navegacion: </p>' },
          },
          { component: 'StoryNavigation' },
        ],
      },
    },

    {
      id: 'entrantes',
      card: { text: 'Entrantes' },
      page: {
        blocks: [
          {
            'component': 'InputButton',
            'props': { label: 'Regresar' },
            'v-on': {
              click: {
                call: 'CmsStory.goTo',
                args: 'home',
              },
            },
          },
          {
            component: 'MediaHtml',
            props: { value: '<h1>Entrantes</h1>' },
          },
          {
            component: 'MediaImage',
            props: { src: 'https://picsum.photos/800/600' },
          },
          {
            component: 'MediaImage',
            props: { src: 'https://picsum.photos/800/600' },
          },
        ],
      },
    },
  ],
}