<script setup>
import { ref, watch } from 'vue'
import { UiWindow, UiTabs, UiItem, UiTab, UiTree, UiIcon } from '@/packages/ui/components'
import { VmStatement } from '@/packages/vm/components'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },

  open: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['update:block', 'update:open', 'accept', 'cancel'])

const innerBlock = ref(null)
watch(
  () => props.block,
  (newValue) => innerBlock.value = JSON.parse(JSON.stringify(newValue)),
  { immediate: true },
)

function accept() {
  const copy = JSON.parse(JSON.stringify(innerBlock.value))
  emit('update:block', copy)
  emit('accept', copy)
  return true
}

function cancel() {
  innerBlock.value = JSON.parse(JSON.stringify(props.block))
  emit('update:block', innerBlock.value)
  emit('cancel')
  return true
}

</script>

<template>
  <UiWindow
    :open="props.open"
    text="Page settings"
    icon="mdi:cog"
    class="LayoutPageWindow ui-theme-dark"
    name="page-settings"
    @update:open="emit('update:open', $event)"
  >
    <UiTabs>
      <UiTab
        text="Startup"
        icon="mdi:cog"
      >
        <VmStatement
          v-model="innerBlock.setup"
          :default="{chain:[]}"
          @update:modelValue="emit('update:block', innerBlock)"
        />
      </UiTab>

      <UiTab
        text="Layers"
        icon="mdi:layers"
      >
        <UiTree
          :value="innerBlock.slot"
          children-prop="slot"
          class="StoryTree"
          :initial-open="() => true"
        >
          <template #default="{item, isOpen, children, toggle}">
            <UiItem
              icon="mdi:package-variant"
              :text="item.component"
              class="ui--clickable ui--noselect"
              @click="toggle"
            >
              <template
                v-if="children?.length"
                #actions
              >
                <UiIcon :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" />
              </template>
            </UiItem>
          </template>
        </UiTree>
      </UiTab>

      <UiTab
        text="Source"
        icon="mdi:code-json"
      >
        <VmStatement
          v-model="innerBlock"
          style="height:100%"
          @update:modelValue="emit('update:block', innerBlock)"
        />
      </UiTab>
    </UiTabs>

    <template #footer="{ close }">
      <button
        type="button"
        class="ui-button --main"
        @click="accept() && close()"
      >
        Aceptar
      </button>
      <button
        type="button"
        class="ui-button --cancel"
        @click="cancel() && close()"
      >
        Cancelar
      </button>
    </template>
  </UiWindow>
</template>

<style lang="scss">
.LayoutPageWindow {
  .UiTabs {
    height: 100%;
  }
}

.StoryTree {
  max-width: 600px;

  .UiTree__children {
    margin-left: 12px;
  }
}
</style>