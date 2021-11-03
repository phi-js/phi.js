<script setup>
import { ref, watch } from 'vue'
import { UiItem, UiDrawer, UiItemEditor, UiInput } from '../../../../../ui'
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
const emit = defineEmits(['update:modelValue', 'cancel'])

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

function cancel() {
  innerValue.value = JSON.parse(JSON.stringify(props.modelValue))
  emit('cancel')
}
</script>

<template>
  <div class="StmtChainItem">
    <UiDrawer
      :open="props.open"
      @cancel="false"
    >
      <template #trigger>
        <UiItem
          class="StmtChainItem__face ui--clickable ui--noselect"
          icon="mdi:vuejs"
          v-bind="props.modelValue.info"
          :subtext="props.modelValue.assign"
        >
          <template #actions>
            <slot name="actions" />
          </template>
        </UiItem>
      </template>

      <template #header>
        <UiItemEditor v-model="innerValue.info" />
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
  &__paths {
    padding-left: 42px;
  }

  &__face {
    // .ui-icon {
    //   cursor: move;
    // }

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
}
</style>