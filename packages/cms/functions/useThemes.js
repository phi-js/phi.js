/*
Given a STORY object, looks for the "themes" property,
imports all external CSS files if applies, and returns an ARRAY of class names to be applied to the story
*/
export default function useThemes(story) {
  const retval = []
  const foundThemes = story?.themes?.length ? story.themes : []
  foundThemes.forEach((theme) => {
    importTheme(theme)
    retval.push(theme.name)
  })
  return retval
}


const alreadyImported = {} // hash.  alreadyImported[themeName] = true|false

function importTheme({ url, name }) {
  if (alreadyImported[name]) {
    return
  }

  var head = document.getElementsByTagName('head')[0]
  var link = document.createElement('link')
  link.id = `phi-theme-${name}`
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = url
  link.media = 'all'
  head.appendChild(link)

  alreadyImported[name] = true
}

// function createStyleTag( cssContent ) {  // Some css in a string...
//   var sheetEl = document.createElement('style')
//   var header = document.getElementsByTagName('HEAD')[0]
//   header.appendChild(sheetEl)
//   function setStyleBody(text) {
//     sheetEl.innerHTML = text
//   }
//   setStyleBody(cssContent)
// }