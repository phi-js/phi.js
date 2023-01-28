export default class {

  constructor() {
    // this.store = localStorage
    this.store = sessionStorage
  }

  async getRecords(storyId) {
    return Object.keys(this.store)
      .filter((keyName) => keyName.startsWith(`story-${storyId}-`)) // get all stored keys beginning with story-storyid
      .map((keyName) => { // Parse the stored value
        try {
          return JSON.parse(this.store.getItem(keyName)) || null
        } catch (e) {
          console.warn('error retrieving cached data', e)
          return null
        }
      })
      .filter((r) => r && typeof r == 'object') // ignore empty keys
  }

  // Create a new record
  async postRecord(storyId, postData) {
    const newRecord = {
      ...postData,
      _local_id: new Date().getTime(),
    }

    this.store.setItem(`story-${storyId}-${newRecord._local_id}`, JSON.stringify(newRecord))
    return newRecord
  }

  async putRecord(storyId, recordId, postData) {
    if (!recordId) {
      return this.postRecord(storyId, postData)
    }

    const recordKey = `story-${storyId}-${recordId}`
    const foundRecord = JSON.parse(this.store.getItem(recordKey)) || null
    if (!foundRecord) {
      return null
    }

    mergeDeep(foundRecord, postData)
    this.store.setItem(recordKey, JSON.stringify(foundRecord))

    return foundRecord
  }

  async deleteRecord(storyId, recordId) {
    this.store.deleteItem(`story-${storyId}-${recordId}`)
  }
}




//https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}