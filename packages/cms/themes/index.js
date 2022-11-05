/*
Defines a list of available THEMEs.
{
  title: 'The theme\'s name',
  name: 'ThemeOne', // theme name IS the class name
  url: 'https://phi.co/css/themes/ThemeOne.css', // CSS url
  thumbnail: 'https:// ... thumbnail image URL ',
  description: '... description text ...',
},

It can be an ARRAY of themes, of an async function which produces an array of themes
*/

const availableThemes = []

export function provideThemes(providedThemes) {
  availableThemes.push(providedThemes)
}

export async function getAvailableThemes() {
  const retval = []
  for (let i = 0; i < availableThemes.length; i++) {
    const cTheme = availableThemes[i]
    if (typeof cTheme == 'function') {
      const generatedThemes = await cTheme()
      retval.push(...generatedThemes)
    } else if (Array.isArray(cTheme)) {
      retval.push(...cTheme)
    } else if (cTheme?.name && cTheme?.url) {
      retval.push(cTheme)
    }
  }

  return retval
}