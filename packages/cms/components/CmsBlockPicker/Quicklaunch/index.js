import Html from './Html.js'
import Input from './Input.js'
import Link from './Link.js'
import Select from './Select.js'
import Video from './Video.js'

const generators = [
  Html,
  Input,
  Link,
  Select,
  Video,
]

export default {
  getSuggestedBlocks(text) {
    let retval = []
    let string = text.trim()
    if (!string) {
      return retval
    }

    generators.forEach((generator) => {
      let generated = generator(string)
      if (generated) {
        retval.push(generated)
      }
    })

    return retval
  },
}