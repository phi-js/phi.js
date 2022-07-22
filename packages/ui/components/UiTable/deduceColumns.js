/*
Given an array of arbitrary JSON objects,
return an array of interred column schemas.

e.g.
deduceColumns([
  {
    id: 1,
    firstName: 'hugo',
    lastName: 'duck',
    colors: ['red', 'orange', 'yellow']
  }
])

returns

[
  {
    value: '$.id',
    title: 'id',
    type: 'number'
  },
  {
    value: '$.firstName',
    title: 'firstName',
    type: 'text'
  },
  {
    value: '$.lastName',
    title: 'lastName',
    type: 'text'
  },
  {
    value: '$.colords',
    title: 'Colords',
    type: 'array',
    items: {
      type: 'text'
    }
  },
]

*/

export default function deduceColumns(arrRecords) {
  if (!arrRecords || !Array.isArray(arrRecords) || !arrRecords.length) {
    return []
  }

  const hashColumns = {} //  hashColumns[column property name] = columnData (e.g. hashColumns[id], hashColumns['foo.one'], hashColumns['foo.two'])
  arrRecords.forEach((record) => populateColumns(record, hashColumns))
  return Object.values(hashColumns)
}

function populateColumns(record, hashColumns, prefix = '') {
  for (const [propName, propValue] of Object.entries(record)) {
    if (typeof propValue === 'object' && !Array.isArray(propValue) && propValue !== null) {
      populateColumns(propValue, hashColumns, prefix ? `${prefix}${propName}.` : `${propName}.`)
      continue
    }

    const columnName = prefix + propName
    if (hashColumns[columnName]) {
      continue
    }

    if (Array.isArray(propValue)) {
      hashColumns[columnName] = {
        title: columnName,
        value: `$.${columnName}`,
        type: 'array',
        items: { type: guessType(propValue?.[0], propName) },
      }
    } else {
      hashColumns[columnName] = {
        title: columnName,
        value: `$.${columnName}`,
        type: guessType(propValue, propName),
      }
    }
  }
}

function guessType(value, propName = '') {
  if (typeof value == 'boolean') {
    return 'boolean'
  }

  if (propName.toLowerCase().includes('date')) {
    return 'date'
  }

  if (isNumber(value)) {
    return 'number'
  }

  if (!value || Array.isArray(value) || typeof value !== 'string') {
    return 'text'
  }

  if (value.startsWith('http:') || value.startsWith('https:')) {
    if (['.jpg', '.jpeg', '.png', '.gif', '.gifv'].some((extension) => value.toLowerCase().endsWith(extension))) {
      return 'image'
    }
    return 'url'
  }

  return 'text'
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}