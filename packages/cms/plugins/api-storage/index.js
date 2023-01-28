import { setProperty, getProperty, forEachBlock } from '@/packages/cms/functions'
import BlockApiStorage from './BlockApiStorage.vue'

/*
settings: {
  async getRecord() {
    console.log('GETTING RECORD')
    return {
      ...
    }
  },

  async postRecord(recordData) {
    console.log('PATCHING RECORD', recordData)
  },
}
*/
export default function apiStoragePlugin(settings) {

  const getRecord = settings?.getRecord && typeof settings.getRecord == 'function'
    ? settings.getRecord
    : () => {}

  const postRecord = settings?.postRecord && typeof settings.postRecord == 'function'
    ? settings.postRecord
    : () => {}

  return {
    async onStoryMounted(objStory, vNode) {
      try {
        const recordData = await getRecord()
        if (recordData) {
          vNode.patchModelValue(recordData)
        }
      } catch (e) {
        console.warn('plugin api-storage: Error fetching record')
        console.warn(e)
      }
    },

    /*
    Newly created blocks that contain a v-model property
    will be marked as trackable by default
    */
    onBeforeCreateBlock(block) {
      if (typeof block['v-model'] != 'string') {
        return
      }

      return {
        ...block,
        _plugin_api_storage: {
          trackable: true,
          title: '',
        },
      }
    },

    blockListeners: [
      // Store data on Submit events from LayoutPage
      {
        event: 'submit',
        callback($event, block, modelValue) {
          if (block.component != 'LayoutPage') {
            return
          }

          const trackedData = {}
          let hasData = false
          forEachBlock(block, (child) => {
            if (child._plugin_api_storage?.trackable && child['v-model']) {
              setProperty(trackedData, child['v-model'], getProperty(modelValue, child['v-model']))
              hasData = true
            }
          })

          if (hasData) {
            postRecord(trackedData)
          }
        },
      },
    ],

    slots: { BlockDataEditor: BlockApiStorage },

    functions: [
      {
        title: 'Form data storage',
        children: [
          {
            name: 'api_storage.patch',
            icon: 'mdi:content-save',
            text: 'Patch record',

            //(args = null, _scope = null, _vm = null)
            callback: (args = null) => {
              if (!args || typeof args != 'object') {
                console.warn('Tracker.log arguments must be an object with data')
                return
              }
              postRecord(args)
            },
          },
        ],
      },
    ],
  }
}