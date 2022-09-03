// import NavigationLink from './components/NavigationLink/NavigationLink.block.js'
import NavigationBack from './components/NavigationBack/NavigationBack.block.js'
import NavigationNext from './components/NavigationNext/NavigationNext.block.js'
import NavigationMenu from './components/NavigationMenu/NavigationMenu.block.js'

import goTo from './functions/goTo'
import goNext from './functions/goNext'
import goBack from './functions/goBack'
// import call from './functions/call'
// import emit from './functions/emit'

export default {
  blocks: [
    {
      title: 'Navigation',
      children: [
        NavigationBack,
        NavigationNext,
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
        // call,
        // emit,
      ],
    },
  ],
}