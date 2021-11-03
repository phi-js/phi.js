<script setup>
const props = defineProps({
  uiWindow: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

const slotBindings = { close }
</script>

<template>
  <div class="PopupContents ui-theme-dark">
    <div class="ui__box">
      <header>
        <component
          :is="props.uiWindow.$slots.header"
          v-bind="slotBindings"
        />
      </header>
      <div>
        <component
          :is="props.uiWindow.$slots.contents"
          v-bind="slotBindings"
        />
        <component
          :is="props.uiWindow.$slots.default"
          v-bind="slotBindings"
        />
      </div>
      <footer>
        <component
          :is="props.uiWindow.$slots.footer"
          v-bind="slotBindings"
        />
      </footer>
    </div>
  </div>
</template>

<style lang="scss">
.PopupContents {
  height: 100%;

  & > .ui__box {
    height: 100%;
    border-radius: 0;
  }
}
</style>