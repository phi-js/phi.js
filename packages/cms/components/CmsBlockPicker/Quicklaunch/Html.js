export default function (text) {
  let tag = 'p'

  if (text.substring(0, 4) == '####') {
    tag = 'h4'
    text = text.substring(4).trim()
  } else if (text.substring(0, 3) == '###') {
    tag = 'h3'
    text = text.substring(3).trim()
  } else if (text.substring(0, 2) == '##') {
    tag = 'h2'
    text = text.substring(2).trim()
  } else if (text.substring(0, 1) == '#') {
    tag = 'h1'
    text = text.substring(1).trim()
  }

  return {
    name: 'MediaHtml',
    title: 'Text',
    icon: 'mdi:text',

    block: { props: { value: `<${tag}>${text}</${tag}>` } },
  }
}