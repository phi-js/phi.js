<script setup>
import { UiItem } from '../UiItem/index.js'
import { UiPopover } from '../UiPopover/index.js'

const placements = [
  'auto',
  'auto-start',
  'auto-end',
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'right',
  'right-start',
  'right-end',
  'left',
  'left-start',
  'left-end'
];
</script>

<template>
  <h1>UiPopover</h1>

  <div style="text-align: center">
    <UiPopover v-for="placement in placements" :key="placement" :placement="placement">
      <template #trigger>
        <UiItem
          class="ui-outset ui-clickable"
          icon="mdi:window-maximize"
          text="Abrir Popover"
          :secondary="placement"
        />
      </template>

      <template #contents>
        <h1>Contenido del Popover</h1>
        <p>dfkjh adsflkjhas dklfhasdf lkahsdfk jlasdh kfjldsakjhf kasdf s</p>
        <p>dfkjh adsflkjhas dklfhasdf lkahsdfk jlasdh kfjldsakjhf kasdf s</p>
        <p>dfkjh adsflkjhas dklfhasdf lkahsdfk jlasdh kfjldsakjhf kasdf s</p>
      </template>
    </UiPopover>
  </div>
</template>