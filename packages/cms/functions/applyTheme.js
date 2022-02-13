/*
Theme definition:

{
  id: 't1',
  text: 'Some theme text',
  subtext: 'A short description of the theme',
  thumbnail: '...url...',
  css: (string) base css,

  // Array of all available classes (that can be applied to blocks)
  classes: [
    {
      class: 'FullHeight',
      text: 'Full Height',
      subtext: 'This block will occupy the full screen height',
      css: `
        .FullHeight {
          height: 100vh;
        }
      `,

      // If present, only blocks of this type will be allowed to use it
      allow: ['LayoutRow']
    },

    {
      class: 'BlockCard',
      text: 'Tarjeta',
      subtext: 'Fondo sombreado',
      css: `
        .BlockCard {
          box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
          padding: 8px;
        }
      `,

      // If present,blocks of this type will not be allowed to use it
      deny: ['LayoutRow'],

      variations: [
        {
          class: 'BlockCard--level1',
          text: 'Nivel 1',
          subtext: 'Ilusion de 1cm de altura',
          css: `
            .BlockCard--level1 {
              box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
              padding: 8px;
            }
          `,
        },
        {
          class: 'BlockCard--level2',
          text: 'Nivel 2',
          subtext: 'Ilusion de 2cm de altura',
          css: `
            .BlockCard--level2 {
              box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
              padding: 8px;
            }

            .BlockCard--level2 h1 {
              color: red;
            }
          `,
        },
      ]
    }
  ]
}
*/

export default function applyTheme(theme, sheetId) {
  var sheetEl = document.getElementById(sheetId)
  if (!sheetEl) {
    sheetEl = document.createElement('style')
    sheetEl.id = sheetId
    const header = document.getElementsByTagName('HEAD')[0]
    header.appendChild(sheetEl)
  }
  sheetEl.innerHTML = getCSS(theme)
}

function getCSS(theme) {
  if (!theme?.css) {
    return ''
  }

  let output = theme.css ? theme.css + '\n' : ''

  if (theme?.classes?.length) {
    theme.classes.forEach((themeClass) => {
      output += themeClass.css + '\n'

      if (themeClass.variations?.length) {
        themeClass.variations.forEach((variation) => output += variation.css + '\n')
      }
    })
  }

  return output
}