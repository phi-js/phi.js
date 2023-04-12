import NavigationControls from './components/NavigationControls/NavigationControls.block.js'
import NavigationMenu from './components/NavigationMenu/NavigationMenu.block.js'
import NavigationProgress from './components/NavigationProgress/NavigationProgress.block.js'

import goTo from './functions/goTo'
import goNext from './functions/goNext'
import goBack from './functions/goBack'

export default {
  blocks: [
    {
      title: 'Navigation',
      children: [
        {
          // 'NavigationButton' block is an alias of 'InputButton'
          name: 'NavigationButton',
          title: 'Navigation button',
          icon: 'mdi:card',
          block: {
            component: 'InputButton', // Block alias
            props: {
              name: 'story-goto',
              value: 'next',
            },
          },
        },
        NavigationControls,
        NavigationMenu,
        NavigationProgress,
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