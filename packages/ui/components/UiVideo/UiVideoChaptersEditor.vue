<template>
  <div class="UiVideoChaptersEditor ui-row --top --tight">
    <div
      v-if="url"
      class="editor-video"
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
          v-model="innerModel[i].name"
          type="text"
          class="ui__input"
          @input="emitInput"
        >
        <input
          v-model="innerModel[i].start"
          type="number"
          class="ui__input"
          placeholder="inicio (ms.)"
          style="width: 6em"
          @input="emitInput"
        >
        <input
          v-model="innerModel[i].end"
          type="number"
          class="ui__input"
          placeholder="fin (ms.)"
          style="width: 6em"
          @input="emitInput"
        >
        <button
          type="button"
          class="ui-button"
          @click="removeChapter(i)"
        >
          <UiIcon src="mdi:close" />
        </button>
      </div>

      <div class="chapter-item chapter-adder ui-group --block">
        <input
          v-model="newChapter.name"
          type="text"
          class="ui__input"
          placeholder="Nombre"
        >
        <input
          v-model="newChapter.start"
          type="number"
          class="ui__input"
          placeholder="inicio (ms.)"
          style="width: 6em"
        >
        <input
          v-model="newChapter.end"
          type="number"
          class="ui__input"
          placeholder="fin (ms.)"
          style="width: 6em"
        >
        <button
          type="button"
          class="ui-button"
          :disabled="!newChapter.name || newChapter.start === null"
          @click="addChapter"
        >
          <UiIcon src="mdi:plus" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import UiVideo from './UiVideo.vue'
import UiIcon from '../UiIcon/UiIcon.vue'

export default {
  name: 'UiVideoChaptersEditor',
  components: { UiVideo, UiIcon },

  props: {
    url: {
      type: String,
      required: true,
    },

    modelValue: {
      type: Array,
      required: false,
      default: null,
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      pointer: 0,
      innerModel: null,

      newChapter: {
        name: '',
        start: null,
        end: null,
      },
    }
  },

  computed: {
    sanitizedChapters() {
      return this.innerModel.map((chapter) => ({
        ...chapter,
        isActive:
          chapter.start <= this.pointer && this.pointer < (chapter.end || Infinity),
      }))
    },
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.innerModel = Array.isArray(newValue)
          ? JSON.parse(JSON.stringify(newValue))
          : []
      },
    },
  },

  methods: {
    onTimeupdate(evt) {
      this.pointer = evt.time
      this.newChapter.start = evt.time
    },

    emitInput() {
      this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.innerModel)))
    },

    addChapter() {
      this.innerModel.push(this.newChapter)
      this.newChapter = {
        name: '',
        start: null,
        end: null,
      }

      this.emitInput()
    },

    removeChapter(index) {
      this.innerModel.splice(index, 1)
      this.emitInput()
    },
  },
}
</script>