/*
ALL css properties, organized as a nice tree :)
*/
export default [
  {
    text: 'Typography',
    children: [
      {
        value: 'font-family',
        text: 'Font family',
        type: 'font-family',
      },
      {
        value: 'font-size',
        text: 'Font Size',
        type: 'length',
      },
      {
        value: 'color',
        text: 'Text color',
        type: 'color',
      },
      {
        value: 'font-weight',
        text: 'Font weight',
      },
      {
        value: 'white-space',
        text: 'Whitespace',
      },
      {
        value: 'text-shadow',
        text: 'Text shadow',
      },
    ],
  },
  {
    text: 'Background',
    children: [
      {
        value: 'background-color',
        text: 'background-color',
        type: 'color',
      },
      {
        value: 'background-image',
        text: 'background-image',
        type: 'image',
      },
      {
        value: 'background-attachment',
        text: 'background-attachment',
        type: 'background-attachment',
      },
      {
        value: 'background-size',
        text: 'background-size',
        type: 'background-size',
      },
      {
        value: 'background-repeat',
        text: 'background-repeat',
        type: 'repeat',
      },
      {
        value: 'background-position',
        text: 'background-position',
        type: 'position',
      },
    ],
  },
  {
    text: 'Border',
    children: [
      {
        value: 'border',
        text: 'border',
      },
      {
        value: 'border-radius',
        text: 'border-radius',
      },
    ],
  },
  {
    text: 'Display',
    children: [
      {
        value: 'display',
        text: 'display',
        type: 'display',
      },
      {
        value: 'flex-direction',
        text: 'flex-direction',
        type: 'flex-direction',
      },
      {
        value: 'flex-wrap',
        text: 'flex-wrap',
        type: 'flex-wrap',
      },
      {
        value: 'align-items',
        text: 'align-items',
        type: 'align-items',
      },
      {
        value: 'justify-content',
        text: 'justify-content',
        type: 'justify-content',
      },
      {
        value: 'gap',
        text: 'gap',
        type: 'length',
      },
      {
        value: 'flex',
        text: 'flex',
      },
      {
        value: 'align-self',
        text: 'align-self',
      },
    ],
  },
  {
    text: 'Box',
    children: [
      { value: 'margin', text: 'margin' },
      // { value: 'margin-top ', text: 'margin-top ' },
      // { value: 'margin-right ', text: 'margin-right ' },
      // { value: 'margin-bottom', text: 'margin-bottom' },
      // { value: 'margin-left', text: 'margin-left' },

      { value: 'padding', text: 'padding' },
      // { value: 'padding-top ', text: 'padding-top ' },
      // { value: 'padding-right ', text: 'padding-right ' },
      // { value: 'padding-bottom', text: 'padding-bottom' },
      // { value: 'padding-left', text: 'padding-left' },

      { value: 'width', text: 'width', type: 'length' },
      { value: 'height', text: 'height', type: 'length' },

      { value: 'min-width', text: 'min-width', type: 'length' },
      { value: 'min-height', text: 'min-height', type: 'length' },

      { value: 'max-width', text: 'max-width', type: 'length' },
      { value: 'max-height', text: 'max-height', type: 'length' },

      { value: 'box-shadow', text: 'box-shadow' },
    ],
  },

  {
    value: 'new',
    text: 'Custom property ...',
    icon: 'mdi:plus',
  },
]