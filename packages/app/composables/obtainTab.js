import appTree from './appTree.js'
import selectTab from './selectTab.js'

export default async function obtainTab(tabId, autoSelect = false, activeHref = null) {
  const foundTab = appTree.tabs.find(t => t.id == tabId)
  if (foundTab) {
    autoSelect && selectTab(foundTab, activeHref)
    return foundTab
  }

  // Look for tab in custom app search callbacks
  // .... 2do !!!

  throw {
    message: `Tab ${tabId} not found`,
    params: { tabId }
  }
}