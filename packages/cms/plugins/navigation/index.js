import NavigationLink from './components/NavigationLink/NavigationLink.block.js'
import NavigationMenu from './components/NavigationMenu/NavigationMenu.block.js'

import goTo from './functions/goTo'
import goNext from './functions/goNext'
import goBack from './functions/goBack'

export default {
  blocks: [
    {
      title: 'Navigation',
      children: [

        // Block alias
        {
          name: 'NavigationButton',
          title: 'Navigation button',
          icon: 'mdi:card',
          block: {
            component: 'InputButton',
            props: {
              name: 'story-goto',
              value: 'next',
            },
          },
        },
        NavigationMenu,
        NavigationLink, // TO BE DEPRECATED
      ],
    },
  ],

  functions: [
    {
      name: 'navigation',
      title: 'Navigation',
      children: [
        goTo,
        goNext,
        goBack,
      ],
    },
  ],
}