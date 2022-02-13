import NavigationMenu from './NavigationMenu.vue'

export default {
  tags: ['navigation'],

  name: 'NavigationMenu',
  title: 'Menú',
  icon: 'mdi:menu',

  block: {
    component: NavigationMenu,
    props: { items: [] },
  },
}