import forEachBlock from './forEachBlock'
import getBlockFields from './getBlockFields'

export default function getStorySchema(story) {
  const pageFields = {} // pageFields[pageIndex] = [... all fields in page]

  forEachBlock(story, (block, path) => {
    // Look for $.pages[XXXX]...  in the json path to the block
    const pathPageMatches = path.match(/\$\.pages\[(.+?)\]/i)
    const pageIndex = pathPageMatches?.[1] || -1

    const blockFields = getBlockFields(block)
    if (!blockFields.length) {
      return
    }

    if (typeof pageFields[pageIndex] === 'undefined') {
      pageFields[pageIndex] = []
    }

    blockFields.forEach((blockField) => {
      pageFields[pageIndex].push({
        ...blockField,
        page: {
          id: story.pages?.[pageIndex]?.id,
          title: story.pages?.[pageIndex]?.title,
          hash: story.pages?.[pageIndex]?.hash,
        },
      })
    })
  })

  /*
  Return an item for each PAGE, with its fields as children
  [
    {
      text: 'Page 1',
      children: [
        {
          value: 'model.something',
          type: 'string',
          text: 'Enter your something',
        },
        ...
      ]
    },
    ...
  ]
  */
  return Object.keys(pageFields)
    .map((pageIndex) => ({
      id: story.pages?.[pageIndex]?.id,
      text: story.pages?.[pageIndex]?.title,
      children: pageFields[pageIndex],
    }))
}