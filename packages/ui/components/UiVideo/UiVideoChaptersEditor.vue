<template>
  <div class="UiVideoChaptersEditor ui-row --top --tight">
    <div
      class="editor-video"
      v-if="url"
    >
      <UiVideo
        :url="url"
        style="width: 300px"
        class="ui-breathe"
        @timeupdate="onTimeupdate"
      />
    </div>

    <div class="editor-chapters">
      <div
        v-for="(chapter, i) in sanitizedChapters"
        :key="i"
        class="chapter-item ui-group --block"
        :class="{'ui-highlighted': chapter.isActive}"
      >
        <input
          type="text"
          class="ui-native"
          v-model="innerModel[i].name"
          @input="emitInput"
        />
        <input
          type="number"
          class="ui-native"
          v-model="innerModel[i].start"
          placeholder="inicio (ms.)"
          @input="emitInput"
          style="width: 6em"
        />
        <input
          type="number"
          class="ui-native"
          v-model="innerModel[i].end"
          placeholder="fin (ms.)"
          @input="emitInput"
          style="width: 6em"
        />
        <button
          type="button"
          class="ui-button"
          @click="removeChapter(i)"
        >
          <UiIcon value="mdi:close" />
        </button>
      </div>

      <div class="chapter-item chapter-adder ui-group --block">
        <input
          type="text"
          class="ui-native"
          v-model="newChapter.name"
          placeholder="Nombre"
        />
        <input
          type="number"
          class="ui-native"
          v-model="newChapter.start"
          placeholder="inicio (ms.)"
          style="width: 6em"
        />
        <input
          type="number"
          class="ui-native"
          v-model="newChapter.end"
          placeholder="fin (ms.)"
          style="width: 6em"
        />
        <button
          type="button"
          class="ui-button"
          @click="addChapter"
          :disabled="!newChapter.name || newChapter.start === null"
        >
          <UiIcon value="mdi:plus" />
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import UiVideo from './UiVideo.vue';
import UiIcon from '../UiIcon/UiIcon.vue';

export default {
  name: 'UiVideoChaptersEditor',
  components: { UiVideo, UiIcon },

  props: {
    value: {
      required: false,
      default: null,
    },

    url: {
      required: false,
      default: null,
    },
  },

  data() {
    return {
      pointer: 0,
      innerModel: null,

      newChapter: {
        name: '',
        start: null,
        end: null,
      },
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.innerModel = Array.isArray(newValue)
          ? JSON.parse(JSON.stringify(newValue))
          : [];
      },
    },
  },

  computed: {
    sanitizedChapters() {
      return this.innerModel.map((chapter) => ({
        ...chapter,
        isActive:
          chapter.start <= this.pointer && this.pointer < (chapter.end || Infinity),
      }));
    },
  },

  methods: {
    onTimeupdate(evt) {
      this.pointer = evt.time;
      this.newChapter.start = evt.time;
    },

    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerModel)));
    },

    addChapter() {
      this.innerModel.push(this.newChapter);
      this.newChapter = {
        name: '',
        start: null,
        end: null,
      };

      this.emitInput();
    },

    removeChapter(index) {
      this.innerModel.splice(index, 1);
      this.emitInput();
    },
  },
};
</script>