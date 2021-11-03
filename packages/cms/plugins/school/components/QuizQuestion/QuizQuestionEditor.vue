<template>
  <div class="quiz-question-editor quiz-question">
    <h3 class="quiz-title">
      <textarea
        class="quiz-title-input"
        placeholder="Escribe aquí la pregunta"
        type="text"
        v-model="innerValue.title"
        @input="emitInput"
        rows="3"
      ></textarea>
    </h3>

    <div class="quiz-options">
      <draggable
        handle=".item-icon"
        v-model="innerValue.options"
        @input="emitInput"
      >
        <UiItem
          v-for="(option,i) in innerValue.options"
          :key="i"
          class="quiz-option-item ui--clickable"
          icon="mdi:radiobox-blank"
        >
          <template #text>
            <div class="quiz-option-inputs">
              <input
                type="text"
                class="option-text"
                placeholder="Texto de la opción"
                v-model="innerValue.options[i].text"
                @input="innerValue.options[i].value = $event.target.value; emitInput()"
              />
              <input
                type="number"
                min="0"
                max="100"
                class="option-value"
                placeholder="Puntos"
                v-model="innerValue.options[i].score"
                @input="emitInput"
              />
            </div>
          </template>

          <template #right>
            <UiIcon
              value="mdi:delete"
              class="ui--clickable"
              @click.stop="removeOption(i)"
            />
          </template>
        </UiItem>
      </draggable>

      <UiItem
        class="quiz-option-adder ui--clickable"
        icon="mdi:plus-circle"
        text="Agregar opción"
        @click="addOption()"
      />
    </div>
  </div>
</template>

<script>
import { UiItem, UiIcon } from '../../../../../ui';
import draggable from 'vuedraggable';

export default {
  name: 'QuizQuestionEditor',
  components: { UiItem, UiIcon, draggable },

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      innerValue: {},
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.innerValue = JSON.parse(JSON.stringify(newValue));
      },
    },
  },

  mounted() {
    this.$nextTick(this.resizeTextarea);
  },

  methods: {
    addOption() {
      this.innerValue.options.push({
        text: '',
        value: '',
      });
      this.emitInput();
    },

    removeOption(index) {
      if (
        !!this.innerValue.options[index].text &&
        !confirm('Eliminar esta opción ?')
      ) {
        return;
      }

      this.innerValue.options.splice(index, 1);
      this.emitInput();
    },

    resizeTextarea() {
      let textarea = this.$el.querySelector('.quiz-title-input');

      textarea.style.boxSizing = 'border-box';
      let offset = textarea.offsetHeight - textarea.clientHeight;
      textarea.style.height = '2px';
      textarea.style.height = textarea.scrollHeight + offset + 'px';
    },

    emitInput() {
      this.resizeTextarea();
      this.$emit('input', JSON.parse(JSON.stringify(this.innerValue)));
    },
  },
};
</script>

<style lang="scss">
.quiz-question-editor {
  .quiz-title {
    .quiz-title-input {
      font: inherit;
      border: 0;
      background-color: transparent;
      width: 100%;
      resize: vertical;
    }
  }

  .quiz-option-item {
    .item-icon {
      cursor: move;
    }
  }

  .quiz-option-inputs {
    display: flex;
    flex-wrap: nowrap;

    input.option-text {
      font: inherit;
      border: 0;
      background-color: transparent;
      width: 100%;
      flex: 1;
    }

    input.option-value {
      width: 5em;
      text-align: right;
    }
  }
}
</style>