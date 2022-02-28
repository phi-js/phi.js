export default {
  name: 'blockCard',
  text: 'Card',
  subtext: 'Padded content on a white background with rounder borders',
  css: `
    .blockCard {
      background-color: #fff;
    }
  `,

  variations: [
    {
      name: 'blockCard--z-0',
      text: 'Flat',
      css: `
        .blockCard--z-0 {
          box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
        }
      `,
    },
    {
      name: 'blockCard--z-1',
      text: 'Elevation: 1',
      css: `
        .blockCard--z-1 {
          box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
        }
      `,
    },
    {
      name: 'blockCard--z-2',
      text: 'Elevation: 2',
      css: `
        .blockCard--z-2 {
          box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
        }
      `,
    },
    {
      name: 'blockCard--z-3',
      text: 'Elevation: 3',
      css: `
        .blockCard--z-3 {
          box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
        }
      `,
    },
    {
      name: 'blockCard--z-4',
      text: 'Elevation: 4',
      css: `
        .blockCard--z-4 {
          box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
        }
      `,
    },
    {
      name: 'blockCard--z-5',
      text: 'Elevation: 5',
      css: `
        .blockCard--z-5 {
          box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
        }
      `,
    },
    {
      name: 'blockCard--z-6',
      text: 'Elevation: 6',
      css: `
        .blockCard--z-6 {
          box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
        }
      `,
    },
  ],
}