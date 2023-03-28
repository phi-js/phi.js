const providedTemplates = []

export default function provideTemplates(templateListOrFunction) {
  providedTemplates.push(templateListOrFunction)
}

export async function getProvidedTemplates() {
  const retval = []

  for (let i = 0; i < providedTemplates.length; i++) {
    const tpl = providedTemplates[i]

    if (typeof tpl == 'function') {
      const response = await tpl()
      if (Array.isArray(response)) {
        retval.push(...response)
      }
    } else if (Array.isArray(tpl)) {
      retval.push(...tpl)
    }
  }

  return retval
}