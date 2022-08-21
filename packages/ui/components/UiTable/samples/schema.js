export default {
  type: 'object',
  properties: {
    id: { type: 'string', title: 'User ID' },
    name: { type: 'string', title: 'Full name' },

    gender: {
      type: 'string',
      title: 'Gender',
      oneOf: [
        { const: '0', title: 'Female' },
        { const: '1', title: 'Male' },
      ],
    },

    picks: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['a', 'b', 'c'],
      },
      title: 'A pick',
    },

    username: { type: 'string', title: 'Username' },
    email: { type: 'string', title: 'eMail', format: 'email' },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string', title: 'Street' },
        suite: { type: 'string', title: 'suite' },
        city: { type: 'string', title: 'city' },
        zipcode: { type: 'string', title: 'zipcode' },
        geo: {
          type: 'object',
          title: 'Location',
          properties: {
            lat: { type: 'number', title: 'Lat.' },
            lng: { type: 'number', title: 'Lng.' },
          },
          format: 'location',
        },
      },
    },
    phone: { type: 'string', title: 'Phone' },
    website: { type: 'string', title: 'Website', format: 'url' },
    company: {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name' },
        catchPhrase: { type: 'string', title: 'Catch phrase' },
        bs: { type: 'string', title: 'BS' },
      },
    },
  },
}