<!-- eslint-disable max-len -->
<script setup>
import { reactive } from 'vue'
import UiItem from './UiItem.vue'
import UiInput from '../UiInput/UiInput.vue'

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
  <div class="Docs Docs--UiItem">
    <h1>UiItem</h1>
    <code>import { UiItem } from '@/packages/ui'</code>
    <p>
      UiItem is a versatile and customizable list item component. It can display text, subtext, icon, and extra actions. You can also use it as a link by providing an href prop.
    </p>

    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Description</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>text</td>
          <td>Text content of the item</td>
          <td>String, Number</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>subtext</td>
          <td>Subtext content of the item</td>
          <td>String, Number</td>
          <td>No</td>
          <td>''</td>
        </tr>
        <tr>
          <td>icon</td>
          <td>Icon source for the item</td>
          <td>String, Number</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>badge</td>
          <td>Badge content for the item</td>
          <td>String, Number</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>href</td>
          <td>URL for the link</td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>bem</td>
          <td>Additional base BEM name</td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>onDelete</td>
          <td>Delete function for the item</td>
          <td>Function</td>
          <td>No</td>
          <td>null</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>click</td>
          <td>Event emitted when the item is clicked</td>
        </tr>
        <tr>
          <td>click-icon</td>
          <td>Event emitted when the icon is clicked</td>
        </tr>
        <tr>
          <td>click-body</td>
          <td>Event emitted when the body is clicked</td>
        </tr>
        <tr>
          <td>click-actions</td>
          <td>Event emitted when the actions are clicked</td>
        </tr>
        <tr>
          <td>delete</td>
          <td>Event emitted when the delete function is called</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>icon</td>
          <td>Slot for custom icon content</td>
        </tr>
        <tr>
          <td>default</td>
          <td>Slot for custom body content (text and subtext)</td>
        </tr>
        <tr>
          <td>actions</td>
          <td>Slot for custom actions content</td>
        </tr>
      </tbody>
    </table>

    <pre>
      <code>
&lt;UiItem text="Item title" subtext="Item subtitle" icon="mdi:example-icon" /&gt;

&lt;UiItem text="Item title" subtext="Item subtitle" href="https://example.com" /&gt;

&lt;UiItem&gt;
  &lt;template #icon&gt;
    &lt;custom-icon /&gt;
  &lt;/template&gt;
  &lt;template #default&gt;
    &lt;p&gt;Custom body content&lt;/p&gt;
  &lt;/template&gt;
  &lt;template #actions&gt;
    &lt;button&gt;Action&lt;/button&gt;
  &lt;/template&gt;
&lt;/UiItem&gt;
      </code>
      </pre>


    <form style="display:flex">
      <UiInput
        v-model="item.icon"
        label="icon"
        type="select-native"
        :options="[
          { value:'', text:'None' },
          { value:'mdi:account', text: 'mdi:account' },
          { value:'mdi:android', text: 'mdi:android' },
          { value:'mdi:close', text: 'mdi:close' },
          { value:'mdi:delete', text: 'mdi:delete' },
          { value:'mdi:star', text: 'mdi:star' },
        ]"
      />

      <UiInput
        v-model="item.text"
        label="text"
        type="text"
        placeholder="text"
      />
      <UiInput
        v-model="item.subtext"
        label="subtext"
        type="text"
        placeholder="subtext"
      />
      <UiInput
        v-model="item.badge"
        label="badge"
        type="text"
        placeholder="badge"
      />
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
.Docs--UiItem {
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