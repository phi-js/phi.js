<!-- eslint-disable max-len -->
<script setup>
import { computed, inject, ref } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiDetails, UiInput } from '@/packages/ui'
import { getStoryFields } from '../../../functions'

const i18n = useI18n()

/*
emits an input event
containing an ARRAY of Phi blocks
*/
const emit = defineEmits(['input'])

const targetPageIds = ref([])
const targetFormat = ref('html') // html | text

const injectedStory = inject('_cms_currentStory', null)
const storyFields = computed(() => {
  if (!injectedStory) {
    return []
  }
  return i18n.obj(getStoryFields(injectedStory.value))
})

targetPageIds.value = storyFields.value.map((page) => page.id)

const selectOptions = computed(() => {
  return storyFields.value.map((page) => ({
    value: page.id,
    text: `${page.text} (${page.children.length} fields)`,
  }))
})

function generateBlock() {
  const allFields = []
  targetPageIds.value.forEach((pageId) => {
    const targetPage = storyFields.value.find((page) => page.id == pageId)
    allFields.push(...targetPage.children)
  })

  const finalBlock = {
    component: '',
    props: { value: '' },
  }

  allFields.forEach((field) => {
    field.variableName = (typeof field?.enum !== 'undefined' || typeof field?.items?.enum !== 'undefined')
      ? `{{ $format.ul($enum.${field.value}) }}`
      : `{{ ${field.value} }}`
  })

  if (targetFormat.value == 'html') {
    finalBlock.component = 'MediaHtmlCode'
    finalBlock.props.value = `<table>
  <tbody>
${allFields.map((field) => `    <tr>\n      <td>${field.text}</td>\n      <td>${field.variableName}</td>\n    </tr>`).join('\n')}
  </tbody>
</table>`
  } else {
    finalBlock.component = 'MediaHtml'
    finalBlock.props.value = allFields.map((field) => `<p><strong>${field.text}</strong>: ${field.variableName}</p>`).join('\n')
  }

  emit('input', finalBlock)
}
</script>

<template>
  <UiDetails
    class="MetaBlockLauncher FinderItem FinderItem--group"
    text="Form to text"
    group="UiItemFinder"
  >
    <form
      class="UiForm UiForm--wide"
      @submit.prevent="generateBlock()"
    >
      <UiInput
        v-model="targetFormat"
        type="select-native"
        label="Create a new"
        :options="[
          {value: 'text', text: 'HTML text'},
          {value: 'html', text: 'HTML table'},
        ]"
      />

      <UiInput
        v-model="targetPageIds"
        required
        multiple
        type="select-native"
        :options="selectOptions"
        label="From data fields in"
      />

      <UiInput
        type="submit"
        label="Go"
      />
    </form>
  </UiDetails>
</template>