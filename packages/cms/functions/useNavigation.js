/*
useNavigation(
  refStory,  // A REF (i.e. refStory.value) containing a Story object
  refModelValue, // A REF (i.e. refModelValue.value) with the current modelValue (used to eval v-if)
  listeners // and object of event listeners:
    {
      onPageEnter: (pageId) => ....,
      onPageLeave: (pageId) => ....,
    }
)
*/
import { ref, provide, computed } from 'vue'
import { VM } from '@/packages/vm'
import { useI18n } from '@/packages/i18n'

export default function useNavigation(refStory, refModelValue = null, listeners = null) {
  const currentPageId = ref()
  const transitionDirection = ref('forward') // 'forward' || 'back'
  const i18n = useI18n()
  const navVM = new VM()
  const history = ref([])

  const graph = computed(() => {
    const nodes = refStory.value.pages
      .filter((page) => {
        if (!refModelValue) {
          return true
        }
        return !page['v-if'] || navVM.eval(page['v-if'], refModelValue.value)
      })
      .map((page) => ({
        id: page.id,
        hash: page.hash,
        title: i18n.obj(page.title),
      }))

    const hashNodes = {}
    nodes.forEach((node) => hashNodes[node.id] = node)

    const paths = refStory.value.paths
      .filter((path) => {
        if (!refModelValue) {
          return true
        }
        return !path['v-if'] || navVM.eval(path['v-if'], refModelValue.value)
      })
      .map((path) => ({
        ...(i18n.obj(path)), // translate all path properties
        nodeFrom: hashNodes[path.from] || null,
        nodeTo: hashNodes[path.to] || null,
      }))

    return sanitizeGraph({
      nodes,
      paths,
    })
  })

  const nextPages = computed(() => {
    return graph.value.paths
      .filter((p) => p.from == currentPageId.value)
      .map((path) => ({
        ...path.nodeTo,
        label: path.label,
      }))
  })

  const previousPages = computed(() => {
    return graph.value.paths
      .filter((p) => p.to == currentPageId.value)
      .map((path) => ({
        ...path.nodeFrom,
        label: path.label,
      }))
  })

  const trail = computed(() => {
    let initialNode = graph.value.nodes.find((n) => !graph.value.paths.find((p) => p.to == n.id))

    if (!initialNode) {
      initialNode = graph.value.nodes[0]
    }

    const retval = []
    const seenIds = {}

    let currentNode = initialNode
    while (currentNode) {
      if (seenIds[currentNode.id]) {
        break
      }

      seenIds[currentNode.id] = true
      retval.push(currentNode)

      const outPath = graph.value.paths.find((p) => p.from == currentNode.id)
      if (!outPath) {
        break
      }

      currentNode = graph.value.nodes.find((n) => n.id == outPath.to)
    }

    return retval
  })


  /*
  goto pageId OR 'next' | 'back'
  */
  function goTo(pageId) {
    if (pageId == 'next') {
      return goNext()
    }
    if (pageId == 'back') {
      return goBack()
    }


    if (currentPageId.value == pageId) {
      return
    }

    const targetPage = graph.value.nodes.find((p) => p.id == pageId)
    if (!targetPage) {
      console.warn(`useNavigation.goTo: invalid target page '${pageId}'`)
      return
    }

    const previousPageId = currentPageId.value
    if (previousPageId) {
      const previousIndex = refStory.value.pages.findIndex((p) => p.id == previousPageId)
      const nextIndex = refStory.value.pages.findIndex((p) => p.id == targetPage.id)
      transitionDirection.value = nextIndex > previousIndex ? 'forward' : 'back'

      if (listeners?.onPageLeave) {
        listeners.onPageLeave(previousPageId)
      }
    }

    if (listeners?.onPageEnter) {
      listeners.onPageEnter(targetPage.id)
    }

    currentPageId.value = targetPage.id

    history.value.push({
      timestamp: Math.floor(new Date().getTime() / 1000),
      pageId: targetPage.id,
    })
  }

  function goNext() {
    const nextPath = graph.value.paths.find((p) => p.from == currentPageId.value)
    if (!nextPath?.to) {
      return
    }
    return goTo(nextPath.to)
  }

  function goBack() {
    if (!previousPages.value.length) {
      return window.history.go(-1)
    }
    goTo(previousPages.value[0].id)
  }

  function getPageHref(pageId) {
    return `#p:${pageId}`
  }

  const $nav = {
    graph,
    currentPageId,
    nextPages,
    previousPages,
    trail,
    transitionDirection,
    goTo,
    goNext,
    goBack,
    getPageHref,
  }

  provide('$_cms_navigation', $nav)
  return $nav
}


// Helper functions

function sanitizeGraph(graph) {
  const mendedPaths = []

  for (let i = 0; i < graph.nodes.length; i++) {
    const node = graph.nodes[i]
    const outgoingPaths = getValidOutgoingPaths(node.id, graph)
    mendedPaths.push(...outgoingPaths)
  }

  return {
    nodes: graph.nodes,
    paths: mendedPaths,
  }
}

function getValidOutgoingPaths(nodeId, graph) {
  const outgoingPaths = graph.paths.filter((p) => p.from == nodeId)
  if (!outgoingPaths.length) {
    return []
  }

  const retval = []

  for (let i = 0; i < outgoingPaths.length; i++) {
    const outgoingPath = outgoingPaths[i]
    if (outgoingPath.nodeTo) {
      appendPaths(retval, outgoingPath, true)
    } else {
      const bridgedOutgoingPaths = getValidOutgoingPaths(outgoingPath.to, graph)
        .map((p) => ({ ...p, from: nodeId }))
      appendPaths(retval, bridgedOutgoingPaths)
    }
  }

  return retval
}

function appendPaths(paths, incomingPaths, overwrite = false) {
  const arrIncoming = Array.isArray(incomingPaths) ? incomingPaths : [incomingPaths]
  for (let i = 0; i < arrIncoming.length; i++) {
    const incomingPath = arrIncoming[i]
    const existingPathIndex = paths.findIndex((p) => p.from == incomingPath.from && p.to == incomingPath.to)
    if (existingPathIndex >= 0) {
      if (overwrite) {
        paths.splice(existingPathIndex, 1, incomingPath)
      }
      continue
    }
    paths.push(incomingPath)
  }
}