<script setup>
import { ref } from 'vue'
import CmsBlock from '../packages/cms/components/CmsBlock/CmsBlock.vue'
import CmsBlockEditor from '../packages/cms/components/CmsBlockEditor/CmsBlockEditor.vue'

import somePage from '../packages/cms/samples/0.empty.js'
// import somePage from '../packages/cms/samples/1.jsonplaceholder.js'
// import somePage from '../packages/cms/samples/2.video.js'
// import somePage from '../packages/cms/samples/3.campestre.js'
// import somePage from '../packages/cms/samples/campestre/clean.js'

const showPreview = ref(false)
const block = ref(somePage)

const settings = ref({ uploads: { endpoint: 'http://v4.local/1/cms/pages/test/files' } })
const modelValue = ref({
  personId: 8239,
  periodId: 45,
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBsaWNhdGlvbiI6InYzIiwiaWQiOiJzeXN0ZW0ifQ.FUVzyhdvC0Pw3XRqvd3k7rFNGlVtDsLBMw-E8b8CdcE',
})
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