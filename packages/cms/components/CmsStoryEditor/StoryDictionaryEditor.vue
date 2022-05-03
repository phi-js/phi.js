<script setup>
import { ref, watchEffect } from 'vue'
import { forEachBlock } from '../../functions'
import BlockDictionaryEditor from '../CmsBlockEditor/BlockDictionaryEditor.vue'

const props = defineProps({
  /**
   * A STORY object:
   */
  story: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:story'])

const innerStory = ref()
watchEffect(() => innerStory.value = { ...props.story })
// watchEffect(() => innerStory.value = JSON.parse(JSON.stringify(props.story)))

function emitUpdate() {
  emit('update:story', { ...innerStory.value })
}

const blocksWithLang = ref()
watchEffect(() => {
  blocksWithLang.value = []
  forEachBlock(innerStory.value, (block) => {
    if (block.props && /lang\(([^"]+?)\)/.test(JSON.stringify(block.props))) {
      blocksWithLang.value.push(block)
    }
  })
})

const currentLanguage = ref('es')

</script>

<template>
  <div class="DictionaryEditor">
    <BlockDictionaryEditor
      v-for="(block, i) in blocksWithLang"
      :key="i"
      v-model:currentLanguage="currentLanguage"
      class="DictionaryEditor__blockEditor"
      :model-value="block"
      @update:model-value="blocksWithLang[i].i18n = $event.i18n; emitUpdate();"
    />
  </div>
</template>

<style lang="scss">
.DictionaryEditor {
  &__blockEditor .UiTabs__header {
    display: none;
  }

  &__blockEditor:first-child .UiTabs__header {
    display: block;
  }
}
</style>