/*
Retorna un objeto con las propiedades estandar del evento y las fechas como objetos Date
o NULL cuando el objeto no es valido (propiedades incompletas o fechas no formateables)
*/
export function sanitizeEventAsObjects(event) {
  if (!event) {
    return null
  }

  let clone = JSON.parse(JSON.stringify(event))

  // Backward compatibility con la especificacion anterior (start, date y allDay en vez de dateStart, dateEnd, isAllDay)
  if (typeof clone.start != 'undefined') {
    clone.dateStart = clone.start
  }
  if (typeof clone.end != 'undefined') {
    clone.dateEnd = clone.end
  }
  if (typeof clone.allDay != 'undefined') {
    clone.isAllDay = clone.allDay
  }
  /////


  clone.isAllDay = !!clone.isAllDay // Asegurar que isAllDay sea un booleano

  // dateStart es obligatorio
  if (typeof clone.dateStart == 'undefined') {
    return null
  }

  // dateEnd es obligatorio solo cuando el evento no ocurre todo el dia
  if (typeof clone.dateEnd == 'undefined' && !clone.isAllDay) {
    return null
  }

  clone.dateStart = toDate(clone.dateStart)
  if (clone.dateStart === null) {
    return null
  }

  if (clone.dateEnd) {
    clone.dateEnd = toDate(clone.dateEnd)
    if (clone.dateEnd === null) {
      return null
    }
  }

  return clone
}

/*
Retorna un objeto JSON-izable, con fechas en formato EPOCH
Es decir, retorna un objeto listo para almacenar en DB (o enviar via PI)
*/
export function sanitizeEventAsStrings(event) {
  let clone = sanitizeEventAsObjects(event)
  if (clone === null) {
    return null
  }

  clone.dateStart = Math.floor(clone.dateStart.getTime() / 1000)
  clone.dateEnd = Math.floor(clone.dateEnd.getTime() / 1000)

  return clone
}


export function toDate(input) {
  // Objetos fecha validos
  if (input instanceof Date) {
    return !isNaN(input) ? input : null
  }

  // Numeros o cadenas en formato EPOCH
  if ((typeof input == 'string' || typeof input == 'number') && !isNaN(input) && input.toString().length <= 10) {
    return new Date(input * 1000)
  }

  let date = new Date(input)
  return isNaN(date) ? null : date
}


const dayNames = {
  singular: [
    'domingo', // indice 0: domingo
    'lunes', // indice 1: lunes
    'martes', // ...
    'miércoles',
    'jueves',
    'viernes',
    'sábado', // indice 6: sabado
  ],

  plural: [
    'domingos', // indice 0: domingo
    'lunes', // indice 1: lunes
    'martes', // ...
    'miércoles',
    'jueves',
    'viernes',
    'sábados', // indice 6: sabado
  ],
}


// primer lunes,  cuarto miercoles,  ultimo viernes ..
export function getOrdinal(date) {
  if (!date) {
    return 'día'
  }

  let ordinals = [
    '', // 0seimo
    'primer',
    'segundo',
    'tercer',
    'cuarto',
    'último',
  ]

  let dayName = translateDay(date.getDay())
  let nth = Math.ceil(date.getDate() / 7)

  let test = new Date(date.getTime())
  test.setDate(date.getDate() + 7)
  if (test.getMonth() != date.getMonth()) {
    nth = 5 // último
  }

  let ordinal = ordinals[nth]

  return `${ordinal} ${dayName}`
}

function translateDay(dayNumber, plural = false, isMondayZero = false) {
  if (isMondayZero) {
    dayNumber = (dayNumber + 1) % 7
  }

  let target = plural ? dayNames.plural : dayNames.singular
  return typeof target[dayNumber] !== 'undefined' ? target[dayNumber] : `Dia ${dayNumber}?`
}


export function redactRepeat(repeat, event = null) {
  if (!repeat || !repeat.interval) {
    return 'No se repite'
  }

  let eventDate =
    event && event.dateStart
      ? toDate(event.dateStart)
      : null

  // clone
  repeat = JSON.parse(JSON.stringify(repeat))

  // sanitize
  if (repeat.frequency == 'weekly' && !repeat.days && eventDate) {
    repeat.days = [eventDate.getDay()]
  }

  let phrases = {
    singular: {
      daily: 'Todos los días',
      weekly: `${redactDays(repeat.days)} cada semana`,
      monthly_day: eventDate ? `El día ${eventDate.getDate()} de cada mes` : 'Cada mes',
      monthly_weekday: `El ${getOrdinal(eventDate)} del mes`,
      yearly: 'Cada año',
    },

    plural: {
      daily: `Cada ${repeat.interval} días`,
      weekly: `${redactDays(repeat.days)} cada ${repeat.interval} semanas`,
      monthly_day: eventDate ? `El día ${eventDate.getDate()} cada ${repeat.interval} meses` : `Cada ${repeat.interval} meses`,
      monthly_weekday: `El ${getOrdinal(eventDate)} cada ${repeat.interval} meses`,
      yearly: `Cada ${repeat.interval} años`,
    },
  }

  return repeat.interval == 1 ? phrases.singular[repeat.frequency] : phrases.plural[repeat.frequency]
}

function redactDays(days) {
  if (!days || !days.length) {
    return ''
  }

  let copy = [].concat(days)

  // Los dias vienen expresados com 0: domingo hasta 6: sabado.
  // Para redactarlos en orden lunes-domingo, los valores se modifican asi:
  // 0: lunes - 6: domingo y se organizan ascendente
  copy = copy.map((day) => day < 1 ? 6 : day - 1)
  copy.sort()

  let words = copy.map((day) => translateDay(day, true, true))
  if (words.length <= 2) {
    return words.join(' y ')
  }

  // Rangos.  Para 4 o mas dias secuenciales redactar como "lunes a jueves"
  if (copy.length >= 4) {
    let isSequential = (copy[0] + copy.length - 1) % 8 == copy[copy.length - 1]
    if (isSequential) {
      let firstDay = translateDay(copy[0], false, true)
      let lastDay = translateDay(copy[copy.length - 1], false, true)
      return `De ${firstDay} a ${lastDay}`
    }
  }

  return (
    words.slice(0, -2).join(', ') +
    ', ' +
    words.slice(-2).join(' y ')
  )
}