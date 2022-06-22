import { h } from 'vue'
import { addedPlugins } from './usePlugin'

export default function getPluginData() {

  const eventListeners = {} // hash of all registered events  eventListeners[eventName] = [ ...ARRAY of callbacks ]
  function addEventListener(eventName, callback) {
    if (!eventListeners[eventName]) {
      eventListeners[eventName] = []
    }
    eventListeners[eventName].push(callback)
  }


  const allBlocks = {} // hash allBlocks['SomeBlockName']
  addedPlugins.forEach((plugin) => {
    Object.assign(allBlocks, plugin.blocks)

    if (plugin.onStoryMounted) {
      addEventListener('storyMounted', plugin.onStoryMounted)
    }
  })

  const blockCreators = addedPlugins
    .map((plugin) => plugin.onBeforeCreateBlock)
    .filter((p)=>!!p)

  const blockListeners = []
  addedPlugins.forEach((plugin) => plugin.blockListeners?.length && blockListeners.push(...plugin.blockListeners))


  const allSlots = {}
  addedPlugins
    .filter((plugin) => !!plugin.slots)
    .forEach((plugin) => {
      for (const [slotName, slotComponent] of Object.entries(plugin.slots)) {
        if (!allSlots[slotName]) {
          allSlots[slotName] = []
        }

        if (Array.isArray(slotComponent)) {
          allSlots[slotName].push(...slotComponent)
        } else {
          allSlots[slotName].push(slotComponent)
        }
      }
    })

  /*
  Returns a component to be used as <Component :is="getSlotComponent('somePluginSlotName')"
  This component simply renders a list of all declared components
  */
  const cachedSlots = {}

  function getSlotComponent(slotName) {
    if (!allSlots[slotName]) {
      return null
    }

    if (cachedSlots[slotName]) {
      return cachedSlots[slotName]
    }

    cachedSlots[slotName] = {
      render(curInstance) {
        return allSlots[slotName].map((slotComponent) => h(slotComponent, curInstance.$attrs))
      },
    }

    return cachedSlots[slotName]
  }


  return {
    blocks: allBlocks,

    onBeforeCreateBlock: blockCreators.length
      ? (block) => {
        let retval = null
        for (let i = 0; i < blockCreators.length; i++) {
          retval = blockCreators[i](block)
          if (retval === false) {
            return false
          }
        }
        return retval
      }
      : undefined,

    blockListeners,

    slots: allSlots,
    getSlotComponent,

    emit: (eventName, $event, ctx) => {
      if (!eventListeners[eventName]) {
        return
      }

      eventListeners[eventName].forEach((callback) => callback($event, ctx))
    },
  }
}
