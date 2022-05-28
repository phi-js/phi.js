<script setup>
import { computed } from 'vue'
import { UiIcon, UiPopover } from '../../../../../ui'

const props = defineProps({
  /* objeto PROPS para MediaImage:

    src: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    align: 'center',
    width: 'auto',
    href: 'https://phidias.co',
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

const isFullWidth = computed({
  get() {
    return props.modelValue?.width == '100%'
  },

  set(newValue) {
    const targetValue = newValue ? '100%' : 'auto'
    emit('update:modelValue', { ...props.modelValue, width: targetValue })
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
    <UiPopover>
      <template #trigger>
        <UiIcon
          :src="alignment.current.icon"
          class="BlockScaffold__toolbar-icon expansible"
        />
      </template>
      <template #contents="{ close }">
        <div
          class="UiGroup UiToolbar"
          @click="close()"
        >
          <UiIcon
            v-for="(align, i) in alignment.available"
            :key="i"
            :title="align.title"
            :src="align.icon"
            class="BlockScaffold__toolbar-icon"
            :class="{ 'BlockScaffold__toolbar-icon--active': align.value == alignment.current.value }"
            @click="emit('update:modelValue', { ...props.modelValue, align: align.value })"
          />
        </div>
      </template>
    </UiPopover>

    <!-- <UiIcon
      title="Full width"
      src="mdi:overscan"
      class="MediaImageToolbar__icon"
      :class="{'--active': isFullWidth}"
      @click="isFullWidth = !isFullWidth"
    />-->
  </div>
</template>

<style lang="scss">
.MediaImageToolbar {
  .expansible {
    &::after {
      content: "▾";
    }
  }
}
</style>