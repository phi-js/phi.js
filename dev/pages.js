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
export function addPages(modules, prefix, replacement) {
  for (const [filename, component] of Object.entries(modules)) {
    const parts = filename.split('/')
    const lastPart = parts[parts.length - 1]

    allPages.push({
      text: lastPart,
      file: filename,
      url: filename.replace(prefix, replacement),
      component: defineAsyncComponent(component),
    })
  }
}

/* Add phi.js core pages */
addPages(import.meta.glob('../pages/**/*.vue'), '../pages/', '/phi.js/')
addPages(import.meta.glob('../packages/**/*.docs.vue'), '../packages/', '/phi.js/packages/')


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

  // return retval
  return flattenTree(retval)
}

function spliceItem(arrTree, arrPath, page, prefix = '/') {
  let root = arrPath.shift()
  let node = arrTree.find((n) => n.url == prefix + root)
  if (!node) {
    node = {
      url: prefix + root,
      text: root,
    }
    arrTree.push(node)
  }

  if (arrPath.length) {
    node.children = spliceItem(node.children || [], arrPath, page, prefix + root + '/')
  }

  return arrTree
}


/*
Flatten a tree:
If a node has a single child, use the child as node
If a single node is called SOMETHING.docs.vue, replace '.docs'

- Remember, a "tree" is always an Array ;)
*/
function flattenTree(arrTree) {
  const retval = []
  arrTree.forEach((objNode) => {
    retval.push(flattenNode(objNode))
  })
  return retval
}

function flattenNode(objNode) {
  // console.log('flattening', objNode)

  if (!Array.isArray(objNode.children) || !objNode.children.length) {
    return objNode
  }

  const flatChildren = flattenTree(objNode.children)
  if (flatChildren.length == 1 && !flatChildren[0].children?.length && flatChildren[0].text.includes('.docs.')) {
    // console.log('one child! returning child', flatChildren[0])
    flatChildren[0].text = flatChildren[0].text.replace('.docs', '').replace('.vue', '')
    return flatChildren[0]
  }

  // console.log('more than one child. ignoring')
  return {
    ...objNode,
    children: flatChildren,
  }
}