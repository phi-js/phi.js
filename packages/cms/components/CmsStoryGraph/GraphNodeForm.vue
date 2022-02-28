<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  /*
  Node object
  {
    id: '',
    hash: '',
    info: {
      text: ''
    }
  }
  */
  node: {
    type: Object,
    required: false,
    default: () => ({})
  },

  label: {
    type: String,
    required: false,
    default: 'Create'
  }
})

const emit = defineEmits(['update:node', 'cancel'])

const innerNode = ref()
watch(
  () => props.node,
  () => {
    innerNode.value = {
      id: props.node?.id || '',
      hash: props.node?.hash || '',
      info: {
        text: props.node?.info?.text || ''
      }
    }
  },
  { immediate: true }
)

const inputEl = ref()
onMounted(() => inputEl.value.select())

function emitUpdate() {
  emit('update:node', {
    ...JSON.parse(JSON.stringify(innerNode.value)),
    hash: toValidHash(innerNode.value.info.text)
  })
}

function toValidHash(string) {
  if (!string) {
    return ''
  }

  return string
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ +/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
}
</script>

<template>
  <div class="GraphNodeForm">
    <input
      type="text"
      class="UiInput"
      placeholder="Page name"
      v-model="innerNode.info.text"
      ref="inputEl"
      @keydown.esc="emit('cancel')"
      @keydown.enter="emitUpdate"
    />

    <button
      :disabled="!innerNode.info.text.trim()"
      type="button"
      class="UiButton"
      @click="emitUpdate"
    >{{ props.label }}</button>

    <button type="button" class="UiButton UiButton--cancel" @click="emit('cancel')">Cancel</button>
  </div>
</template>

<style lang="scss">
.GraphNodeForm {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  position: relative;
  top: -6px;

  font-size: 14px;
  background-color: #f4f4f4;
}
</style>