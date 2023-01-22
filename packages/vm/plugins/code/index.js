export default {
  functions: [
    {
      name: 'code',
      title: 'Code',
      children: [
        {
          name: 'assign',
          icon: 'mdi:variable',
          title: 'Assign variable',
          expression: { assign: '', stmt: null },
        },

        {
          name: 'eval',
          icon: 'mdi:language-javascript',
          title: 'JavaScript',
          expression: { eval: '' },
        },

        {
          name: 'if',
          icon: 'mdi:directions-fork',
          title: 'IF',
          expression: {
            if: null,
            then: null,
            else: null,
          },
        },
      ],
    },
  ],
}