<script setup>
import { ref, watch } from 'vue'
import { UiInput, UiDetails } from '@/packages/ui'
import useVmI18n from '../../i18n'
const i18n = useVmI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref({})

watch(
  () => props.modelValue,
  (newValue) => {
    let incoming = Object.assign(
      { call: 'fetch' },
      newValue ? JSON.parse(JSON.stringify(newValue)) : null,
    )

    incoming.args = Object.assign(
      {
        url: '',
        options: {
          method: 'get',
          body: null,
          headers: null,
        },
      },
      typeof incoming.args == 'object' ? incoming.args : null,
    )

    innerValue.value = incoming
  },
  { immediate: true },
)

function emitInput() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerValue.value)))
}
</script>

<template>
  <div class="FetchEditor">
    <div class="FetchEditor__row">
      <UiInput class="FetchEditor__inputMethod">
        <select
          v-model="innerValue.args.options.method"
          class="UiInput"
          @change="emitInput"
        >
          <option value="get">
            GET
          </option>
          <option value="post">
            POST
          </option>
          <option value="put">
            PUT
          </option>
          <option value="patch">
            PATCH
          </option>
          <option value="delete">
            DELETE
          </option>
        </select>
      </UiInput>

      <UiInput
        v-model="innerValue.args.url"
        class="FetchEditor__inputUrl"
        type="text"
        placeholder="https:// ... "
        @update:model-value="emitInput"
      />
    </div>

    <UiDetails
      v-if="innerValue.args.options.method != 'get'"
      class="FetchEditor__body"
      :text="i18n.t('FetchEditor.Body')"
      open
    >
      <UiInput
        v-model="innerValue.args.options.body"
        type="json"
        @update:model-value="emitInput"
      />
    </UiDetails>

    <UiDetails
      class="FetchEditor__headers"
      :text="i18n.t('FetchEditor.Headers')"
    >
      <UiInput
        v-model="innerValue.args.options.headers"
        type="json"
        @update:model-value="emitInput"
      />
    </UiDetails>
  </div>
</template>