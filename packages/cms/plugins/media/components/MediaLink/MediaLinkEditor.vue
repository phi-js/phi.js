<script setup>
import { computed, ref, watch } from 'vue'
import { UiItem, UiInput, UiButton, UiDrawer } from '../../../../../ui'

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

const emit = defineEmits(['update:modelValue', 'delete'])

const innerValue = ref({})
const isEditing = ref(false)

const isEmpty = computed(() => !innerValue.value.href && !innerValue.value.text && !innerValue.value.subtext)
const sanitizedValue = computed(() => ({
  href: innerValue.value.href,
  text: innerValue.value.text || 'Sin título',
  subtext: innerValue.value.subtext,
  icon: innerValue.value.icon || 'mdi:open-in-new',
}))

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = { target: '_blank', ...newValue }
    isEditing.value = isEmpty.value
  },
  { immediate: true },
)

function accept() {
  emit('update:modelValue', { ...innerValue.value })
  isEditing.value = false
}

function cancel() {
  innerValue.value = { ...props.modelValue }
  isEditing.value = false
  if (isEmpty.value) {
    emit('delete')
  }
}
</script>

<template>
  <div class="MediaLinkEditor">
    <UiItem
      v-bind="sanitizedValue"
      @click="isEditing = true"
    />
    <UiDrawer :open="isEditing">
      <div class="UiForm UiForm--wide">
        <UiInput
          v-model="innerValue.href"
          type="url"
          label="URL"
          placeholder="http://..."
        />
        <UiInput
          v-model="innerValue.text"
          type="text"
          label="Titulo"
        />
        <UiInput
          v-model="innerValue.subtext"
          type="text"
          label="Descripcion"
        />
        <UiInput
          v-model="innerValue.target"
          type="select-list"
          label="Abrir en"
          :options="[
            { value: '_blank', text: 'Nueva pestaña' },
            { value: '_self', text: 'Pestaña actual' },
          ]"
        />
        <footer>
          <UiButton
            class="UiButton--main"
            label="OK"
            @click="accept"
          />
          <UiButton
            class="UiButton--cancel"
            label="Cancel"
            @click="cancel"
          />
        </footer>
      </div>
    </UiDrawer>
  </div>
</template>