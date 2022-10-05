import LayoutPage from './components/LayoutPage/LayoutPage.vue'
import LayoutPageSettings from './components/LayoutPage/LayoutPageSettings.vue'

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

          emits: [
            {
              event: 'submit',
              text: 'Form is submitted',
            },
            {
              event: 'change',
              text: 'Form data changed',
            },
          ],

          editor: {
            actions: [
              {
                id: 'settings',
                title: 'Page settings',
                component: LayoutPageSettings,
              },
            ],
          },
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