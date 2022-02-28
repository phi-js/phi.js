export default [
  {
    id: 'theme1',
    name: 'Empowered teacher',
    description: 'Lorem ipsum dolor sit amet asldk fja dkjfha slkfdjha sdlkfhas ldkfjhsdlkfjhasldkjf ahkljs fkajlbsdf kjashdfkj haskdlf haskldf haslkjf halksdfh akjf aaasd ',
    thumbnail: 'https://static1.squarespace.com/static/images/5dd2c5c0ce90f5420a82e1f2?format=500w',
    css: `
      .LayoutPage {
        border: 3px solid purple;
        --ui-content-width: 1024px;
        --ui-color-primary: blue;
      }

      .story-html h1 {
        color: purple;
      }

      .story-html p {
        margin: 0;
      }
    `,

    classes: [
      {
        class: 'FullHeight',
        text: 'Altura completa',
        subtext: 'Hacer que la fila ocupe la altura completa de la pantalla',
        css: `
          .FullHeight {
            height: 100vh;
          }
        `,
        blocks: ['LayoutRow'],
      },

      {
        class: 'BlockCard',
        text: 'Tarjeta',
        subtext: 'Fondo sombreado',
        css: `
          .BlockCard {
            box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
            padding: 8px;
          }
        `,
        blocks: ['LayoutRow'],
      },
    ],
  },

  {
    id: 'theme2',
    name: 'Drunk woman',
    description: 'Lorem ipsum dolor sit amet asldk fja dkjfha slkfdjha sdlkfhas ldkfjhsdlkfjhasldkjf ahkljs fkajlbsdf kjashdfkj haskdlf haskldf haslkjf halksdfh akjf aaasd ',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce9ecb4ae4182acc76c841?format=500w',
    css: `
      .LayoutPage {
        border: 2px solid orange;
        --ui-content-width: 50%;
      }

      .story-html h1 {
        color: orange;
      }

      .story-html p {
        margin: 1em 0;
      }

      .RowX {
        background-color: rgba(0,0,0, 0.05);
        --ui-content-width: auto;
      }
  `,
  },

  {
    id: 'theme3',
    name: 'Architecture firm',
    description: 'Lorem ipsum dolor sit amet asldk fja dkjfha slkfdjha sdlkfhas ldkfjhsdlkfjhasldkjf ahkljs fkajlbsdf kjashdfkj haskdlf haskldf haslkjf halksdfh akjf aaasd ',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce9e719c39bf265866e6a0?format=500w',
    css: `
      .LayoutPage {
        --ui-content-width: 70%;
        --ui-color-primary: blue;
      }

      .story-html h1 {
        color: var(--ui-color-primary);
      }

      .story-html p {
        margin: 1em 0;
      }
  `,
  },

  {
    id: 'theme4',
    name: 'Hipster blog',
    description: 'Lorem ipsum dolor sit amet asldk fja dkjfha slkfdjha sdlkfhas ldkfjhsdlkfjhasldkjf ahkljs fkajlbsdf kjashdfkj haskdlf haskldf haslkjf halksdfh akjf aaasd ',
    thumbnail: 'https://static1.squarespace.com/static/images/5dcdaf58bd95e63be015ec26?format=500w',
  },

  {
    id: 'theme5',
    name: 'Catchy design No. 5',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dd2a8bc2ed49f029ebca185?format=500w',
  },
  {
    id: 'theme6',
    name: 'Catchy design No. 6',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dcdabeb58ca2746afd71f36?format=500w',
  },
  {
    id: 'theme7',
    name: 'Catchy design No. 7',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce9e1fd7c37454bcbea40c?format=500w',
  },
  {
    id: 'theme8',
    name: 'Catchy design No. 8',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce9f131a9b990037c4143d?format=500w',
  },
  {
    id: 'theme9',
    name: 'Catchy design No. 9',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dd2ab32649b54696546a9b0?format=500w',
  },
  {
    id: 'theme10',
    name: 'Catchy design No. 0',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dcdb235bd95e63be016297f?format=500w',
  },
  {
    id: 'theme11',
    name: 'Catchy design No. 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce9f4d2288341b18da0acf?format=500w',
  },
  {
    id: 'theme12',
    name: 'Catchy design No. 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dcda2f45642dc01219e676e?format=500w',
  },
  {
    id: 'theme13',
    name: 'Catchy design No. 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce9c42ded6bc4dbf7f534f?format=500w',
  },
  {
    id: 'theme14',
    name: 'Catchy design No. 4',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce9b77be6b8f27bb365451?format=500w',
  },
  {
    id: 'theme15',
    name: 'Catchy design No. 5',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dcee431f4a43b2d8c504ea7?format=500w',
  },
  {
    id: 'theme16',
    name: 'Catchy design No. 6',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce99f81a9b990037c3dcd5?format=500w',
  },
  {
    id: 'theme17',
    name: 'Catchy design No. 7',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce9bca4a2f6b4b1c4b4c5a?format=500w',
  },
  {
    id: 'theme18',
    name: 'Catchy design No. 8',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce9a7a4a2f6b4b1c4b3e27?format=500w',
  },
  {
    id: 'theme19',
    name: 'Catchy design No. 9',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce99598faea2040d33a697?format=500w',
  },
  {
    id: 'theme20',
    name: 'Catchy design No. 0',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce9d940b827213edfeab81?format=500w',
  },
  {
    id: 'theme21',
    name: 'Catchy design No. 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dd2db3ff8402f09886c6d07?format=500w',
  },
  {
    id: 'theme22',
    name: 'Catchy design No. 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dcee49ce0772e173c40d0f8?format=500w',
  },
  {
    id: 'theme23',
    name: 'Catchy design No. 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce9b2e1a9b990037c3e7ce?format=500w',
  },
  {
    id: 'theme24',
    name: 'Catchy design No. 4',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dce9f7f2288341b18da0d47?format=500w',
  },
  {
    id: 'theme25',
    name: 'Catchy design No. 5',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    thumbnail: 'https://static1.squarespace.com/static/images/5dcdbfd0c2627411a293bdf1?format=500w',
  },
]