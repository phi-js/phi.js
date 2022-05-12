export default {
  rows: [
    {
      id: 1,
      text: 'Logro 1',
    },
    {
      id: 2,
      text: 'Logro 2',
    },
    {
      id: 3,
      text: 'Logro 3',
    },
  ],

  columns: [
    {
      id: 'a',
      text: 'A',
    },
    {
      id: 'b',
      text: 'B',
    },
    {
      id: 'c',
      text: 'C',
    },
    {
      id: 'd',
      text: 'D',
    },
  ],

  value: [
    {
      row: 1,
      column: 'a',
      value: { haiku: 'Soy el texto de row:1 column:a :)', isChecked: true },
    },
    { row: 1, column: 'b', value: { haiku: 'Soy el texto de row:1 column:b :)', isChecked: false } },
    { row: 2, column: 'a', value: { haiku: 'Soy el texto de row:2 column:a :)', isChecked: true } },
    { row: 3, column: 'a', value: { haiku: 'Soy el texto de row:3 column:a :)', isChecked: false } },
  ],
}