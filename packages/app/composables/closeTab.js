import appTree from './appTree.js'

export default async function closeTab(tabObjectOrId) {
  appTree.tabs = appTree.tabs.filter(tab => tab !== tabObjectOrId)
}