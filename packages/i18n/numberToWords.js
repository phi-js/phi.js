export default function numberToWords(num) {
  if (num > 999999999999) {
    return num
  }

  num = parseFloat(num).toFixed(2)
  num = num.toString()

  /* Special case */
  if (num == 1) {
    return 'uno'
  }

  let decimals = false
  let pos = num.indexOf('.')
  if (pos > -1) {
    decimals = parseInt(num.substr(pos + 1))
    num = parseInt(num.substr(0, pos))
  }

  num = num.toString().padStart(12, '0')
  let bills = num.substr(0, 3)
  let mills = num.substr(3, 3)
  let thou = num.substr(6, 3)
  let cent = num.substr(9, 3)
  let word = ''
  let th = ''

  word += bills > 0 ? base(bills) + (bills == 1 ? ' billón ' : ' billones ') : ''
  word += mills > 0 ? base(mills) + (mills == 1 ? ' millón ' : ' millones ') : ''
  word += thou > 0 ? ((th = base(thou)) != 'un' ? th : '') + ' mil ' : ''
  word += cent > 0 ? base(cent) : ''

  if (decimals) {
    word += ' con ' + base(decimals)
  }

  return word
}

function base(num) {
  if (num < 0 || num > 999) {
    return ''
  }

  //Casos especiales
  if (num == 100) {
    return 'cien'
  }

  num = num.toString().padStart(3, '0')

  let cen = num[0] > 1 ? unit(num[0]) + 'cientos ' : (num[0] == 1 ? 'ciento ' : '')
  let dec = num[1] > 1 ? ten(num[1]) : (num[1] == 1 ? special(num[1] + num[2]) : '')
  let uni = num[1] != 1 && num[2] ? unit(num[2]) : ''

  if (dec && uni) {
    dec += ' y '
  }

  let draft = cen + dec + uni
  draft = draft.replace('veinte y ', 'veinti')
  draft = draft.replace('cincocientos', 'quinientos')
  draft = draft.replace('sietecientos', 'setecientos')
  draft = draft.replace('nuevecientos', 'novecientos')
  return draft
}

function unit(unit) {
  switch (parseInt(unit)) {
  case 0:
    return ''
  case 1:
    return 'un'
  case 2:
    return 'dos'
  case 3:
    return 'tres'
  case 4:
    return 'cuatro'
  case 5:
    return 'cinco'
  case 6:
    return 'seis'
  case 7:
    return 'siete'
  case 8:
    return 'ocho'
  case 9:
    return 'nueve'
  case 10:
    return 'diez'
  default:
    throw new Error('Unidad inválida')
  }
}

function ten(num) {
  switch (parseInt(num)) {
  case 0:
    return ''
  case 2:
    return 'veinte'
  case 3:
    return 'treinta'
  case 4:
    return 'cuarenta'
  case 5:
    return 'cincuenta'
  case 6:
    return 'sesenta'
  case 7:
    return 'setenta'
  case 8:
    return 'ochenta'
  case 9:
    return 'noventa'
  }
}

function special(num) {
  switch (parseInt(num)) {
  case 10:
    return 'diez'
  case 11:
    return 'once'
  case 12:
    return 'doce'
  case 13:
    return 'trece'
  case 14:
    return 'catorce'
  case 15:
    return 'quince'
  case 16:
    return 'dieciseis'
  case 17:
    return 'diecisiete'
  case 18:
    return 'dieciocho'
  case 19:
    return 'diecinueve'
  }
}