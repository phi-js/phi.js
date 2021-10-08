const pageFiles = import.meta.glob('../pages/**/*.vue')
const pages = []
for (const path in pageFiles) {
  let name = path.slice(9, -4) // remove .vue
  name = name.replace(/^\d+\./, '') // remove trailing numbers

  let isLocal = name.includes('.local')
  if (isLocal) {
    name = name.replace('.local', '')
  }

  pages.push({
    href: name,
    name,
    text: name,
    path,
    dir: path.replace('../', '').split('/').slice(0, -1).join('/'),
    import: pageFiles[path],
    isLocal,
  })
}

const modules = import.meta.glob('../packages/**/*.docs.vue')
const componentDocs = []
for (const path in modules) {
  let parts = path.split('/')
  let name = parts[parts.length - 1].slice(0, -9) // remove .docs.vue
  let isLocal = name.includes('.local')
  if (isLocal) {
    name = name.replace('.local', '')
  }

  componentDocs.push({
    href: 'component/' + name,
    name,
    path,
    dir: path.replace('../packages', '').split('/').slice(0, -1).join('/'),
    import: modules[path],
    isLocal,
  })
}

export default [...pages, ...componentDocs]

export const pageTree = toTree(pages, '../pages/')
export const packageTree = toTree(componentDocs, '../packages/')
export const docsTree = [...pageTree, ...packageTree]

/*
Organizar las paginas en un arbol segun su estructura de directorios:

pages:
[
  { path: '../packages/ui/components/UiIcon/UiIcon.docs.vue', ...},
  { path: '../packages/ui/components/UiItem/UiItem.docs.vue', ...},
  ...
]
------------>
[
  {
    text: 'ui',
    children: [
      {
        text: 'components',
        children: [
          {
            text: 'UiIcon',
            children: [],
            payload: {}  // <---  objeto PAGE
          },
          {
            text: 'UiItem',
            children: [],
            payload: {}  // <---  objeto PAGE
          },
          ...
        ]
      }
    ]
  }
]
*/
function toTree(arrPages, prefix = '') {
  let retval = []
  arrPages.forEach((page) => {
    let path = page.path.replace(prefix, '')
    let parts = path.split('/').slice(0, -1)

    if (!parts.length) {
      parts = [path]
    }

    retval = spliceItem(retval, parts, page)
  })
  return retval
}

function spliceItem(arrTree, arrPath, payload) {
  let rootId = arrPath.shift()
  let node = arrTree.find((n) => n.id == rootId)
  if (!node) {
    node = {
      id: rootId,
      text: payload?.text || rootId,
      children: [],
    }
    arrTree.push(node)
  }

  if (!arrPath.length) {
    node.payload = payload
  } else {
    node.children = spliceItem(node?.children || [], arrPath, payload)
  }
  return arrTree
}
