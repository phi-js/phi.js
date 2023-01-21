export default [
  {
    title: 'User ID',
    value: '$.id',
    sortable: '$.id',
  },
  {
    title: 'Full name',
    value: '$.name',
    sortable: '$.name',
  },
  {
    title: 'Gender',
    value: '$.gender',
    sortable: '$.gender',
    type: 'enum',
    options: [
      { value: 0, text: 'Chica' },
      { value: 1, text: 'Chico' },
    ],
  },
  {
    title: 'A pick',
    value: '$.picks',
    type: 'array',
    items: {
      type: 'enum',
      options: [
        { value: 'a', text: 'Pick A' },
        { value: 'b', text: 'Pick B' },
        { value: 'c', text: 'Pick C' },
      ],
    },
  },
  {
    title: 'Username',
    value: '$.username',
  },
  {
    title: 'eMail',
    value: '$.email',
    type: 'email',
    sortable: '$.email',
  },
  {
    title: 'Street',
    value: '$.address.street',
  },
  {
    title: 'suite',
    value: '$.address.suite',
  },
  {
    title: 'city',
    value: '$.address.city',
  },
  {
    title: 'zipcode',
    value: '$.address.zipcode',
  },
  {
    title: 'Location',
    value: '$.address.geo',
    type: 'geo',
  },
  {
    title: 'Phone',
    value: '$.phone',
  },
  {
    title: 'Website',
    value: '$.website',
    type: 'url',
  },
  {
    title: 'Name',
    value: '$.company.name',
  },
  {
    title: 'Catch phrase',
    value: '$.company.catchPhrase',
  },
  {
    title: 'BS',
    value: '$.company.bs',
  },
]