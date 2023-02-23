import ClipboardPicker from './components/ClipboardPicker.vue'
import ClipboardItem from './components/ClipboardItem.vue'

export default {
  slots: {
    BlockMenu: ClipboardItem,
    BlockLauncher: ClipboardPicker,
  },
}