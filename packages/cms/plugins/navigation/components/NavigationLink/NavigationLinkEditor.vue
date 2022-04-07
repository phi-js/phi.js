<script setup>
import { ref, watchEffect } from 'vue'
import { UiInput } from '@/packages/ui'
import NavigationPagePicker from '../NavigationPagePicker/NavigationPagePicker.vue'

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
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const blockProps = ref()
watchEffect(() => blockProps.value = { ...props.modelValue?.props })

function emitUpdate() {
  emit('update:modelValue', {
    ...props.modelValue,
    props: blockProps.value,
  })
}
</script>

<template>
  <div class="NavigationLinkEditor UiForm">
    <UiInput
      v-model="blockProps.text"
      type="text"
      label="Label"
      @update:model-value="emitUpdate()"
    />

    <UiInput
      v-model="blockProps.subtext"
      type="text"
      label="Subtext"
      @update:model-value="emitUpdate()"
    />

    <UiInput
      v-if="props.modelValue.component == 'NavigationLink'"
      label="Target page"
    >
      <!--
  https://stackoverflow.com/questions/71585426/in-vue-3-can-i-use-both-v-modelcustom-property-and-updatecustom-property
  Vue bug (?)
      -->
      <NavigationPagePicker
        v-model:pageId="blockProps.pageId"
        @update:page-id="emitUpdate()"
      />
    </UiInput>
  </div>
</template>