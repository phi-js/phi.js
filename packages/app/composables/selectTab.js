import appTree from './appTree.js'

export default async function selectTab(tabObjectOrId) {
  if (tabObjectOrId && typeof tabObjectOrId == 'object') {
    appTree.tabs.forEach(tab => tab.isActive = tab === tabObjectOrId)
  } else {
    appTree.tabs.forEach(tab => tab.isActive = tab.id === tabObjectOrId)
  }
}