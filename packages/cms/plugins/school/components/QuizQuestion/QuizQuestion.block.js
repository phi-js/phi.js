const QuizQuestion = () => import('./QuizQuestion.vue')
const QuizQuestionEditor = () => import('./QuizQuestionEditor.vue')

export default {
  "name": "QuizQuestion",
  "tags": ["input", "academia"],
  "title": "Pregunta",
  "icon": "mdi:format-list-checks",

  "block": {
    "component": QuizQuestion,
    "v-model": "question",
    "props": {
      "title": "",
      "options": []
    }
  },

  "editor": {
    "face": {
      "component": QuizQuestionEditor,
      "v-model": "block.props"
    }
  }
};