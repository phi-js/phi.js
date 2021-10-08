<template>
  <div class="quiz-rae">

    <div class="quiz-rae-definitions ui-noselect">
      <p
        v-for="(definition,i) in definitions"
        :key="i"
      >{{ definition }}</p>
    </div>

    <div
      class="quiz-rae-input"
      v-show="!isFinished"
    >
      <div>
        <input
          class="ui-native"
          type="text"
          v-model="guess"
          @input="validateGuess(guess)"
          @keyup.esc="giveup()"
        />
      </div>
      <button @click="giveup">Me doy</button>
    </div>

    <div
      v-if="isFinished"
      class="quiz-rae-answers"
    >
      <p
        v-for="(word,i) in answers"
        :key="i"
      >{{word}}</p>
    </div>

    <button
      class="btn-otra"
      tabindex="1"
      @click="fetchRandomWord()"
      v-show="isFinished"
    >Otra!</button>

  </div>
</template>

<script>
import { useApi } from '../../../../../ui';
import apiRae from './api.js';

export default {
  name: 'QuizRae',
  mixins: [useApi],
  $api: apiRae,

  data() {
    return {
      definitions: [],
      answers: [],
      guess: '',
      isCorrect: null,
      isFinished: false,
    };
  },

  mounted() {
    this.fetchRandomWord();
  },

  methods: {
    focusOtra() {
      this.$nextTick(() => this.$el.querySelector('.btn-otra').focus());
    },

    giveup() {
      this.isCorrect = false;
      this.isFinished = true;
      this.$emit('giveup');

      this.focusOtra();
    },

    validateGuess(guess) {
      guess = this.normalize(guess);
      if (!guess) {
        this.isCorrect = null;
        return;
      }

      for (let i = 0; i < this.answers.length; i++) {
        if (guess == this.answers[i]) {
          this.isCorrect = true;
          this.isFinished = true;
          this.$emit('success');
          this.focusOtra();
          return;
        }
      }

      this.isCorrect = false;
    },

    async fetchRandomWord() {
      this.isFinished = false;
      this.isCorrect = null;
      this.guess = '';

      let result = await this.$api.getRandomWord();
      this.definitions = result.definitions;
      this.answers = result.forms.map(this.normalize);

      this.$el.querySelector('input').focus();
    },

    normalize(string) {
      return string
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // normalize('NFD').replace(/[\u0300-\u036f]/g, '') normaliza acentos y dieresis
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();
    },
  },
};
</script>

<style lang="scss">
.quiz-rae {
  .quiz-rae-answers {
    p {
      display: inline;
      margin: 0;
      font-weight: bold;

      &::after {
        content: ' / ';
      }

      &:last-child {
        &::after {
          content: '';
        }
      }
    }
  }
}
</style>