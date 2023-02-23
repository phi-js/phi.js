import { reactive } from 'vue'
import { getBlockDefinition } from '../../functions'

const clipboardContents = reactive(JSON.parse(localStorage.getItem('phi:clipboard')) || {})

export default {
  contents: clipboardContents,

  copy(block) {
    if (!block?._key) {
      console.warn('clipboard: cannot copy block without _key')
      return
    }

    clipboardContents[block._key] = {
      block,
      definition: getBlockDefinition(block),
      timestamp: new Date(),
    }

    localStorage.setItem('phi:clipboard', JSON.stringify(clipboardContents))
  },

  remove(block) {
    if (!block?._key) {
      return
    }

    delete clipboardContents[block._key]
    localStorage.setItem('phi:clipboard', JSON.stringify(clipboardContents))
  },
}