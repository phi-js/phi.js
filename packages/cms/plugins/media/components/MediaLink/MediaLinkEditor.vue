<script setup>
import { computed, ref, watch } from 'vue';
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
  { immediate: true }
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
    <UiItem v-bind="sanitizedValue" class="ui--clickable" @click="isEditing = true" />
    <UiDrawer :open="isEditing">
      <div class="UiForm UiForm--wide">
        <UiInput type="url" v-model="innerValue.href" label="URL" placeholder="http://..." />
        <UiInput type="text" v-model="innerValue.text" label="Titulo" />
        <UiInput type="text" v-model="innerValue.subtext" label="Descripcion" />
        <UiInput
          type="select-list"
          label="Abrir en"
          v-model="innerValue.target"
          :options="[
            { value: '_blank', text: 'Nueva pestaña' },
            { value: '_self', text: 'Pestaña actual' },
          ]"
        />
        <footer>
          <UiButton class="UiButton--main" @click="accept" text="OK" />
          <UiButton class="UiButton--cancel" @click="cancel" text="Cancel" />
        </footer>
      </div>
    </UiDrawer>
  </div>
</template>