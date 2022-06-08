import LayoutPage from './components/LayoutPage/LayoutPage.vue'
import LayoutPageEditor from './components/LayoutPage/LayoutPageEditor.vue'
import LayoutRow from './components/LayoutRow/LayoutRow.vue'
import LayoutRowEditor from './components/LayoutRow/LayoutRowEditor.vue'
import LayoutColumn from './components/LayoutColumn/LayoutColumn.vue'

import LayoutGroup from './components/LayoutGroup/LayoutGroup.vue'
import LayoutGroupEditor from './components/LayoutGroup/LayoutGroupEditor.vue'
import CmsPropsForm from '../../components/CmsPropsForm/CmsPropsForm.vue'

export default {
  blocks: {
    LayoutPage: {
      disabled: true, // hide from CmsBlockPicker
      title: 'Página',
      icon: 'mdi:page-layout-body',
      block: { component: LayoutPage },
      editor: { component: LayoutPageEditor },
      // editor: { face: { component: LayoutGroupEditor } },
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

    LayoutGroup: {
      tags: ['layout'],
      title: 'Group',
      icon: 'mdi:group',
      block: { component: LayoutGroup },
      onCreated: false,

      editor: {
        face: { component: LayoutGroupEditor },
        actions: [
          {
            'id': 'group',
            'title': 'Group settings',
            'component': CmsPropsForm,
            'v-model': 'block',
            'props': {
              fields: [
                {
                  label: 'Group name',
                  type: 'text',
                  model: 'title',
                },
                {
                  label: 'Content direction',
                  type: 'select-list',
                  options: ['row', 'column'],
                  model: 'props.direction',
                },
              ],
            },
          },
        ],
      },
    },
  },
}