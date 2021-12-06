import LayoutPage from './components/LayoutPage/LayoutPage.vue'
import LayoutPageEditor from './components/LayoutPage/LayoutPageEditor.vue'
import LayoutRow from './components/LayoutRow/LayoutRow.vue'
import LayoutRowEditor from './components/LayoutRow/LayoutRowEditor.vue'
import LayoutColumn from './components/LayoutColumn/LayoutColumn.vue'

export default {
  blocks: {
    LayoutPage: {
      disabled: true, // hide from CmsBlockPicker
      title: 'Página',
      icon: 'mdi:page-layout-body',
      block: { component: LayoutPage },
      editor: { component: LayoutPageEditor },
    },

    LayoutRow: {
      disabled: true, // hide from CmsBlockPicker
      title: 'Row',
      icon: 'mdi:page-layout-body',
      block: { component: LayoutRow },
      editor: { component: LayoutRowEditor },
    },

    LayoutColumn: {
      disabled: true, // hide from CmsBlockPicker
      title: 'Column',
      icon: 'mdi:page-layout-sidebar-left',
      block: { component: LayoutColumn },
    },
  },
}