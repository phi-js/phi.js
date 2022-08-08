export default function forEachBlock(story, callback) {
  if (!story) {
    return
  }

  if (story?.pages?.length) {
    story.pages.forEach((page) => forEachBlock(page, callback))
  }

  if (story?.header?.length) {
    story.header.forEach((block) => forEachBlock(block, callback))
  }
  if (story?.footer?.length) {
    story.footer.forEach((block) => forEachBlock(block, callback))
  }

  if (story.slot) {
    const arrChildren = Array.isArray(story.slot) ? story.slot : [story.slot]
    arrChildren.forEach((childBlock) => forEachBlock(childBlock, callback))
  }

  if (story.slots && typeof story.slots == 'object' && !Array.isArray(story.slots)) {
    Object.values(story.slots).forEach((slotContents) => {
      const arrChildren = Array.isArray(slotContents) ? slotContents : [slotContents]
      arrChildren.forEach((childBlock) => forEachBlock(childBlock, callback))
    })
  }

  if (story.component) {
    callback(story)
  }
}