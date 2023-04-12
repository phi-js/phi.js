import NavigationControls from './NavigationControls.vue'
// import NavigationControlsEditor from './NavigationControlsEditor.vue'

export default {
  name: 'NavigationControls',
  title: 'Navigation controls',
  icon: 'mdi:swap-horizontal-bold',

  block: {
    component: NavigationControls,
    props: {},
  },

  // editor: {
  //   actions: [
  //     {
  //       id: 'NavigationControlsEditor',
  //       title: 'Menu items',
  //       component: NavigationControlsEditor,
  //     },
  //   ],
  // },
}