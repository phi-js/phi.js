<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiIcon, UiItem, UiDrawer, UiInput } from '@/packages/ui'
import VmStatement from '../../VmStatement.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },

  open: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])

const isOpen = ref(props.open)
const innerValue = ref({})
const isIfStatement = ref(false)

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = JSON.parse(JSON.stringify(newValue))
    isIfStatement.value = innerValue.value?.do?.if !== undefined
  },
  { immediate: true },
)

function accept() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerValue.value)))
}

function rename() {
  const newName = window.prompt(i18n.t('StmtChainItem.chooseName'), innerValue.value.info?.text)
  if (newName && newName.trim()) {
    innerValue.value.info.text = newName
    accept()
  }
}

const i18n = useI18n({
  en: {
    'StmtChainItem.chooseName': 'New name:',
    'StmtChainItem.renameAction': 'Rename this action',
    'StmtChainItem.assignResult': 'Assign result to:',
    'StmtChainItem.then': 'then',
    'StmtChainItem.else': 'else',
    'StmtChainItem.variableName': 'Variable name',
  },
  es: {
    'StmtChainItem.chooseName': 'Nuevo nombre:',
    'StmtChainItem.renameAction': 'Renombrar acción',
    'StmtChainItem.assignResult': 'Asignar resultado en:',
    'StmtChainItem.then': 'then',
    'StmtChainItem.else': 'else',
    'StmtChainItem.variableName': 'Nombre de variable',
  },
})
</script>

<template>
  <div class="StmtChainItem">
    <UiDrawer v-model:open="isOpen">
      <template #trigger>
        <div class="StmtChainItem__trigger">
          <UiItem
            class="StmtChainItem__face"
            v-bind="props.modelValue.info"
            :subtext="props.modelValue.assign"
            :icon="isIfStatement ? isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right' : props.modelValue?.info?.icon"
          >
            <template #actions>
              <UiIcon
                class="StmtChainItem__actionIcon"
                src="mdi:pencil"
                :title="i18n.t('StmtChainItem.renameAction')"
                @click.stop="rename()"
              />
              <slot name="actions" />
            </template>
          </UiItem>
        </div>
      </template>

      <template #contents>
        <div class="StmtChainItem__contents">
          <VmStatement
            v-if="isIfStatement"
            v-model="innerValue.do.if"
            @update:model-value="accept()"
          />
          <template v-else>
            <VmStatement
              v-model="innerValue.do"
              @update:model-value="accept()"
            />

            <details class="StmtChainItem__assign">
              <summary>
                <span v-text="i18n.t('StmtChainItem.assignResult')" />
                <em v-text="innerValue.assign" />
              </summary>
              <section>
                <UiInput
                  v-model="innerValue.assign"
                  type="text"
                  :placeholder="i18n.t('StmtChainItem.variableName')"
                  @update:model-value="accept()"
                />
              </section>
            </details>
          </template>
        </div>
      </template>
    </UiDrawer>

    <div
      v-if="isIfStatement"
      class="StmtChainItem__paths"
    >
      <div class="StmtChainItem__path StmtChainItem__path--then">
        <label>{{ i18n.t('StmtChainItem.then') }}</label>
        <div class="StmtChainItem__pathBody">
          <VmStatement
            v-model="innerValue.do.then"
            @update:model-value="accept()"
          />
        </div>
      </div>
      <div class="StmtChainItem__path StmtChainItem__path--else">
        <label>{{ i18n.t('StmtChainItem.else') }}</label>
        <div class="StmtChainItem__pathBody">
          <VmStatement
            v-model="innerValue.do.else"
            @update:model-value="accept()"
          />
        </div>
      </div>
    </div>
  </div>
</template>