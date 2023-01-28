import { useApi } from '@/packages/api'
import { setProperty } from '../../functions'
import localApi from './local-api.js'

export default function localStoragePlugin(uid) {
  if (!uid) {
    console.error('local-storage plugin: No UID specified')
    return
  }

  const api = useApi(localApi)
  let record = { _local_id: null }
  let stagedChanges = {}
  let timeout = null

  async function fetchCurrentRecord() {
    try {
      // Find first record
      const records = await api.getRecords(uid)
      if (records?.[0]?._local_id) {
        Object.assign(record, records[0])
      }
    } catch (e) {
      console.warn('Error obtaining cached data', e)
    }
  }

  async function patchRecord(propertyName, propertyValue, debounce = 200) {
    clearTimeout(timeout)
    setProperty(stagedChanges, propertyName, propertyValue)

    timeout = setTimeout(() => {
      api.putRecord(uid, record._local_id, stagedChanges)
        .then((response) => {
          Object.assign(record, response)
          stagedChanges = {}
        })
    }, debounce)
  }

  return {
    // When the story mounts, fetch the first cached record and patch it into the modelValue
    async onStoryMounted($event, vNode) {
      await fetchCurrentRecord()
      vNode.patchModelValue(record)
    },

    // When a block with v-model emits an update
    // update and store the current record
    blockListeners: [
      {
        event: 'update:modelValue',
        callback($event, block) {
          if (!block['v-model'] || block['v-model'][0] == '$') { // Do NOT save properties beginning with "$" ($item, $i18n, etc)
            return
          }
          patchRecord(block['v-model'], $event)
        },
      },
    ],
  }
}