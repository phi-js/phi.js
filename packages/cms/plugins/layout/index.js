import LayoutPage from './components/LayoutPage/LayoutPage.block.js'
import LayoutGroup from './components/LayoutGroup/LayoutGroup.block.js'
import LayoutDialog from './components/LayoutDialog/LayoutDialog.block.js'

import LayoutSection from './blocks/LayoutSection.block.js'
import LayoutRow from './blocks/LayoutRow.block.js'

export default {
  i18n: {
    en: {
      'plugin.component.LayoutGroup.title': 'Group',
      'plugin.component.LayoutRow.title': 'Row',
      'plugin.component.LayoutSection.title': 'Section',
      'plugin.component.LayoutDialog.title': 'Dialog',
    },
    es: {
      'plugin.component.LayoutGroup.title': 'Grupo',
      'plugin.component.LayoutRow.title': 'Fila',
      'plugin.component.LayoutSection.title': 'Sección',
      'plugin.component.LayoutDialog.title': 'Diálogo emergente',
    },
  },

  blocks: [
    {
      title: 'Layout',
      children: [
        LayoutGroup,
        LayoutRow,
        LayoutSection,
        LayoutDialog,
        LayoutPage, // invisible
      ],
    },
  ],
}