import LayoutPage from './components/LayoutPage/LayoutPage.vue'
import LayoutPageEditor from './components/LayoutPage/LayoutPageEditor.vue'

import LayoutRow from './components/LayoutRow/LayoutRow.vue'
import LayoutRowEditor from './components/LayoutRow/LayoutRowEditor.vue'

import LayoutColumn from './components/LayoutColumn/LayoutColumn.vue'

export default {
  blocks: {
    LayoutPage: {
      title: 'Página',
      icon: 'mdi:page-layout-body',
      block: { component: LayoutPage },
      editor: { component: LayoutPageEditor },
    },

    LayoutRow: {
      title: 'Row',
      icon: 'mdi:page-layout-body',
      block: { component: LayoutRow },
      editor: { component: LayoutRowEditor },
    },

    LayoutColumn: {
      title: 'Column',
      icon: 'mdi:page-layout-sidebar-left',
      block: { component: LayoutColumn },
    },
  },
}