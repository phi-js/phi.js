import { VM } from '@/packages/vm'
const vm = new VM()

export default async function applyStoryCss(story, modelValue = null, blockOverride = null) {
  let css = ''
  story.pages.forEach(page => css = css + getBlockCss(page, blockOverride))
  if (modelValue) {
    css = await vm.eval(css, modelValue)
  }

  var sheetElId = `phi-sheet-${story.id}`
  var sheetEl = document.getElementById(sheetElId)
  if (!sheetEl) {
    sheetEl = document.createElement('style')
    sheetEl.id = sheetElId
    const header = document.getElementsByTagName('HEAD')[0]
    header.appendChild(sheetEl)
  }
  sheetEl.innerHTML = css
}

function getBlockCss(block, blockOverride = null) {
  const sourceBlock = blockOverride?.uid == block?.uid ? blockOverride : block

  let retval = ''
  if (sourceBlock?.css?.css) {
    retval = sourceBlock.css.css
  }

  if (sourceBlock?.slot?.length) {
    sourceBlock.slot.forEach(child => retval = retval + getBlockCss(child, blockOverride))
  }

  if (sourceBlock?.slots) {
    for (const [slotName, slotChildren] of Object.entries(object1)) {
      if (slotChildren?.length) {
        slotChildren.forEach(child => retval = retval + getBlockCss(child, blockOverride))
      }
    }
  }

  return retval
}