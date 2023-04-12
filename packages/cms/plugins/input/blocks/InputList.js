import InputList from '../components/InputList/InputList.vue'
import InputListFace from '../components/InputList/InputListFace.vue'
import InputListSettings from '../components/InputList/InputListSettings.vue'

export default {
  name: 'InputList',
  title: 'List',
  icon: 'mdi:view-list-outline',

  block: {
    'component': InputList,
    'v-model': '',
  },

  editor: {
    face: { component: InputListFace },
    actions: [
      {
        'id': 'InputListSettings',
        'title': 'Labels',
        'component': InputListSettings,
        'v-model': 'block',
      },
    ],
  },
}