export default function sanitizeStory(story) {
  const emptyPage = {
    component: 'LayoutPage',
    slot: [],
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
  if (!story.css || typeof story.css != 'object') {
    story.css = { classes: [] }
  }
  if (!Array.isArray(story.css.classes)) {
    story.css.classes = []
  }

  // Required attributes for PAGES
  story.pages.forEach((page, index) => {
    // every page has a unique ID
    if (!page.id) {
      page.id = `page-${index}`
    }

    // every page has info object (text, subtext, icon)
    if (!page.info) {
      page.info = { text: page.id }
    }

    // every page has a hash name (used in navigation url.to.page/#hash)
    if (!page.hash) {
      page.hash = page.id
    }
  })

  return story
}