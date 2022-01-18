import dateOps from './date'
import enumOps from './enum'
import numberOps from './number'
import stringOps from './string'

// El orden importa!  Es el orden en el que se listan en StmtOp.vue
export default [
  ...numberOps,
  ...stringOps,
  ...dateOps,
  ...enumOps,
]