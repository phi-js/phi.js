import MathKatex from './components/MathKatex/MathKatex.block.js'
import QuizQuestion from './components/QuizQuestion/QuizQuestion.block.js'
// import QuizRae from './components/QuizRae/QuizRae.block.js'
// import QuizTable from './components/QuizTable/QuizTable.block.js'
// import UiTimer from './components/UiTimer/UiTimer.block.js'

export default {
  name: "cms-plugin-school",
  version: "0.1.0",
  description: "Elementos para el salon de clase (formulas, tablero, diccionaro, etc)",

  blocks: {
    MathKatex,
    QuizQuestion,
    // QuizRae,
    // QuizTable,
    // UiTimer
  },

  actions: {}
}