export default function toDate(input) {
  // Falsy
  if (!input) {
    return null;
  }

  // Objetos fecha validos
  if (input instanceof Date) {
    return !isNaN(input) ? input : null;
  }

  // Formato "day" ddmmyyyy
  if (typeof input == 'string' && input.length == 8) {
    let retval = new Date();
    retval.setMonth(parseInt(input.substr(2, 2)) - 1, input.substr(0, 2));
    retval.setFullYear(input.substr(4, 4));
    retval.setHours(0, 0, 0, 0);
    return retval;
  }

  // Numeros o cadenas en formato EPOCH (unix timestamp)
  if ((typeof input == 'string' || typeof input == 'number') && !isNaN(input) && input.toString().length <= 10) {
    return new Date(input * 1000);
  }

  let date = new Date(input);
  return isNaN(date) ? null : date;
}