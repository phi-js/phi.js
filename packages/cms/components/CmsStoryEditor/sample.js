export default {
  id: 'website',
  title: 'Website',
  i18n: {
    en: {
      title: 'Website',
      edit: 'Edit this website',
    },
    es: {
      title: 'Sitio web',
      edit: 'Editar este sitio web',
    },
  },
  pages: [
    {
      component: 'LayoutPage',
      id: 'start',
      title: 'Start',
      hash: 'start',
      slots: {
        default: [
          {
            component: 'MediaHtml',
            props: {
              value: { $i18n: { en: '<h1>Hello World!</h1>' } },
              style: {
                'padding': '80px 42px 24px 42px',
                'background-image': 'url(http://phi.local/build/covers/trianglify-cyan.png)',
                'background-size': 'cover',
                'color': '#000000',
                'border-radius': '10px',
                'background-repeat': 'no-repeat',
              },
              class: [
                'header-block',
              ],
            },
          },
          {
            component: 'NavigationMenu',
            props: {
              items: [
                {
                  href: '#/start',
                  text: 'Start',
                },
                {
                  href: '#/one',
                  text: 'One',
                },
                {
                  href: '#/two',
                  text: 'Two',
                },
              ],
              class: [
                'header-menu',
              ],
            },
          },
          // { component: 'MediaLoremIpsum' },
          // { component: 'MediaLoremIpsum' },
          // { component: 'MediaLoremIpsum' },
          {
            component: 'LayoutGroup',
            title: 'Text & Image',
            props: {
              direction: 'column',
              alignItems: 'flex-start',
              class: [
                'floaty-text',
              ],
            },
            slot: [
              {
                component: 'MediaHtml',
                props: {
                  value: { $i18n: { en: '<h2>Build websites from a rich set of <strong>content blocks</strong></h2>' } },
                  class: [],
                },
              },
              {
                component: 'MediaImage',
                transitions: {
                  'navigation-forward-enter': 'fadeInRight',
                  'navigation-back-enter': 'fadeInLeft',
                  'navigation-forward-leave': 'fadeOutLeft',
                  'navigation-back-leave': 'fadeOutRight',
                },
                props: {
                  src: 'http://phi.local/build/images/dalle-shark.png',
                  class: [
                    'polaroid',
                  ],
                  style: { margin: null },
                  align: 'center',
                },
              },
              {
                component: 'MediaLoremIpsum',
                props: {
                  nParagraphs: '1',
                  nWords: '22',
                },
              },
              {
                component: 'MediaLoremIpsum',
                props: {
                  nParagraphs: '1',
                  nWords: '33',
                },
              },
              {
                component: 'MediaLoremIpsum',
                props: {
                  nParagraphs: '1',
                  nWords: '44',
                },
              },
            ],
            transitions: {
              'navigation-forward-enter': 'fadeInRight',
              'navigation-back-enter': 'fadeInLeft',
              'navigation-forward-leave': 'fadeOutLeft',
              'navigation-back-leave': 'fadeOutRight',
            },
          },
        ],
      },
      props: {},
      omitHeader: true,
    },
  ],
  paths: [],
  header: [],
  stylesheets: [
    {
      'id': 'story-style-light',
      'src': { '--ui-color-primary': '#02a6c7' },
      'prefers-color-scheme': 'light',
    },
    {
      'id': 'story-style-dark',
      'src': { '--ui-color-primary': '#02a6c7' },
      'prefers-color-scheme': 'dark',
    },
    {
      id: 'story-style',
      src: { '--ui-content-width': '800px' },
    },
    {
      id: 'polaroid',
      src: '.polaroid {\n  z-index: 1;\n  float: right;\n  width: 260px;\n  max-width: 40vw;  \n}\n\n.polaroid img {\n  border: 8px solid white;\n  transform: rotateZ(2deg);\n  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;\n  border-radius: 5px;\n}',
      type: 'class',
    },
    {
      id: 'header-block',
      src: '.header-block {\n  color: #f1f2f3 !important;\n  font-size: 1.3em;\n  text-shadow: 0 2px 4px black;\n}',
      type: 'class',
    },
    {
      id: 'header-menu',
      src: '.header-menu {\n  font-weight: bold;\n  margin: 5px 0;\n  justify-content: center;\n}',
      type: 'class',
    },
    {
      id: 'color-orange',
      src: '.color-orange {\n  --ui-color-primary: orange;\n}',
      type: 'class',
    },
    {
      id: 'color-red',
      src: '.color-red {\n  --ui-color-primary: #e06869;\n}',
      type: 'class',
    },
    {
      id: 'quote',
      src: '.quote {\n  max-width: 800px;\n}',
      type: 'class',
    },
    {
      id: 'floaty-text',
      src: '.floaty-text {\n  padding: 12px;\n}\n\n.floaty-text h2 {\n  padding: 18px 0;  \n}',
      type: 'class',
    },
  ],
}