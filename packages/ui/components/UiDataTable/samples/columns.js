export default [
  {
    title: 'User ID',
    value: '$.id',
    orderBy: '$.id',
  },
  {
    title: 'Full name',
    value: '$.name',
    orderBy: '$.name',
  },
  {
    title: 'Gender',
    value: '$.gender',
    orderBy: '$.gender',
    type: 'enum',
    options: [
      { value: 0, text: 'Chica' },
      { value: 1, text: 'Chico' },
    ],
    group: 'Personal info',
  },
  {
    title: 'Username',
    value: '$.username',
    group: 'Personal info',
  },
  {
    title: 'eMail',
    value: '$.email',
    type: 'email',
    orderBy: '$.email',
    group: 'Personal info',
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
    title: 'Street',
    value: '$.address.street',
    group: 'Address',
  },
  {
    title: 'suite',
    value: '$.address.suite',
    group: 'Address',
  },
  {
    title: 'city',
    value: '$.address.city',
    group: 'Address',
  },
  {
    title: 'zipcode',
    value: '$.address.zipcode',
    group: 'Address',
  },
  {
    title: 'Location',
    value: '$.address.geo',
    group: 'Address',
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
    group: 'Company details',
  },
  {
    title: 'Catch phrase',
    value: '$.company.catchPhrase',
    group: 'Company details',
  },
  {
    title: 'BS',
    value: '$.company.bs',
    group: 'Company details',
  },
]