import LayoutPage from './LayoutPage.vue'
import LayoutPageSettings from './LayoutPageSettings.vue'

export default {
  name: 'LayoutPage',
  private: true, // hide from CmsBlockPicker
  title: 'Página',
  icon: 'mdi:page-layout-body',

  block: { component: LayoutPage },

  emits: [
    { event: 'submit', text: 'Form is submitted' },
    { event: 'load', text: 'The page is loaded' },
    { event: 'enter', text: 'Enter page' },
    { event: 'leave', text: 'Leave page' },
    { event: 'change', text: 'Form data changed' },
  ],

  editor: {
    actions: [
      {
        id: 'LayoutPageSettings',
        title: 'Page settings',
        component: LayoutPageSettings,
      },
    ],
  },
}