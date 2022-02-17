<script setup>
import { ref, watch } from 'vue'
import { UiIcon, UiItem, UiDrawer, UiInput } from '../../../../../ui'
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
  const newName = window.prompt('New display name', innerValue.value.info?.text)
  if (newName && newName.trim()) {
    innerValue.value.info.text = newName
    accept()
  }
}

</script>

<template>
  <div class="StmtChainItem">
    <UiDrawer v-model:open="isOpen">
      <template #trigger>
        <div class="StmtChainItem__trigger ui--clickable">
          <UiItem
            class="StmtChainItem__face ui--noselect"
            icon="mdi:vuejs"
            v-bind="props.modelValue.info"
            :subtext="props.modelValue.assign"
          />

          <div class="StmtChainItem__actions">
            <UiIcon
              src="mdi:pencil"
              class="ui--clickable"
              title="Rename this action"
              @click.stop="rename()"
            />
            <slot name="actions" />
          </div>
        </div>
      </template>

      <template #contents>
        <div class="StmtChainItem__contents">
          <VmStatement
            v-if="isIfStatement"
            v-model="innerValue.do.if"
            @update:modelValue="accept()"
          />
          <template v-else>
            <VmStatement
              v-model="innerValue.do"
              @update:modelValue="accept()"
            />
            <UiInput
              v-model="innerValue.assign"
              type="text"
              label="Asignar resultado en:"
              @update:modelValue="accept()"
            />
          </template>
        </div>
      </template>
    </UiDrawer>

    <div
      v-if="isIfStatement"
      class="StmtChainItem__paths"
    >
      <div class="StmtChainItem__path StmtChainItem__path--then">
        <label>then</label>
        <VmStatement
          v-model="innerValue.do.then"
          @update:modelValue="accept()"
        />
      </div>
      <div class="StmtChainItem__path StmtChainItem__path--else">
        <label>else</label>
        <VmStatement
          v-model="innerValue.do.else"
          @update:modelValue="accept()"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.StmtChainItem {

  &__trigger {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  &__paths {
    padding-left: 42px;
  }

  &__face {
    display: inline-flex;

    .ui-item__subtext {
      display: inline-block;
      font-size: 12px;
      line-height: 18px;
      border-radius: var(--ui-radius);
      padding: 0 12px;
      background-color: var(--ui-color-primary);
      color: #fff;

      margin-right: auto;
    }
  }

  &__footer,
  &__contents {
    padding: var(--ui-padding);
    padding-left: 36px;
  }

  &__footer {
    margin-bottom: 22px;
  }

  &__actions {
    margin-left: auto;

    .UiIcon {
      width: 32px;
      height: 32px;
      border-radius: var(--ui-radius);

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>