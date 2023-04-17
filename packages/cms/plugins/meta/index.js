import MetaBlockLauncher from './components/MetaBlockLauncher.vue'

export default function metaPlugin() {
  return { slots: { BlockLauncher: MetaBlockLauncher } }
}