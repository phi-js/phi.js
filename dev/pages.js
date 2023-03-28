import { defineAsyncComponent } from 'vue'

/*
allPages
[
  {
    "text": "UiIcon",
    "file": "./packages/ui/components/UiIcon/UiIcon.docs.vue",
    "url": "/packages/ui/components/UiIcon"
  },
  ...
]

*/
const allPages = []

/*
addPages takes in a files list (the result from calling import.meta.glob)

{
  text: 'UiIcon',
  file: '../packages/ui/UiIcon/UiIcon.docs.vue'
}
*/
export function addPages(modules) {
  // for (const path in modules) {
  for (const [filename, component] of Object.entries(modules)) {
    const parts = filename.split('/')
    const lastPart = parts[parts.length - 1]

    allPages.push({
      text: lastPart,
      file: filename,
      url: toUrl(filename),
      component: defineAsyncComponent(component),
    })
  }
}

function toUrl(path) {
  return path
    .replace('../', '/')
    .replace('./', '/')
}



/* Add phi.js core pages */
addPages(import.meta.glob('../pages/**/*.vue'))
addPages(import.meta.glob('../packages/**/*.docs.vue'))




export function getComponent(url) {
  const parts = url.split('?', 2)
  if (parts.length == 2) {
    url = parts[0]
  }

  const foundPage = allPages.find((page) => page.url == url)
  if (!foundPage?.component) {
    console.warn(`Cannot find component for url '${url}'`)
    return null
  }

  return foundPage.component

  // const importCallback = () => import('/' + foundPage.file)
  // return importCallback().then((mod) => mod.default)
}





/*
Organizar las paginas en un arbol segun su estructura de directorios:

pages:
[
  {
    "text": "UiIcon",
    "file": "./packages/ui/components/UiIcon/UiIcon.docs.vue",
    "url": "/ui/components/UiIcon"
  },
  ...
]
------------>
[
  {
    text: 'ui',
    url: '/ui',
    children: [
      {
        text: 'components',
        url: '/ui/components',
        children: [
          {
            text: 'UiIcon',
            children: [],
            file: '...',
            url: '/foo/shoo
          },
          {
            text: 'UiItem',
            children: [],
            file: '...',
            url: '/foo/shoo
          },
          ...
        ]
      }
    ]
  }
]
*/
export function getTree() {
  const retval = []
  allPages.forEach((page) => {
    let parts = page.url.split('/').filter((part) => !!part)
    if (!parts.length) {
      return
    }

    spliceItem(retval, parts, page)
  })

  return retval
}

function spliceItem(arrTree, arrPath, page, prefix = '/') {
  let root = arrPath.shift()
  let node = arrTree.find((n) => n.url == prefix + root)
  if (!node) {
    node = {
      url: prefix + root,
      text: root,
      page: null,
    }
    arrTree.push(node)
  }

  if (!arrPath.length) {
    node.page = page
  } else {
    node.children = spliceItem(node.children || [], arrPath, page, prefix + root + '/')
  }

  return arrTree
}