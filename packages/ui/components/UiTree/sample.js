export default [
  {
    text: 'Un elemento',
    subtext: 'Un subtexto',
    color: 'red',
    icon: 'mdi:virus',
    children: [
      {
        text: 'Hijo 1',
        children: [{ text: 'Hijo 1' }, { text: 'Hijo 2' }, { text: 'Hijo 3' }],
      },
      {
        text: 'Hijo 2',
        children: [
          { text: 'Hijo 1' },
          {
            text: 'Hijo 2',
            children: [
              { text: 'Hijo 1' },
              { text: 'Hijo 2' },
              { text: 'Hijo 3' },
            ],
          },
          { text: 'Hijo 3' },
        ],
      },
      {
        text: 'Hijo 3',
        children: [{ text: 'Hijo 1' }, { text: 'Hijo 2' }, { text: 'Hijo 3' }],
      },
    ],
  },
  {
    text: 'Otro elemento',
    subtext: 'Otro subtexto (sin hijos)',
    color: 'blue',
    icon: 'mdi:vuejs',
  },
  {
    text: 'Otro elemento',
    subtext: 'Otro subtexto',
    color: 'purple',
    icon: 'mdi:code-json',
    children: [
      { text: 'Hijo 1' },
      {
        text: 'Hijo 2',
        children: [
          { text: 'Hijo 1' },
          { text: 'Hijo 2' },
          {
            text: 'Hijo 3',
            children: [
              { text: 'Hijo 1' },
              { text: 'Hijo 2' },
              { text: 'Hijo 3' },
            ],
          },
        ],
      },
      { text: 'Hijo 3' },
    ],
  },
]