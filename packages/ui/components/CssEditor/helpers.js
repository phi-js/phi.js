
/*
parsePositionString('right center')
{
  x: { value: 'right', units: null },
  y: { value: 'center', units: null }
}

parsePositionString('100px 50%')
{
  x: { value: 100, units: 'px' },
  y: { value: 50, units: '%' }
}
*/
export function parsePositionString(strPosition) {
  if (!strPosition || !strPosition.split) {
    return {
      x: { value: 'left', units: null },
      y: { value: 'top', units: null },
    }
  }

  const parts = strPosition.split(' ')
  if (parts.length != 2) {
    return {
      x: { value: 'left', units: null },
      y: { value: 'top', units: null },
    }
  }

  return {
    x: parseUnitString(parts[0]),
    y: parseUnitString(parts[1]),
  }
}


/*
positionToString({
  x: { value: 'center', units: null},
  y: { value: '30', units: '%'},
})
"center 30%"
*/
export function positionToString(objPosition) {
  const xValue = unitToString(objPosition.x)
  const yValue = unitToString(objPosition.y)
  return `${xValue} ${yValue}`.trim()
}



/*
parseUnitString('center')
{ value: 'center', units: null }

parseUnitString('100px')
{ value: 100, units: 'px' }
*/
export function parseUnitString(strUnit, emptyValue = null) {
  if (strUnit === emptyValue) {
    return { value: null, units: null }
  }

  const intValue = parseInt(strUnit)
  if (isNaN(intValue)) {
    return { value: strUnit, units: null }
  }

  const units = strUnit.replace(intValue, '')
  return { value: intValue, units }
}

export function unitToString(objUnit) {
  if (!objUnit || typeof objUnit !== 'object') {
    return ''
  }

  if (!objUnit.units) {
    return objUnit.value
  }

  const intValue = parseInt(objUnit.value)
  if (isNaN(intValue)) {
    return `0${objUnit.units}`
  }

  return `${objUnit.value}${objUnit.units}`
}