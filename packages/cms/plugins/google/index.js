import findRow from './actions/sheet/findRow.js'
import getRange from './actions/sheet/getRange.js'
import saveRow from './actions/sheet/saveRow.js'

export default {
  actions: {
    'google.sheets.findRow': findRow,
    'google.sheets.getRange': getRange,
    'google.sheets.saveRow': saveRow,
  }
}