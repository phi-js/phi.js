export default function forEachBlock(story, callback, path = '$') {
  if (!story) {
    return
  }

  if (story?.pages?.length) {
    story.pages.forEach((page, index) => forEachBlock(page, callback, `${path}.pages[${index}]`))
  }

  if (story?.header?.length) {
    story.header.forEach((block, index) => forEachBlock(block, callback, `${path}.header[${index}]`))
  }
  if (story?.footer?.length) {
    story.footer.forEach((block, index) => forEachBlock(block, callback, `${path}.footer[${index}]`))
  }

  if (story.slot) {
    const arrChildren = Array.isArray(story.slot) ? story.slot : [story.slot]
    arrChildren.forEach((childBlock, index) => forEachBlock(childBlock, callback, `${path}.slot[${index}]`))
  }

  if (story.slots && typeof story.slots == 'object' && !Array.isArray(story.slots)) {
    for (const [slotName, slotContents] of Object.entries(story.slots)) {
      const arrChildren = Array.isArray(slotContents) ? slotContents : [slotContents]
      arrChildren.forEach((childBlock, index) => forEachBlock(childBlock, callback, `${path}.slots.${slotName}[${index}]`))
    }
  }

  if (story.component) {
    callback(story, path)
  }
}