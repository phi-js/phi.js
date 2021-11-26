<script setup>
import { ref } from 'vue'
import CmsBlock from '../packages/cms2/components/CmsBlock/CmsBlock.vue'
import CmsBlockEditor from '../packages/cms2/components/CmsBlockEditor/CmsBlockEditor.vue'

// import somePage from '../packages/cms2/samples/1.jsonplaceholder.js'
// import somePage from '../packages/cms2/samples/2.video.js'

const somePage = {
  component: 'LayoutPage',
  slot: [
    {
      component: 'LayoutRow',
      slot: [
        { component: 'LayoutColumn' },
      ],
    },
  ],
}


const block = ref(somePage)
const modelValue = ref({ limit: 5 })
const showPreview = ref(false)

// watch(
//   modelValue,
//   (newValue) => {
//     console.log('waddayah know', newValue)
//   },
//   { deep: true },
// )

const settings = ref({ uploads: { endpoint: 'http://v4.local/1/cms/pages/test/files' } })

</script>

<template>
  <label><input
    v-model="showPreview"
    type="checkbox"
  >Show preview</label>

  <CmsBlockEditor
    v-show="!showPreview"
    v-model:block="block"
    :settings="settings"
  />
  <CmsBlock
    v-if="showPreview"
    v-model="modelValue"
    :block="block"
  />
</template>