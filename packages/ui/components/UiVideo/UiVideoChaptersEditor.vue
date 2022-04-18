<script>
import UiVideo from './UiVideo.vue'
import UiIcon from '../UiIcon/UiIcon.vue'
import UiButton from '../UiButton/UiButton.vue'

export default {
  name: 'UiVideoChaptersEditor',
  components: { UiVideo, UiIcon, UiButton },

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
    }
  },

  computed: {
    sanitizedChapters() {
      return this.innerModel.map((chapter) => ({
        ...chapter,
        isActive: chapter.start <= this.pointer && this.pointer < (chapter.end || Infinity),
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
    emitInput() {
      this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.innerModel)))
    },

    pushChapter(time = 0) {
      // Set previous chapter's END time
      if (this.innerModel[this.innerModel.length - 1] && this.innerModel[this.innerModel.length - 1].end === null) {
        this.innerModel[this.innerModel.length - 1].end = time
      }

      this.innerModel.push({
        name: '',
        start: time,
        end: null,
      })

      this.emitInput()
    },

    removeChapter(index) {
      this.innerModel.splice(index, 1)
      this.emitInput()
    },
  },
}
</script>

<template>
  <div class="UiVideoChaptersEditor">
    <div
      v-if="url"
      class="UiVideoChaptersEditor__video"
    >
      <UiVideo
        v-model:current-time="pointer"
        :url="url"
        style="width: 300px"
      />
    </div>

    <div class="UiVideoChaptersEditor__chapters">
      <div
        v-for="(chapter, i) in sanitizedChapters"
        :key="i"
        class="UiVideoChaptersEditor__chapter UiGroup"
        :class="{'UiVideoChaptersEditor__chapter--active': chapter.isActive}"
      >
        <input
          v-model="innerModel[i].name"
          type="text"
          class="UiInput"
          placeholder="Nombre del capítulo"
          @input="emitInput"
        >
        <input
          v-model="innerModel[i].start"
          type="number"
          class="UiInput"
          placeholder="inicio (ms.)"
          style="width: 6em"
          @input="emitInput"
        >
        <input
          v-model="innerModel[i].end"
          type="number"
          class="UiInput"
          placeholder="fin (ms.)"
          style="width: 6em"
          @input="emitInput"
        >
        <UiIcon
          :src="innerModel[i].pauseOnEnter ? 'mdi:pause' : 'mdi:play'"
          style="width: 40px;"
          class="ui--clickable"
          @click="innerModel[i].pauseOnEnter = !innerModel[i].pauseOnEnter; emitInput();"
        />

        <UiIcon
          class="ui--clickable"
          src="mdi:close"
          style="width: 40px; height: 40px; margin-left: 1rem;"
          @click="removeChapter(i)"
        />
      </div>

      <div class="UiVideoChaptersEditor__adder">
        <UiButton
          :label="`Create chapter (${pointer} ms)`"
          style="margin: 12px"
          @click="pushChapter(pointer)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.UiVideoChaptersEditor {
  display: flex;
  flex-wrap: wrap;

  &__chapters {
    flex: 1;
  }

  &__chapter {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    &--active {
      border: 1px solid var(--ui-color-primary);
      border-radius: 5px;
    }

    & > :first-child {
      flex: 1;
    }
  }
}
</style>