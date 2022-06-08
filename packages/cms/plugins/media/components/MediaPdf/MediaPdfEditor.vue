<script setup>
import { ref, watch } from 'vue'
import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'

const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const pageSlot = ref([])
watch(
  () => props.modelValue,
  (newValue) => {
    pageSlot.value = Array.isArray(newValue?.slot) ? newValue.slot : []
  },
  { immediate: true },
)

function onSlotUpdate() {
  emit('update:modelValue', { ...props.modelValue, slot: pageSlot })
}
</script>

<template>
  <div class="MediaPdfEditor">
    <div class="MediaPdfEditor__header">
      <h1>PDF Editor</h1>
    </div>

    <div class="MediaPdfEditor__container">
      <div class="MediaPdfEditor__body">
        <CmsSlotEditor
          v-model:slot="pageSlot"
          group-name="pdf-slot"
          show-launcher
          @update:slot="onSlotUpdate"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.MediaPdfEditor {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    padding: 0 30px;

    box-sizing: border-box;
    min-height: 56px;
    background: #323639;
    color: #fff;

    h1 {
      margin: 0;
      padding: 0;
      font-size: 0.87rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      // margin-inline-start: 16px;
    }
  }

  &__container {
    flex: 1;
    // overflow-y: auto;
    background: #525659;
  }

  &__body {
    width: 800px;
    margin: auto;
    background: #fff;
    color: #000;
    padding: 30px;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  }
}
</style>