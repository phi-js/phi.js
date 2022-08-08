// import NavigationMenu from './components/NavigationMenu/NavigationMenu.block.js'
// import NavigationLink from './components/NavigationLink/NavigationLink.block.js'
import NavigationBack from './components/NavigationBack/NavigationBack.block.js'
import NavigationNext from './components/NavigationNext/NavigationNext.block.js'

import storyVmFunctions from './functions'

export default {


  blocks: [
    {
      title: 'Navigation',
      children: [
        NavigationBack,
        NavigationNext,
      ],
    },
  ],

  functions: [
    {
      title: 'Navigation',
      children: storyVmFunctions,
    },
  ],
}