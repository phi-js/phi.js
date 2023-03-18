import Html from './Html.js'
import Input from './Input.js'
import Link from './Link.js'
import Select from './Select.js'
import Video from './Video.js'

// El orden importa!
// Autolaunch usa el primer bloque sugerido, que se determina en éste orden:
const generators = [
  Video,
  Link,
  Select,
  Input,
  Html,
]

export default function getSuggestedBlocks(text) {
  let retval = []
  let string = text.trim()
  if (!string) {
    return [
      {
        name: 'LayoutGroup',
        title: 'Group',
        icon: 'mdi:group',
        block: {
          title: 'Group',
          props: { direction: 'column' },
        },
      },
    ]
  }

  generators.forEach((generator) => {
    let generated = generator(string)
    if (generated) {
      retval.push(generated)
    }
  })

  return retval
}