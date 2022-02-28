<script setup>
import { ref } from 'vue'
import { UiDrawer } from './index.js'
import { UiItem } from '../UiItem'

const isOpen = ref(false)

</script>

<template>
  <h1>UiDrawer</h1>

  <label>
    <input
      v-model="isOpen "
      type="checkbox"
    >
    isOpen
  </label>

  <UiDrawer v-model:open="isOpen">
    <template #trigger>
      <UiItem
        class="ui--clickable"
        text="Toggle drawer"
        :icon="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'"
      />
    </template>
    <template #contents="{ close }">
      <div style="border: 1px solid #ccc; background: #fff">
        <h2>Drawer contents</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dolor
          velit, luctus id lacus non, vestibulum ultricies tortor. Phasellus at
          odio ac neque tristique consectetur. Pellentesque eu magna eleifend,
          venenatis velit nec, tincidunt purus. Nullam pulvinar non lacus vitae
          malesuada. Etiam eget pellentesque leo. In aliquet laoreet ante. In
          hac habitasse platea dictumst.
        </p>
        <button @click="close()">
          close
        </button>
      </div>
    </template>
  </UiDrawer>

  <hr>

  <UiDrawer
    v-for="n in 5"
    :key="n"
  >
    <template #trigger="{ isOpen }">
      <UiItem
        class="ui--clickable"
        :text="`Toggle drawer ${n}`"
        :icon="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'"
      />
    </template>

    <template #contents="{ close }">
      <div style="border: 1px solid #ccc; background: #fff">
        <h2>Drawer {{ n }} contents</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dolor
          velit, luctus id lacus non, vestibulum ultricies tortor. Phasellus at
          odio ac neque tristique consectetur. Pellentesque eu magna eleifend,
          venenatis velit nec, tincidunt purus. Nullam pulvinar non lacus vitae
          malesuada. Etiam eget pellentesque leo. In aliquet laoreet ante. In
          hac habitasse platea dictumst.
        </p>
        <button @click="close()">
          close
        </button>
      </div>
    </template>
  </UiDrawer>

  <hr>
  Con drawer-group:

  <UiDrawer
    v-for="n in 5"
    :key="n"
    drawer-group="test-drawer"
  >
    <template #trigger="{ isOpen }">
      <UiItem
        class="ui--clickable"
        :text="`Toggle drawer ${n}`"
        :icon="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'"
      />
    </template>

    <template #contents="{ close }">
      <div style="border: 1px solid #ccc; background: #fff">
        <h2>Drawer {{ n }} contents</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dolor
          velit, luctus id lacus non, vestibulum ultricies tortor. Phasellus at
          odio ac neque tristique consectetur. Pellentesque eu magna eleifend,
          venenatis velit nec, tincidunt purus. Nullam pulvinar non lacus vitae
          malesuada. Etiam eget pellentesque leo. In aliquet laoreet ante. In
          hac habitasse platea dictumst.
        </p>
        <button @click="close()">
          close
        </button>
      </div>
    </template>
  </UiDrawer>
</template>
