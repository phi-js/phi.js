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


  // Every page has an ID
  story.pages.forEach((page, index) => {
    if (!page.id) {
      page.id = `page-${index}`
    }
  })

  return story
}