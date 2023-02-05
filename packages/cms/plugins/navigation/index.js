import NavigationLink from './components/NavigationLink/NavigationLink.block.js'
import NavigationMenu from './components/NavigationMenu/NavigationMenu.block.js'

import goTo from './functions/goTo'
import goNext from './functions/goNext'
import goBack from './functions/goBack'
import call from './functions/call'
import emit from './functions/emit'

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
        call,
        emit,
      ],
    },
  ],
}