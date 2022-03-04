import { VM } from '@/packages/vm'
const vm = new VM()

export default async function applyStoryCss(story, modelValue) {
  let css = ''
  story.pages.forEach(page => css = css + getBlockCss(page))
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

function getBlockCss(block) {
  let retval = ''
  if (block?.css?.css) {
    retval = block.css.css
  }

  if (block?.slot?.length) {
    block.slot.forEach(child => retval = retval + getBlockCss(child))
  }

  if (block?.slots) {
    for (const [slotName, slotChildren] of Object.entries(object1)) {
      if (slotChildren?.length) {
        slotChildren.forEach(child => retval = retval + getBlockCss(child))
      }
    }
  }

  return retval
}