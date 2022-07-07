export function normalizeQuery(query) {
  if (!query || typeof query != 'object') {
    return {
      from: {
        source: '',
        table: '',
      },
      properties: [],
      match: [],
    }
  }

  return {
    ...query,
    from: normalizeFrom(query.from),
    on: normalizeOn(query.on),
    properties: normalizeProperties(query.properties),
    match: normalizeMatch(query.match),
  }
}

export function denormalizeQuery(innerQuery) {
  // desanitize ON
  let on = undefined
  if (innerQuery.on?.length) {
    on = {}
    innerQuery.on.forEach((link) => on[link.local] = link.foreign)
  }

  // de-sanitize properties
  const properties = innerQuery.properties.map((innerProp) => {
    if (innerProp.type == 'string') {
      return innerProp.value
    }
    if (innerProp.type == 'object') {
      return { [innerProp.name]: innerProp.value }
    }
  })

  // desanitize Match
  let match = undefined
  if (innerQuery.match?.length) {
    match = {}
    innerQuery.match.forEach((link) => match[link.propertyName] = link.propertyValue)
  }

  return {
    ...innerQuery,
    from: { [innerQuery.from.source]: innerQuery.from.table },
    on,
    properties,
    match,
  }
}


/*
given
"from": {"sourceName": "tableName"}
returns
"from": {
  "source": "sourceName",
  "table": "tableName"
}
*/
function normalizeFrom(from) {
  if (!from || typeof from != 'object') {
    return {
      source: 'default',
      table: typeof from == 'string' ? from : '',
    }
  }

  for (const [key, value] of Object.entries(from)) {
    return {
      source: key,
      table: value,
    }
  }
}

/*
{
  "id": "key1",
  "somethinElse": "key2"
}
->
[
  {
    "local": "id",
    "foreign": "key1"
  },
  {
    "local": "somethingElse",
    "foreign": "key2"
  }
]
*/
function normalizeOn(objOn) {
  if (!objOn || typeof objOn != 'object') {
    return []
  }

  const retval = []
  for (const [propName, propValue] of Object.entries(objOn)) {
    retval.push({
      local: propName,
      foreign: propValue,
    })
  }
  return retval
}


function normalizeMatch(objMatch) {
  if (!objMatch || typeof objMatch != 'object') {
    return []
  }

  const retval = []
  for (const [propName, propValue] of Object.entries(objMatch)) {
    retval.push({
      propertyName: propName,
      propertyValue: propValue,
    })
  }
  return retval
}


/*
"properties": [
  "*",
  {
    "objPerson": {
      "single": true,
      "from": { "entity": "Phidias\\Core\\Person\\Entity" },
      ...
    }
  }
]

<<<

[
  {
    type: "string",
    value: "*"
  },
  {
    type: "object",
    name: "objPerson",
    value: {
      "from": ...
    }
  }
]
*/
function normalizeProperties(props) {
  if (!props) {
    return []
  }

  if (typeof props == 'string') {
    return [{
      type: 'string',
      value: props,
    }]
  }

  if (!Array.isArray(props)) {
    return []
  }

  return props.map((prop) => {
    if (typeof prop == 'string') {
      return { type: 'string', value: prop }
    }

    if (typeof prop == 'object') {
      return {
        type: 'object',
        name: Object.keys(prop)[0],
        value: Object.values(prop)[0],
      }
    }
  })
}