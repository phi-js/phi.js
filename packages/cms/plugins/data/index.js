import i18n from './i18n'

import DataTable from './components/DataTable/DataTable.block.js'
import DataForm from './components/DataForm/DataForm.block.js'

export default {
  i18n,

  // ORDER MATTERS (block picker shows blocks in this order)
  blocks: [
    {
      title: 'Data Management',
      children: [
        DataTable,
        DataForm,
      ],
    },
  ],
}