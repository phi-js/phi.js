import appTree from './appTree.js'
import navData from './navData.js'

export default async function selectTab(tabObjectOrId, activeHref = null) {
  let previousActiveIndex = -1
  const tabId = tabObjectOrId && typeof tabObjectOrId == 'object' ? tabObjectOrId.id : tabObjectOrId

  navData.tab.key = tabId
  navData.page.shouldAnimate = false

  // Hit within the same tab
  const currentActiveTab = appTree.tabs.find(t => t.isActive)
  if (currentActiveTab?.id == tabId) {
    navData.page.shouldAnimate = true // 2do, determine direction
    navData.page.isForward = true // 2do, determine direction

    currentActiveTab.href = activeHref
  }

  appTree.tabs.forEach((tab, i) => {
    tab._navDirection = null
    if (tab.isActive) {
      previousActiveIndex = i
    }

    tab.isActive = tab.id === tabId
    if (tab.isActive) {
      navData.tab.isForward = previousActiveIndex > -1

      if (tab?.menu?.length) {
        tab.menu.forEach(menuItem => markActive(menuItem, activeHref))
      }
    }
  })
}

function markActive(node, href) {
  node.isActive = false
  if (node?.children?.length) {
    node.children.forEach(child => {
      if (markActive(child, href)) {
        node.isActive = true
      }
    })
    return node.isActive
  }

  node.isActive = node?.href == href
  return node.isActive
}