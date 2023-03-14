<script setup>
import { ref, onMounted, watch } from 'vue'
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'

const availableLanguages = {
  javascript,
  json,
  css,
  html,
}

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },

  lang: {
    type: String,
    required: false,
    default: 'javascript', // javascript | json
  },
})
const emit = defineEmits(['update:modelValue'])

const codeEl = ref()
var cmView = null
var _haltEmit = false

onMounted(() => {
  const langExtension = availableLanguages?.[props.lang] || javascript

  cmView = new EditorView({
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        basicSetup,
        langExtension(),
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            if (_haltEmit) {
              _haltEmit = false
              return
            }
            emit('update:modelValue', v.state.doc.toString())
          }
        }),
      ],
    }),
    parent: codeEl.value,
  })
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (!cmView || newValue == cmView.state.doc.toString()) {
      return
    }
    _haltEmit = true
    const transaction = cmView.state.update({ changes: { from: 0, to: cmView.state.doc.length, insert: newValue } })
    cmView.update([transaction])
  },
)
</script>

<template>
  <div
    ref="codeEl"
    class="UiInputCode"
  />
</template>

<style lang="scss">
/* forzed style in code items */
.UiInputCode {
  background: #fff !important;
  color: #000 !important;
}
</style>