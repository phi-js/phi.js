/*
https://www.squarespace.com/templates

Array.from(document.querySelectorAll('.TemplateThumbnail-AspectRatio-Xolhs img')).map(img => img.src).forEach(src => document.write(src + '<br>'))

https://static1.squarespace.com/static/images/5dd2c5c0ce90f5420a82e1f2?format=1000w
https://static1.squarespace.com/static/images/5dce9ecb4ae4182acc76c841?format=1000w
https://static1.squarespace.com/static/images/5dce9e719c39bf265866e6a0?format=1000w
https://static1.squarespace.com/static/images/5dcdaf58bd95e63be015ec26?format=1000w
https://static1.squarespace.com/static/images/5dd2a8bc2ed49f029ebca185?format=1000w
https://static1.squarespace.com/static/images/5dcdabeb58ca2746afd71f36?format=1000w
https://static1.squarespace.com/static/images/5dce9e1fd7c37454bcbea40c?format=1000w
https://static1.squarespace.com/static/images/5dce9f131a9b990037c4143d?format=1000w
https://static1.squarespace.com/static/images/5dd2ab32649b54696546a9b0?format=1000w
https://static1.squarespace.com/static/images/5dcdb235bd95e63be016297f?format=1000w
https://static1.squarespace.com/static/images/5dce9f4d2288341b18da0acf?format=1000w
https://static1.squarespace.com/static/images/5dcda2f45642dc01219e676e?format=1000w
https://static1.squarespace.com/static/images/5dce9c42ded6bc4dbf7f534f?format=1000w
https://static1.squarespace.com/static/images/5dce9b77be6b8f27bb365451?format=1000w
https://static1.squarespace.com/static/images/5dcee431f4a43b2d8c504ea7?format=1000w
https://static1.squarespace.com/static/images/5dce99f81a9b990037c3dcd5?format=1000w
https://static1.squarespace.com/static/images/5dce9bca4a2f6b4b1c4b4c5a?format=1000w
https://static1.squarespace.com/static/images/5dce9a7a4a2f6b4b1c4b3e27?format=1000w
https://static1.squarespace.com/static/images/5dce99598faea2040d33a697?format=1000w
https://static1.squarespace.com/static/images/5dce9d940b827213edfeab81?format=1000w
https://static1.squarespace.com/static/images/5dd2db3ff8402f09886c6d07?format=1000w
https://static1.squarespace.com/static/images/5dcee49ce0772e173c40d0f8?format=1000w
https://static1.squarespace.com/static/images/5dce9b2e1a9b990037c3e7ce?format=1000w
https://static1.squarespace.com/static/images/5dce9f7f2288341b18da0d47?format=1000w
https://static1.squarespace.com/static/images/5dcdbfd0c2627411a293bdf1?format=1000w
https://static1.squarespace.com/static/images/5dd2db1ddb8269618be4872d?format=1000w
*/

export const theme1 = {
  id: 'theme1',
  text: 'Tema 1',
  thumbnail: 'https://static1.squarespace.com/static/images/5dd2c5c0ce90f5420a82e1f2?format=500w',
  css: `
    .LayoutPage {
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
  thumbnail: 'https://static1.squarespace.com/static/images/5dce9ecb4ae4182acc76c841?format=500w',
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
  thumbnail: 'https://static1.squarespace.com/static/images/5dce9e719c39bf265866e6a0?format=500w',
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

export const theme4 = {
  id: 'theme4',
  text: 'Tema 4',
  thumbnail: 'https://static1.squarespace.com/static/images/5dcdaf58bd95e63be015ec26?format=500w',
}