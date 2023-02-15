import forEachBlock from './forEachBlock'
import getBlockFields from './getBlockFields'

export default function getStorySchema(story) {
  const storyFields = []
  forEachBlock(story, (block, path) => {
    // Look for $.pages[XXXX]...  in the json path to the block
    const pathPageMatches = path.match(/\$\.pages\[(.+?)\]/i)
    const pageIndex = pathPageMatches?.[1] || -1

    const page = pageIndex >= 0
      ? {
        id: story.pages[pageIndex].id,
        title: story.pages[pageIndex].title,
        hash: story.pages[pageIndex].hash,
        index: pageIndex,
      }
      : null

    const blockFields = getBlockFields(block)
      .map((field) => ({
        ...field,
        path,
        page,
      }))

    storyFields.push(...blockFields)
  })

  return storyFields
}
