export default function promptCreatePage(existingPages) {
  const title = prompt('New page name', `Page ${existingPages.length + 1}`)
  if (!title) {
    return
  }

  return {
    id: `p${existingPages.length + 1}`,
    title,
    component: 'LayoutPage',
    slots: { default: [] },
  }
}