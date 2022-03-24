export default function sanitizeStory(story) {
  const emptyPage = {
    component: 'LayoutPage',
    slot: [
      {
        component: 'LayoutRow',
        slot: [
          {
            component: 'LayoutColumn',
            slot: [],
          },
        ],
      },
    ],
  }

  const defaultStory = {
    title: '',
    pages: [emptyPage],
    paths: [],
  }

  if (!story || typeof story !== 'object') {
    story = defaultStory
  }

  // Every story has an ARRAY of pages
  if (!Array.isArray(story.pages) || !story.pages.length) {
    story.pages = [emptyPage]
  }

  // Every story has an ARRAY of paths
  if (!Array.isArray(story.paths)) {
    story.paths = []
  }

  /* Every story has an CSS object:
  css: {
    classes: []
  }
  */
  if (!story.css) {
    story.css = { classes: [] }
  }
  if (!story.css.classes?.length) {
    story.css.classes = []
  }

  // Every page has an ID
  story.pages.forEach((page, index) => {
    if (!page.id) {
      page.id = `page-${index}`
    }

    // // Every bl0ock has a UID (>= 1)
    // assignUid(page)
  })

  return story
}

// let uid = 1
// function assignUid(block) {
//   // block.uid = block.uid || uid++
//   block.uid = uid++
//   if (block?.slot?.length) {
//     block.slot.forEach((child) => assignUid(child))
//   }
// }