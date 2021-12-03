<script setup>
import { ref } from 'vue'
import CmsBlock from '../../packages/cms/components/CmsBlock/CmsBlock.vue'
import CmsBlockEditor from '../../packages/cms/components/CmsBlockEditor/CmsBlockEditor.vue'

import somePage from '../../packages/cms/samples/campestre/profesor.prejardin.js'

const showPreview = ref(true)
const block = ref(somePage)

const settings = ref({ uploads: { endpoint: 'http://v4.local/1/cms/pages/test/files' } })
const modelValue = ref({
  periodId: 45,
  groupId: 6507,
  courseId: 2179,
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