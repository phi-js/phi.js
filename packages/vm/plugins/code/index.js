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
          expression: {},
          template: 'assign',
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
            if: { and: [] },
            then: { do: null },
            else: { do: null },
          },
        },
      ],
    },
  ],
}