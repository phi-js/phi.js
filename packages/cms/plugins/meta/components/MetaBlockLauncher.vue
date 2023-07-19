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
  const finalBlock = {
    component: 'LayoutGroup',
    props: {},
    slot: [],
  }

  targetPageIds.value.forEach((pageId) => {
    const targetPage = injectedStory.value.pages.find((page) => page.id == pageId)
    if (!targetPage) {
      return
    }

    const targetPageField = storyFields.value.find((page) => page.id == pageId)
    if (!targetPageField || !targetPageField.children?.length) {
      return
    }

    const pageFields = targetPageField.children.map((field) => ({
      ...field,
      variableName: (typeof field?.enum !== 'undefined' || typeof field?.items?.enum !== 'undefined')
        ? `{{ $format.ul($enum.${field.value}) }}`
        : `{{ ${field.value} }}`,
    }))

    const pageFieldsBlock = {
      'component': '',
      'props': { value: '' },
      'v-if': targetPage['v-if'],
    }

    if (targetFormat.value == 'html') {
      pageFieldsBlock.component = 'MediaHtmlCode'
      pageFieldsBlock.props.value = `<table>
  <tbody>
${pageFields.map((field) => `    <tr>\n      <td>${field.text}</td>\n      <td>${field.variableName}</td>\n    </tr>`).join('\n')}
  </tbody>
</table>`
    } else {
      pageFieldsBlock.component = 'MediaHtml'
      pageFieldsBlock.props.value = pageFields.map((field) => `<p><strong>${field.text}</strong>: ${field.variableName}</p>`).join('\n')
    }

    finalBlock.slot.push(pageFieldsBlock)
  })

  // emit('input', finalBlock)
  emit('input', finalBlock.slot)
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