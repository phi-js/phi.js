import LayoutPage from './components/LayoutPage/LayoutPage.block.js'
import LayoutGroup from './components/LayoutGroup/LayoutGroup.block.js'

export default {
  i18n: {
    en: { 'plugin.component.LayoutGroup.title': 'Group' },
    es: { 'plugin.component.LayoutGroup.title': 'Grupo' },
  },

  blocks: [
    {
      title: 'Layout',
      children: [
        LayoutPage,
        LayoutGroup,
      ],
    },
  ],
}