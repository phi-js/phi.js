import InputButton from './blocks/InputButton.js'
import InputCheckbox from './blocks/InputCheckbox.js'
import InputCountry from './blocks/InputCountry.js'
import InputDate from './blocks/InputDate.js'
import InputNumber from './blocks/InputNumber.js'
import InputPassword from './blocks/InputPassword.js'
import InputSelect from './blocks/InputSelect.js'
import InputText from './blocks/InputText.js'
import InputTextarea from './blocks/InputTextarea.js'
import InputUpload from './blocks/InputUpload.js'

import i18n from './i18n'

export default {
  i18n,

  blocks: [
    {
      title: 'Form',
      order: 0,

      children: [
        InputText,
        InputTextarea,
        InputSelect,
        InputCheckbox,
        InputDate,
        InputNumber,
        InputUpload,
        InputPassword,
        InputCountry,
        InputButton,
      ],
    },
  ],
}