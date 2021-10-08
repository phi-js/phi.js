<script setup>
import { ref, watch } from 'vue'
import pageHelper from '../../helpers/Page.js'
import { CmsBlockEditor } from '../CmsBlockEditor'
import PageLayoutEditor from './PageLayoutEditor.vue'

const props = defineProps({
  page: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:page'])

const innerPage = ref(null)
watch(
  () => props.page,
  (newValue) => innerPage.value = pageHelper.sanitizePage(newValue),
  { immediate: true, deep: true },
)

function emitUpdate() {
  emit('update:page', innerPage.value)
}
</script>

<template>
  <div class="CmsPageEditor">
    <PageLayoutEditor
      v-model:page="innerPage"
      @update:page="emitUpdate"
    >
      <template #block="slotData">
        <CmsBlockEditor
          v-model:block="innerPage
            .sections[slotData.sectionIndex]
            .rows[slotData.rowIndex]
            .columns[slotData.colIndex]
            .blocks[slotData.blockIndex]"

          @update:block="emitUpdate"
        />
      </template>
    </PageLayoutEditor>
  </div>
</template>