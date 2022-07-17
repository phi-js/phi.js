// import NavigationMenu from './components/NavigationMenu/NavigationMenu.block.js'
// import NavigationLink from './components/NavigationLink/NavigationLink.block.js'
// import NavigationBack from './components/NavigationBack/NavigationBack.block.js'
import storyVmFunctions from './functions/story'

export default {

  // Deprecated in favor of MediaLink

  // blocks: [
  //   {
  //     title: 'Navigation',
  //     children: [
  //       // NavigationMenu,
  //       NavigationLink,
  //       NavigationBack,
  //     ],
  //   },
  // ],

  functions: [
    {
      title: 'Navigation',
      children: storyVmFunctions,
    },
  ],
}