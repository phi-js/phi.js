export default function forEachBlock(story, callback) {
  if (story?.pages?.length) {
    story.pages.forEach((page) => forEachBlock(page, callback))
  }

  if (story.component) {
    callback(story)
  }

  const slots = story?.slots || {}
  if (story?.slot) {
    slots.default = story.slot
  }

  Object.values(slots).forEach((slotContents) => {
    const arrChildren = Array.isArray(slotContents) ? slotContents : [slotContents]
    arrChildren.forEach((childBlock) => forEachBlock(childBlock, callback))
  })
}