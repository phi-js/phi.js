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
        NavigationLink,
        NavigationMenu,
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