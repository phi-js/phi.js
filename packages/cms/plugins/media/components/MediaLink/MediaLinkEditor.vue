<script setup>
import { ref, watch, inject, computed } from 'vue'
import { UiInput, UiTabs, UiTab } from '@/packages/ui'
import CmsPropInput from '../../../../components/CmsPropInput/CmsPropInput.vue'

const props = defineProps({
  /*
  MediaLink block PROPS object
  {
    href: '',
    target: '',
    text: '',
    subtext: '',
    icon: '',
  }
  */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref({})

watch(
  () => props.modelValue,
  (newValue) => innerValue.value = {
    target: '_blank',
    ...newValue,
  },
  { immediate: true },
)

function emitUpdate(varName) {
  if (varName == 'href' && innerValue.value.href) {
    innerValue.value.pageHash = null
  } else if (varName == 'pageHash' && innerValue.value.pageHash) {
    innerValue.value.href = ''
  }

  emit('update:modelValue', { ...innerValue.value })
}

const injectedStoryData = inject('$_cms_story_builder', null)
const availablePages = computed(() => injectedStoryData?.story?.value?.pages || [])
const optionsPages = computed(() => availablePages.value.map((p) => ({
  value: p.hash || p.id,
  text: p.title || p.info?.text || p.id,
})))

const currentTab = ref(innerValue.value.pageHash || (availablePages.value.length && !innerValue.value.href)
  ? 'internal'
  : 'external')

</script>

<template>
  <UiTabs
    v-model="currentTab"
    class="MediaLinkEditor"
  >
    <UiTab
      text="Internal"
      value="internal"
    >
      <div class="MediaLinkEditor__tabContents">
        <UiInput
          v-model="innerValue.pageHash"
          label="Target page"
          type="select-list"
          :options="optionsPages"
          @update:model-value="emitUpdate('pageHash')"
        />
        <CmsPropInput
          v-model="innerValue.text"
          type="text"
          label="Titulo"
          @update:model-value="emitUpdate()"
        />
        <CmsPropInput
          v-model="innerValue.subtext"
          type="text"
          label="Descripcion"
          @update:model-value="emitUpdate()"
        />
      </div>
    </UiTab>

    <UiTab
      text="External"
      value="external"
    >
      <div class="MediaLinkEditor__tabContents">
        <UiInput
          v-model="innerValue.href"
          type="url"
          label="URL"
          placeholder="http://..."
          @update:model-value="emitUpdate('href')"
        />
        <CmsPropInput
          v-model="innerValue.text"
          type="text"
          label="Titulo"
          @update:model-value="emitUpdate()"
        />
        <CmsPropInput
          v-model="innerValue.subtext"
          type="text"
          label="Descripcion"
          @update:model-value="emitUpdate()"
        />
        <UiInput
          v-model="innerValue.target"
          type="select-list"
          label="Abrir en"
          :options="[
            { value: '_blank', text: 'Nueva pestaña' },
            { value: '_self', text: 'Pestaña actual' },
          ]"
          @update:model-value="emitUpdate()"
        />
      </div>
    </UiTab>
  </UiTabs>
</template>