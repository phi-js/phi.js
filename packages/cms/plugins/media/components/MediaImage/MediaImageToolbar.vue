<script setup>
import { computed } from 'vue'
import { UiIcon } from '@/packages/ui'

const props = defineProps({
  /* objeto PROPS para MediaImage:

    src: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    align: 'center',
    objectFit: 'cover',
    href: 'https://phidias.co',
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

const isObjectFitCover = computed({
  get() {
    return props.modelValue?.objectFit == 'cover'
  },

  set(newValue) {
    const targetValue = newValue ? 'cover' : 'contain'
    emit('update:modelValue', { ...props.modelValue, objectFit: targetValue })
  },
})

const alignment = computed(() => {
  const available = [
    { value: 'left', title: 'Align left', icon: 'mdi:format-align-left' },
    { value: 'center', title: 'Align center', icon: 'mdi:format-align-center' },
    { value: 'right', title: 'Align right', icon: 'mdi:format-align-right' },
  ]

  const current = props.modelValue.align
    ? available.find((a) => props.modelValue.align == a.value)
    : available[1]

  return { current, available }
})

</script>

<template>
  <div class="MediaImageToolbar">
    <UiIcon
      v-for="(align, i) in alignment.available"
      :key="i"
      :title="align.title"
      :src="align.icon"
      class="BlockScaffold__button"
      :class="{ 'BlockScaffold__button--active': align.value == alignment.current.value }"
      @click="emit('update:modelValue', { ...props.modelValue, align: align.value })"
    />
    <UiIcon
      title="Stretch to cover"
      src="mdi:overscan"
      class="BlockScaffold__button"
      :class="{'BlockScaffold__button--active': isObjectFitCover}"
      @click="isObjectFitCover = !isObjectFitCover"
    />
  </div>
</template>

<style lang="scss">
.MediaImageToolbar {
  display: flex;
  flex-wrap: nowrap;
}
</style>