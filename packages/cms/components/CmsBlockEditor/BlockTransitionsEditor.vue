<script setup>
/*
The block's "transitions" object defines classes to be applied to the element
during page-enter, page-leave and/or v-if transitions

transitions: {
  "navigation-forward-enter": "fadeInRight",
  "navigation-forward-leave": "fadeOutLeft",
  "navigation-back-enter": "fadeInRight",
  "navigation-back-leave": "fadeOutLeft",

  "show": "fadeIn",
  "hide": "fadeOut",

  // Shorthands:
  "navigation-enter": "fadeInRight",
  "navigation-leave": "fadeOutLeft",
}

A transition is a STRING referencing a pre-defined TRANSITION-UID.

A list of available transitions can be found in:
/components/CmsStory/transitions/**.scss

... which are basically the same classes defined in Animate.css
e.g.: animate__backInDown
see: https://animate.style/
*/
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput, UiDetails } from '@/packages/ui'

const props = defineProps({
  /**
   * @model Block object
   */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const block = ref()

watch(
  () => props.modelValue,
  (newValue) => {
    block.value = { ...newValue }
    if (!block.value.transitions) {
      block.value.transitions = {}
    }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...block.value })
}

const i18n = useI18n({
  en: {
    'BlockTransitionsEditor.onNavigationEnter': 'On navigation enter',
    'BlockTransitionsEditor.onNavigationLeave': 'On navigation leave',
    'BlockTransitionsEditor.movingForward': 'Moving forward',
    'BlockTransitionsEditor.movingBack': 'Moving back',
  },

  es: {
    'BlockTransitionsEditor.onNavigationEnter': 'Al entrar en la pagina',
    'BlockTransitionsEditor.onNavigationLeave': 'Al salir de la pagina',
    'BlockTransitionsEditor.movingForward': 'Avanzando',
    'BlockTransitionsEditor.movingBack': 'Retrocediendo',
  },
})

const availableTransitions = ref([
  '',
  'bounceInRight',
  'bounceOutRight',
  'fadeInLeft',
  'fadeInRight',
  'fadeOutLeft',
  'fadeOutRight',
])

const isDetailsOpen = ref({
  enter: false,
  leave: false,
})
</script>

<template>
  <div class="BlockTransitionsEditor UiForm--wide">
    <UiDetails v-model:open="isDetailsOpen.enter">
      <template #summary>
        <UiInput
          v-model="block.transitions['navigation-enter']"
          type="select-native"
          :label="i18n.t('BlockTransitionsEditor.onNavigationEnter')"
          :options="availableTransitions"
          @update:model-value="emitUpdate"
          @click.stop.prevent="true"
          @click-label="isDetailsOpen.enter = !isDetailsOpen.enter"
        />
      </template>
      <template #contents>
        <UiInput
          v-model="block.transitions['navigation-forward-enter']"
          type="select-native"
          :label="i18n.t('BlockTransitionsEditor.movingForward')"
          :options="availableTransitions"
          @update:model-value="emitUpdate"
        />
        <UiInput
          v-model="block.transitions['navigation-back-enter']"
          type="select-native"
          :label="i18n.t('BlockTransitionsEditor.movingBack')"
          :options="availableTransitions"
          @update:model-value="emitUpdate"
        />
      </template>
    </UiDetails>

    <UiDetails v-model:open="isDetailsOpen.leave">
      <template #summary>
        <UiInput
          v-model="block.transitions['navigation-leave']"
          type="select-native"
          :label="i18n.t('BlockTransitionsEditor.onNavigationLeave')"
          :options="availableTransitions"
          @update:model-value="emitUpdate"
          @click.stop.prevent="true"
          @click-label="isDetailsOpen.leave = !isDetailsOpen.leave"
        />
      </template>
      <template #contents>
        <UiInput
          v-model="block.transitions['navigation-forward-leave']"
          type="select-native"
          :label="i18n.t('BlockTransitionsEditor.movingForward')"
          :options="availableTransitions"
          @update:model-value="emitUpdate"
        />
        <UiInput
          v-model="block.transitions['navigation-back-leave']"
          type="select-native"
          :label="i18n.t('BlockTransitionsEditor.movingBack')"
          :options="availableTransitions"
          @update:model-value="emitUpdate"
        />
      </template>
    </UiDetails>

    <!-- <UiInput
      v-model="block.transitions"
      type="json"
      :label="i18n.t('BlockTransitionsEditor.label')"
      @update:model-value="emitUpdate"
    /> -->
  </div>
</template>

<style lang="scss">
.BlockTransitionsEditor {
  .UiDetails > .UiDetails__contents {
    padding: 8px 24px 32px 24px;
  }
}
</style>