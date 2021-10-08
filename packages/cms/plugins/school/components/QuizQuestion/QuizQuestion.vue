<template>
  <div
    class="quiz-question"
    :class="{'--required': required}"
  >
    <h3 class="quiz-title">{{ title }}</h3>

    <div class="quiz-options">
      <UiItem
        v-for="(option,i) in options"
        :key="i"
        :icon="option.value == value ? 'mdi:radiobox-marked' : 'mdi:radiobox-blank'"
        :text="option.text"
        class="ui-clickable"
        @click="$emit('input', option.value)"
      />
    </div>
  </div>
</template>

<script>
import { UiItem } from '../../../../../ui';

export default {
  name: 'QuizQuestion',
  components: { UiItem },

  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },

    title: {
      type: String,
      required: false,
      default: null,
    },

    options: {
      type: Array,
      required: false,
      default: () => [],
    },

    required: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.quiz-question {
  border-radius: var(--ui-radius);
  padding: var(--ui-padding);
  background-color: rgba(0, 0, 255, 0.03);

  .quiz-title {
    white-space: pre-wrap;
  }

  .quiz-options {
    font-size: 14px;
  }

  &.--required {
    .quiz-title::before {
      content: '*';
      color: var(--ui-color-danger);
    }
  }
}
</style>