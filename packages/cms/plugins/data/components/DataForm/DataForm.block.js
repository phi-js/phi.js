import UiDataForm from '@/packages/ui/components/UiDataForm/UiDataForm.vue'
import DataFormFace from './DataFormFace.vue'
import DataFormSettings from './DataFormSettings.vue'

export default {
  name: 'DataForm',
  title: 'Record editor form',
  icon: 'mdi:cog',

  block: {
    'component': UiDataForm,
    'props': {},
    'slot': [],
    'v-model': '',
  },

  emits: [
    {
      event: 'accept',
      text: 'Accept',
    },
    {
      event: 'cancel',
      text: 'Cancel',
    },
    {
      event: 'delete',
      text: 'Delete',
    },
    {
      event: 'done',
      text: 'Done',
    },
  ],

  editor: {
    face: { component: DataFormFace },
    actions: [
      {
        id: 'data-form-settings',
        title: 'Form settings',
        component: DataFormSettings,
      },
    ],
  },

  staging: false,
}