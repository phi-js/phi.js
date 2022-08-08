/*
An array of STYLESHEET declarationsm
defining CSS styles to be loaded to the document (via <link> or <style>)
[
  {
    id: // required.  Unique ID
    title: 'Some Title, if you want',
    description: 'Also a description',

    container: css selector of parent container (to which classes are applied).  default: body

    // SRC can be:

    // a url
    src: 'https:// ....'

    // a string containing a CSS declaration
    src: '.something\n{\n  border-radius: 2px;}',

    // an object containing CSS properties (to be applied to "container" element if present, --2do: apply to ":root" if no container)
    src: {
      '--ui-color-background': '#000',
      '--any-thing': 'foo'
    }

    'prefers-color-scheme': light | dark // only loads the stylesheet if the scheme is active
    'container-class': default class name to apply automatically to container element,
    type: optional. A descriptive indicator of the type of stylesheet (font, class, palette, ...any custom string)
    thumbnail: optional. Thumbnail image URL
  }
]
*/
import { colorScheme } from '@/packages/ui'

const createdElements = {}

export default function useStylesheets(arrSheets, containerSelector = 'body') {

  const containerElement = document.querySelector(containerSelector)

  const deletionTargets = {}
  for (const [elUid, elTarget] of Object.entries(createdElements)) {
    deletionTargets[elUid] = elTarget
  }

  arrSheets.forEach((sheet) => {
    if (sheet['prefers-color-scheme'] && sheet['prefers-color-scheme'] != colorScheme.value) {
      return
    }

    deletionTargets[sheet.id] = undefined

    if (containerElement?.classList) {
      containerElement.classList.add(`--sheet-${sheet.id}`)
      sheet['container-class'] && containerElement.classList.add(sheet['container-class'])
    }

    let sheetSrc = sheet.src
    if (sheetSrc && typeof sheetSrc == 'object') {
      sheetSrc = objectToCssString(sheetSrc, `${containerSelector}.--sheet-${sheet.id}`)
    }

    if (sheetSrc.substring(0, 4) == 'http') {
      if (!createdElements[sheet.id]) {
        const foundLink = document.querySelector(`link[href='${sheetSrc}']`)
        if (foundLink) {
          createdElements[sheet.id] = foundLink
        } else {
          const link = document.createElement('link')
          link.id = `_cms_sheet_${sheet.id}`
          link.rel = 'stylesheet'
          link.type = 'text/css'
          link.media = 'all'

          const head = document.getElementsByTagName('head')[0]
          head.appendChild(link)
          createdElements[sheet.id] = link
        }
      }

      if (createdElements[sheet.id].href != sheetSrc) {
        createdElements[sheet.id].href = sheetSrc
      }
    } else {
      if (!createdElements[sheet.id]) {
        const style = document.createElement('style')
        style.id = `_cms_sheet_${sheet.id}`

        const head = document.getElementsByTagName('head')[0]
        head.appendChild(style)
        createdElements[sheet.id] = style
      }

      if (createdElements[sheet.id].innerHTML != sheetSrc) {
        createdElements[sheet.id].innerHTML = sheetSrc
      }
    }
  })

  for (const [sheetId, doomedEl] of Object.entries(deletionTargets)) {
    if (!doomedEl) {
      continue
    }

    const doomedSheet = arrSheets.find((sh) => sh.id == sheetId)
    if (containerElement?.classList) {
      containerElement.classList.remove(`--sheet-${sheetId}`)
      doomedSheet?.['container-class'] && containerElement.classList.remove(doomedSheet['container-class'])
    }

    if (doomedEl?.parentNode) {
      doomedEl.parentNode.removeChild(doomedEl)
    }

    createdElements[sheetId] = undefined
  }
}

function objectToCssString(obj, containerSelector) {
  let retval = ''
  for (const [propName, propValue] of Object.entries(obj)) {
    if (propValue !== null) {
      // retval += `${propName}: ${propValue};\n`
      retval += `${propName}: ${propValue} !important;\n`
    }
  }

  return `${containerSelector} { ${retval} }`
}