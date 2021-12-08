<script setup>
import { ref, onMounted, watch } from 'vue'
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'

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

onMounted(() => {
  const langExtension = props.lang == 'json' ? json : javascript

  cmView = new EditorView({
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        basicSetup,
        langExtension(),
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
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
    if (newValue == cmView.state.doc.toString()) {
      return
    }
    const transaction = cmView.state.update({ changes: { from: 0, to: cmView.state.doc.length, insert: newValue } })
    cmView.update([transaction])
  },
)
</script>

<template>
  <div
    ref="codeEl"
    class="UiInputCode ui-inset"
  />
</template>