import NavigationMenu from './NavigationMenu.vue'
import NavigationMenuEditor from './NavigationMenuEditor.vue'

export default {
  name: 'NavigationMenu',
  title: 'Menú',
  icon: 'mdi:menu',

  block: {
    component: NavigationMenu,
    props: { items: [] },
  },

  editor: {
    actions: [
      {
        id: 'items',
        title: 'Menu items',
        component: NavigationMenuEditor,
      },
    ],
  },
}