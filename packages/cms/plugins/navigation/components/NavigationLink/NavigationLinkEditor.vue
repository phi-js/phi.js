<script setup>
import { inject, computed, ref, watchEffect } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  Block Object
  {
    component: NavigationLink,
    props: {
      pageId: null,
      icon: null,
      text: '',
      subtext: '',
    },
  }
  */
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const blockProps = ref()
watchEffect(() => blockProps.value = { ...props.modelValue?.props })

const injectedStoryData = inject('$_cms_story_editor', null)
const availablePages = computed(() => injectedStoryData?.story?.value?.pages || [])

function emitUpdate() {
  emit('update:modelValue', {
    ...props.modelValue,
    props: blockProps.value
  })
}
</script>

<template>
  <div class="NavigationLinkEditor UiForm">
    <UiInput type="text" label="Label" v-model="blockProps.text" @update:modelValue="emitUpdate()" />
    <UiInput
      label="Page"
      type="select-list"
      :options="availablePages"
      v-model="blockProps.pageId"
      @update:modelValue="emitUpdate()"
      option-text="$.info.text"
      option-value="$.id"
    />
    <!-- <UiInput
      type="text"
      label="Subtext"
      v-model="blockProps.subtext"
      @update:modelValue="emitUpdate()"
    />-->
  </div>
</template>