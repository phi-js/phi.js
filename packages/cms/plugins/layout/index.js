import LayoutPage from './components/LayoutPage/LayoutPage.block.js'
import LayoutGroup from './components/LayoutGroup/LayoutGroup.block.js'
import LayoutSection from './components/LayoutSection/LayoutSection.block.js'

export default {
  i18n: {
    en: {
      'plugin.component.LayoutGroup.title': 'Group',
      'plugin.component.LayoutSection.title': 'Section',
    },
    es: {
      'plugin.component.LayoutGroup.title': 'Grupo',
      'plugin.component.LayoutSection.title': 'Sección',
    },
  },

  blocks: [
    {
      title: 'Layout',
      children: [
        LayoutPage,
        LayoutGroup,
        LayoutSection,
      ],
    },
  ],
}