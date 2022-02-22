import { computed } from 'vue'
import appTree from './appTree.js'
const activeTab = computed(() => appTree.tabs.find(t => t.isActive))

export default activeTab