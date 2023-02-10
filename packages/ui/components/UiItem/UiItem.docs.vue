<script setup>
import { reactive } from 'vue'
import UiItem from './UiItem.vue'

const item = reactive({
  icon: 'mdi:account',
  text: 'Hello world',
  subtext: 'I am here',
})

const fontSizes = [
  '0.8em',
  '1em',
  '1.5em',
  '2em',
  '3em',
  '5em',
]

function saySomething() {
  alert('something!')
}

</script>

<template>
  <div class="UiItemDocs">
    <h1>UiItem</h1>
    <form>
      <select
        v-model="item.icon"
        class="UiInput"
      >
        <option value>
          None
        </option>
        <option value="mdi:account">
          mdi:account
        </option>
        <option value="mdi:android">
          mdi:android
        </option>
        <option value="mdi:close">
          mdi:close
        </option>
        <option value="mdi:delete">
          mdi:delete
        </option>
        <option value="mdi:star">
          mdi:star
        </option>
      </select>

      <input
        v-model="item.text"
        class="UiInput"
        type="text"
        placeholder="text"
      >
      <input
        v-model="item.subtext"
        class="UiInput"
        type="text"
        placeholder="subtext"
      >
      <input
        v-model="item.badge"
        class="UiInput"
        type="text"
        placeholder="badge"
      >
    </form>

    <section>
      <label>With deleter</label>
      <UiItem
        class="ui--clickable"
        v-bind="item"
        @delete="saySomething"
      />
    </section>

    <section>
      <label>Regular item</label>
      <UiItem
        class="ui--clickable"
        v-bind="item"
      />
    </section>

    <section>
      <label>No subtext</label>
      <UiItem
        class="ui--clickable"
        :text="item.text"
        :icon="item.icon"
      />
    </section>

    <section>
      <label>Only text</label>
      <UiItem
        class="ui--clickable"
        :text="item.text"
      />
    </section>

    <section>
      <label>Only text and subtext</label>
      <UiItem
        class="ui--clickable"
        :text="item.text"
        :subtext="item.subtext"
      />
    </section>

    <section>
      <label>Only icon</label>
      <UiItem
        class="ui--clickable"
        :icon="item.icon"
      />
    </section>

    <section>
      <label>Only icon and subtext</label>
      <UiItem
        class="ui--clickable"
        :icon="item.icon"
        :subtext="item.subtext"
      />
    </section>

    <hr>

    <section
      v-for="size in fontSizes"
      :key="size"
    >
      <label>font-size: {{ size }}</label>
      <UiItem
        v-bind="item"
        :style="{ fontSize: size }"
      />
    </section>
  </div>
</template>

<style lang="scss">
.UiItemDocs {
  section {
    margin-bottom: 20px;

    & > label {
      font-weight: bold;
      display: block;
      margin: 4px 0;
    }
  }

  .UiItem {
    --ui-item-padding: 12px 20px;
    // background: #ffff88;
  }
}
</style>