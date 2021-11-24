<template>
  <div class="UiVideoChaptersEditor">
    <div
      v-if="url"
      class="UiVideoChaptersEditor__video"
    >
      <UiVideo
        :url="url"
        style="width: 300px"
        @timeupdate="onTimeupdate"
      />
    </div>

    <div class="UiVideoChaptersEditor__chapters">
      <div
        v-for="(chapter, i) in sanitizedChapters"
        :key="i"
        class="UiVideoChaptersEditor__chapter ui__group"
        :class="{'ui-highlighted': chapter.isActive}"
      >
        <input
          v-model="innerModel[i].name"
          type="text"
          class="ui__input"
          placeholder="Nombre del capítulo"
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
        <UiIcon
          class="ui--clickable"
          src="mdi:close"
          style="width: 40px; height: 40px"
          @click="removeChapter(i)"
        />
      </div>

      <div class="UiVideoChaptersEditor__chapter UiVideoChaptersEditor__chapter--adder ui__group">
        <input
          v-model="newChapter.name"
          type="text"
          class="ui__input"
          placeholder="Nombre del capítulo"
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
        <UiIcon
          src="mdi:plus"
          class="ui--clickable"
          style="width: 40px; height: 40px"
          :disabled="!newChapter.name || newChapter.start === null"
          @click="addChapter"
        />
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

<style lang="scss">
.UiVideoChaptersEditor {
  display: flex;
  flex-wrap: wrap;

  &__chapters {
    flex: 1;
  }

  &__video {
    margin-right: var(--ui-padding-horizontal);
  }

  &__chapter {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    & > :first-child {
      flex: 1;
    }
  }
}
</style>