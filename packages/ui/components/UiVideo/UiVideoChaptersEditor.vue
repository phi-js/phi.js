<script>
import { defineAsyncComponent } from 'vue'

import UiButton from '../UiButton/UiButton.vue'
import UiDialog from '../UiDialog/UiDialog.vue'
import UiIcon from '../UiIcon/UiIcon.vue'
import UiInput from '../UiInput/UiInput.vue'
import TempValue from '../TempValue/TempValue.vue'

import UiVideo from './UiVideo.vue'
import ChapterEditor from './ChapterEditor.vue'

// import draggable from 'vuedraggable'
const draggable = defineAsyncComponent(() => import('vuedraggable'))

export default {
  name: 'UiVideoChaptersEditor',
  components: {
    draggable,
    UiButton,
    UiDialog,
    UiIcon,
    UiInput,
    TempValue,
    UiVideo,
    ChapterEditor,
  },

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
      isPlaying: false,
    }
  },

  computed: {
    activeChapterIndexes() {
      return this.innerModel.map((chapter) => chapter.start <= this.pointer && this.pointer < (chapter.end || Infinity))
    },

    strPointer() {
      const intValue = parseInt(this.pointer) || 0

      const parts = {
        hour: Math.floor(intValue / 3.6e+6),
        minute: Math.floor(intValue / 60000) % 60,
        second: Math.floor(intValue / 1000) % 60,
        millisecond: intValue % 1000,
      }

      return `${parts.minute}:${parts.second}:${parts.millisecond}`
    },
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.innerModel = Array.isArray(newValue)
          ? JSON.parse(JSON.stringify(newValue))
          : []

        this.innerModel.forEach((c, i) => c._index = i)
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

    onKeyUp(index) {
      const targetIndex = Math.max(index - 1, 0)
      if (targetIndex == index) {
        return
      }

      const item = this.innerModel[index]
      this.innerModel.splice(index, 1)
      this.innerModel.splice(targetIndex, 0, item)

      this.emitInput()

      this.$nextTick(() => {
        const elems = this.$el.querySelectorAll('.UiVideoChaptersEditor__chapterName')
        elems[targetIndex].querySelector('input').focus()
      })
    },

    onKeyDown(index) {
      const targetIndex = Math.min(index + 1, this.innerModel.length - 1)
      if (targetIndex == index) {
        return
      }

      const item = this.innerModel[index]
      this.innerModel.splice(index, 1)
      this.innerModel.splice(targetIndex, 0, item)

      this.emitInput()

      this.$nextTick(() => {
        const elems = this.$el.querySelectorAll('.UiVideoChaptersEditor__chapterName')
        elems[targetIndex].querySelector('input').focus()
      })
    },
  },
}
</script>

<template>
  <div class="UiVideoChaptersEditor">
    <UiVideo
      v-if="url"
      v-model:current-time="pointer"
      v-model:is-playing="isPlaying"
      class="UiVideoChaptersEditor__video"
      :url="url"
    />

    <table class="UiVideoChaptersEditor__table">
      <thead>
        <tr>
          <th />
          <th width="100%">
            Chapter name
          </th>
          <th align="right">
            Start
          </th>
          <th align="right">
            End
          </th>
          <th />
        </tr>
      </thead>

      <draggable
        v-model="innerModel"
        tag="tbody"
        handle=".UiVideoChaptersEditor__chapterName"
        item-key="_index"
        @update:model-value="emitInput"
      >
        <template #item="{ element, index }">
          <tr
            class="UiVideoChaptersEditor__chapter"
            :class="{'UiVideoChaptersEditor__chapter--active': activeChapterIndexes[index]}"
          >
            <td>
              <UiIcon
                src="mdi:pan-right"
                class="ui--clickable"
                title="Go to chapter start"
                @click="pointer = element.start"
              />
            </td>
            <td nowrap>
              <UiInput
                v-model="innerModel[index].name"
                type="text"
                class="UiVideoChaptersEditor__chapterName"
                placeholder="Nombre del capítulo"
                @update:model-value="emitInput"
                @keyup.up="onKeyUp(index)"
                @keyup.down="onKeyDown(index)"
              />
            </td>
            <td
              align="right"
              nowrap
            >
              <UiInput
                v-model="innerModel[index].start"
                type="timer"
                placeholder="inicio (ms.)"
                @update:model-value="emitInput"
              />
            </td>
            <td
              align="right"
              nowrap
            >
              <UiInput
                v-model="innerModel[index].end"
                type="timer"
                placeholder="fin (ms.)"
                @update:model-value="emitInput"
              />
            </td>
            <td nowrap>
              <TempValue
                v-slot="{ tmp, accept, cancel}"
                v-model="innerModel[index]"
                @update:model-value="emitInput"
              >
                <UiDialog
                  style="display:inline-block"
                  @accept="accept()"
                  @cancel="cancel()"
                >
                  <template #trigger>
                    <UiIcon
                      class="ui--clickable"
                      src="mdi:dots-vertical"
                    />
                  </template>
                  <template #default>
                    <ChapterEditor v-model="tmp.value" />
                  </template>
                </UiDialog>
              </TempValue>

              <UiIcon
                class="ui--clickable"
                src="mdi:close"
                @click="removeChapter(index)"
              />
            </td>
          </tr>
        </template>
      </draggable>

      <tfoot>
        <tr>
          <td />
          <td>
            <UiButton
              label="Create chapter"
              style="margin-right: 1rem"
              @click="pushChapter(pointer)"
            />
          </td>
          <td>
            <UiInput
              v-model="pointer"
              type="timer"
            />
          </td>
          <td />
          <td />
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style lang="scss">
.UiVideoChaptersEditor {
  &__video {
    width: 100%;
    min-height: 0;
    height: 180px;

    position: sticky;
    top: 0;
  }

  &__table {
    width: 100%;

    thead {
      position: sticky;
      top: 180px;
      background-color: var(--ui-color-background);
    }

    th {
      padding-left: 6px;
      padding-right: 18px;
    }
    td {
      padding: 0 3px;
    }

    th,td {
      font-size: 0.85rem;
    }
  }

  &__chapterName input {
    width: 100%;
  }

  &__chapter {
    input {
      padding: 3px 5px !important;
    }

    &--active {
      outline: 2px solid #ff8;
      border-radius: 4px;
    }

    .UiIcon.ui--clickable {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      border-radius: 4px;
      width: 28px;
      height: 28px;
      margin: 0;
      padding: 0;
    }
  }
}
</style>