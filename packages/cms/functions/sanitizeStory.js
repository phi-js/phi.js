export default function sanitizeStory(story) {
  const emptyPage = { component: 'LayoutPage' }

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

  // Every story has a HEADER and FOOTER array (slot)
  if (!Array.isArray(story.header)) {
    story.header = []
  }

  if (!Array.isArray(story.footer)) {
    story.footer = []
  }

  // Every story has an ARRAY of paths
  if (!Array.isArray(story.paths)) {
    story.paths = []
  }

  // Every story has an ARRAY of stylesheets
  if (!Array.isArray(story.stylesheets)) {
    story.stylesheets = []
  }

  // Required attributes for PAGES
  story.pages.forEach((page, index) => {
    // every page has a slots object with a "default" property (array)
    // where page.slot is a shortcut of page.slots.default

    if (!page.slots) {
      page.slots = {}
    }
    if (!page.slots.default) {
      page.slots.default = Array.isArray(page.slot) ? page.slot : []
    }

    // every page has a unique ID
    if (!page.id) {
      page.id = `page-${index + 1}`
    }

    // every page has a title
    if (!page.title) {
      page.title = page.id
    }

    // every page has a hash name (used in navigation url.to.page/#hash)
    if (!page.hash) {
      page.hash = page.id
    }
  })

  return story
}