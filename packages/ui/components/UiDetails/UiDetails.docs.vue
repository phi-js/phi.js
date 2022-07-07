<script setup>
import { ref } from 'vue'

import UiDetails from './UiDetails.vue'

const isOpen = ref(true)
</script>

<template>
  <div class="UiDetails-docs">
    <h1>UiDetails</h1>

    <section>
      <label>Thing</label>
      <UiDetails
        text="Show block if"
        open
      >
        <fieldset>
          <legend>All of the following</legend>
          <section>
            <UiDetails
              group="condition"
              text="showParagraphs"
              subtext="contiene cualquiera: Si"
              @delete="() => true"
            >
              <div class="stuff">
                Stuff
              </div>
            </UiDetails>
            <UiDetails
              group="condition"
              text="showParagraphs"
              subtext="contiene: No"
              @delete="() => true"
            >
              <div class="stuff">
                Stuff
              </div>
            </UiDetails>
            <UiDetails
              group="condition"
              text="showParagraphs"
              subtext="contiene todos: Si, No"
            >
              <div class="stuff">
                Stuff
              </div>
            </UiDetails>
          </section>
        </fieldset>
      </UiDetails>
    </section>

    <section>
      <pre>isOpen: {{ isOpen }}</pre>
      <label style="user-select:none">
        <input
          v-model="isOpen"
          type="checkbox"
        >
        isOpen
      </label>

      <UiDetails
        v-model:open="isOpen"
        text="Thing"
        group="test-1"
      >
        <h1>Hello!</h1>
      </UiDetails>
    </section>

    <section>
      <label>Nested</label>
      <UiDetails
        v-for="i in 7"
        :key="i"
        :text="`Contenido cosa ${i}`"
        subtext="Oh yeah"
        group="test-1"
        @delete="() => 1"
      >
        <template #default>
          <UiDetails
            v-for="j in 4"
            :key="j"
            :group="`group-${i}`"
            :text="`Subcosa ${i}.${j}`"
            @delete="() => 1"
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur habichuela porta.
              Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur mater.
              Interdum et malesuada fames ac ante ipsum primis in faucibus anus.
            </p>
          </UiDetails>
        </template>
      </UiDetails>
    </section>
  </div>
</template>

<style lang="scss">
.UiDetails-docs {
  max-width: 500px;

  .stuff {
    padding: 16px;
    height: 100px;
  }
}
</style>