export default function toDate(input) {
  // Falsy
  if (!input) {
    return null
  }

  // Native date objects
  if (input instanceof Date) {
    return !isNaN(input) ? input : null
  }

  // "day" format ddmmyyyy
  if (typeof input == 'string' && input.length == 8) {
    let retval = new Date()
    retval.setMonth(parseInt(input.substr(2, 2)) - 1, input.substr(0, 2))
    retval.setFullYear(input.substr(4, 4))
    retval.setHours(0, 0, 0, 0)
    return retval
  }

  // Unix timestamps
  if (
    (typeof input == 'string' || typeof input == 'number') &&
    !isNaN(input) &&
    input.toString().length <= 10
  ) {
    return new Date(input * 1000)
  }

  // Pass value to native Date constructor
  let date = new Date(input)
  return isNaN(date) ? null : date
}
