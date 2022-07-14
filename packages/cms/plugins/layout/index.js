import LayoutPage from './components/LayoutPage/LayoutPage.vue'
import LayoutPageEditor from './components/LayoutPage/LayoutPageEditor.vue'
import LayoutRow from './components/LayoutRow/LayoutRow.vue'
import LayoutRowEditor from './components/LayoutRow/LayoutRowEditor.vue'
import LayoutColumn from './components/LayoutColumn/LayoutColumn.vue'

import LayoutGroup from './components/LayoutGroup/LayoutGroup.vue'
import LayoutGroupEditor from './components/LayoutGroup/LayoutGroupEditor.vue'
import LayoutGroupSettings from './components/LayoutGroup/LayoutGroupSettings.vue'

export default {
  blocks: [
    {
      title: 'Layout',
      children: [
        {
          name: 'LayoutPage',
          private: true, // hide from CmsBlockPicker
          title: 'Página',
          icon: 'mdi:page-layout-body',
          block: { component: LayoutPage },
          editor: { component: LayoutPageEditor },
        },

        {
          name: 'LayoutRow',
          private: true, // hide from CmsBlockPicker
          title: 'Row',
          icon: 'mdi:page-layout-body',
          block: { component: LayoutRow },
          editor: { component: LayoutRowEditor },
        },

        {
          name: 'LayoutColumn',
          private: true, // hide from CmsBlockPicker
          title: 'Column',
          icon: 'mdi:page-layout-sidebar-left',
          block: { component: LayoutColumn },
        },

        {
          name: 'LayoutGroup',
          title: 'Group',
          icon: 'mdi:group',

          block: {
            component: LayoutGroup,
            props: { direction: 'column' },
          },

          staging: true,

          editor: {
            face: { component: LayoutGroupEditor },
            actions: [
              {
                'id': 'group',
                'title': 'Group options',
                'component': LayoutGroupSettings,
                'v-model': 'block',
              },
            ],
          },
        },
      ],
    },
  ],

}