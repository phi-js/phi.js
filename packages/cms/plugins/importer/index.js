import ImportFromUrl from './ImportFromUrl.vue'

export default function importerPlugin() {
  return { slots: { BlockLauncher: ImportFromUrl } }
}