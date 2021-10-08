<template>
  <div class="quiz-table">
    <div class="quiz-table-header">
      <div v-if="correctAnswers.length == questions.length">
        <!-- <h2>YAAAYYYYY</h2> -->
      </div>
      <input
        v-else
        type="text"
        class="ui-native"
        v-model="answerText"
        @input="onAnswerInput(answerText)"
        placeholder="Escribe aquí"
        style="display: block; width: 100%; margin-bottom: var(--ui-breathe)"
      />
    </div>

    <table
      class="questions-table"
      cellspacing="0"
      cellpadding="0"
    >
      <tbody>
        <tr
          v-for="(question,i) in normalizedQuestions"
          :key="i"
          :class="{'--correct': !!hits[i]}"
        >
          <td
            class="label"
            width="50%"
          >
            <span>{{ question.label }}</span>
          </td>
          <td
            class="answer"
            width="50%"
          >
            <span v-show="!!hits[i]">{{ question.answer }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'QuizTable',

  props: {
    questions: {
      type: Array,
      required: false,
      default: () => [], // [ {label, answer, points} ]
    },
  },

  data() {
    return {
      answerText: '',
      hits: [],
    };
  },

  computed: {
    normalizedQuestions() {
      return this.questions.map((question) => {
        return Object.assign({}, question, {
          normalizedAnswer: this.normalize(question.answer),
        });
      });
    },

    correctAnswers() {
      return this.questions.filter((question, i) => !!this.hits[i]);
    },
  },

  methods: {
    onAnswerInput(guess) {
      let normalizedGuess = this.normalize(guess);
      let foundIndex = this.normalizedQuestions.findIndex(
        (q) => q.normalizedAnswer == normalizedGuess
      );
      if (foundIndex !== -1) {
        this.$set(this.hits, foundIndex, true);
        this.answerText = '';

        if (this.correctAnswers.length == this.questions.length) {
          this.$emit('success');
        }
      }
    },

    normalize(string) {
      return string
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // normalize('NFD').replace(/[\u0300-\u036f]/g, '') normaliza acentos y dieresis
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
    },
  },
};
</script>

<style lang="scss">
.quiz-table {
  .questions-table {
    border-collapse: collapse;
    min-width: 200px;

    tr.--correct {
      background-color: #00800024;
    }

    td {
      padding: var(--ui-padding);
      border: 1px solid #ccc;
    }
  }
}
</style>