import toDate from './toDate.js'

/*
Convierte "cualquier valor" a una cadena "yyyy-mm-dd" (valor valido para usar en <input type="date" value="XXXXX" />)

ej toDateValue(131232131) // unix timestamp
ej toDateValue('1982-01-15')
*/
export default function toDateValue(incoming) {
  const d = toDate(incoming)
  if (!d) {
    return ''
  }

  return d.toISOString()
    .padStart(24, '0')
    .split('T')[0]
}