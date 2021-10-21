import StoryNavigation from './StoryNavigation.vue'
import StoryNavigationEditor from './StoryNavigationEditor.vue'

export default {
  tags: ['cms'],

  name: 'StoryNavigation',
  title: 'Navegación',
  icon: 'mdi:swap-horizontal-bold',

  block: { component: StoryNavigation },

  editor: { face: { component: StoryNavigationEditor } },
}