export const theme1 = {
  id: 'theme1',
  text: 'Tema 1',
  css: `
    .LayoutPage {
      border-radius: var(--ui-radius);
      border: 3px solid purple;
      --ui-content-width: 1024px;
      --ui-color-primary: blue;
    }

    .story-html h1 {
      color: purple;
    }

    .story-html p {
      margin: 0 0 1em 0;
    }
  `,

  classes: [
    {
      class: 'FullHeight',
      text: 'Full Height',
      subtext: 'This block will occupy the full screen height',
      css: `
        .FullHeight {
          height: 100vh;

          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          background-image: url('https://www.w3schools.com/w3images/parallax1.jpg');

          opacity: 0.75;
        }
      `,

      // If present, only blocks of this type will be allowed to use it
      allow: ['LayoutRow'],
    },

    {
      class: 'FlexCenter',
      text: 'Centered flex',
      subtext: 'Content will be centered horizontally and vertically',
      css: `
        .FlexCenter {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `,

      // If present, only blocks of this type will be allowed to use it
      allow: ['LayoutRow'],
    },

    {
      class: 'BlackBox',
      text: 'Black box',
      subtext: 'Square with black background and high contrast font',
      css: `
        .BlackBox {
          padding: 20px;
          background-color: #000;
          color: #fff;
        }

        .BlackBox h1,
        .Blackbox p {
          margin: 0;
          color: #fff;
        }
      `,

      // If present, only blocks of this type will be allowed to use it
      allow: ['LayoutRow'],
    },

    {
      class: 'BlockCard',
      text: 'Tarjeta',
      subtext: 'Fondo sombreado',
      css: `
        .BlockCard {
          padding: 12px;
          border-radius: var(--ui-radius);
          background-color: #fff;
          margin-bottom: 12px;
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
            }

            .BlockCard--level2 p {
              margin-bottom: 1em;
            }
          `,
        },
      ],
    },
  ],
}

export const theme2 = {
  id: 'theme2',
  text: 'Tema 2',
  css: `.LayoutPage {
  border-radius: 30px;
  border: 2px solid orange;
  --ui-content-width: 50%;
}

.story-html h1 {
  color: orange;
}

.story-html p {
  margin: 1em 0;
}
`,
}

export const theme3 = {
  id: 'theme3',
  text: 'Tema 3',
  css: `.LayoutPage {
  --ui-content-width: 70%;
  --ui-color-primary: blue;
}

.story-html h1 {
  color: var(--ui-color-primary);
}

.story-html p {
  margin: 1em 0;
}
`,
}