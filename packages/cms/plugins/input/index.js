import InputButton from './blocks/InputButton.js'
import InputCheckbox from './blocks/InputCheckbox.js'
import InputDate from './blocks/InputDate.js'
import InputUpload from './blocks/InputUpload.js'
import InputNumber from './blocks/InputNumber.js'
import InputPassword from './blocks/InputPassword.js'
import InputSelect from './blocks/InputSelect.js'
import InputText from './blocks/InputText.js'
import InputTextarea from './blocks/InputTextarea.js'

export default {
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
        InputButton,
      ],
    },
  ],
}