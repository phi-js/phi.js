export default [
  {
    value: '$.id',
    title: 'User ID',
  },
  {
    value: '$.name',
    title: 'Full name',
  },
  {
    value: '$.gender',
    title: 'Gender',
    oneOf: [
      { const: '0', title: 'Chica' },
      { const: '1', title: 'Chico' },
    ],
  },
  {
    value: '$.picks',
    title: 'A pick',
    type: 'array',
    items: {
      oneOf: [
        { const: 'a', title: 'Pick A' },
        { const: 'b', title: 'Pick B' },
        { const: 'c', title: 'Pick C' },
      ],
    },
  },
  {
    value: '$.username',
    title: 'Username',
  },
  {
    value: '$.email',
    title: 'eMail',
    type: 'email',
  },
  {
    value: '$.address.street',
    title: 'Street',
  },
  {
    value: '$.address.suite',
    title: 'suite',
  },
  {
    value: '$.address.city',
    title: 'city',
  },
  {
    value: '$.address.zipcode',
    title: 'zipcode',
  },
  {
    value: '$.address.geo',
    title: 'Location',
    type: 'geo',
  },
  {
    value: '$.phone',
    title: 'Phone',
  },
  {
    value: '$.website',
    title: 'Website',
    type: 'url',
  },
  {
    value: '$.company.name',
    title: 'Name',
  },
  {
    value: '$.company.catchPhrase',
    title: 'Catch phrase',
  },
  {
    value: '$.company.bs',
    title: 'BS',
  },
]