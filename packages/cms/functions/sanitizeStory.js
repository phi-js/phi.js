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

  if (!Array.isArray(story.pages) || !story.pages.length) {
    story.pages = [emptyPage]
  }

  if (!Array.isArray(story.paths)) {
    story.paths = []
  }

  story.pages.forEach((page, index) => {
    // Every page has an ID    
    if (!page.id) {
      page.id = `page-${index}`
    }

    // Every bl0ock has a UID (>= 1)
    assignUid(page)
  })

  return story
}

let uid = 1

function assignUid(block) {
  block.uid = uid++
  if (block?.slot?.length) {
    block.slot.forEach(child => assignUid(child))
  }
}