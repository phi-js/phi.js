<script setup>
import { ref } from 'vue'
import { UiTabs, UiTab } from './index.js'

const selectedTab = ref()
</script>

<template>
  <div class="Docs">
    <h1>UiTabs</h1>
    <code>import { UiTabs } from '@/packages/ui'</code>
    <p>UiTabs is a tab component that allows users to switch between different content sections. It provides an easy way to manage and display tabbed content.</p>

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
          <td>modelValue</td>
          <td>Value of the selected tab.</td>
          <td>Any</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>name</td>
          <td>Name to be used as a key for localStorage to remember tab positions.</td>
          <td>String</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>autoSelect</td>
          <td>Select first tab on null modelValue.</td>
          <td>Boolean</td>
          <td>false</td>
          <td>true</td>
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
          <td>update:modelValue</td>
          <td>Emitted when the selected tab value changes.</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
          <th>Slot bindings</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>left</td>
          <td>Slot for custom content on the left side of the tab list.</td>
          <td>-</td>
        </tr>
        <tr>
          <td>right</td>
          <td>Slot for custom content on the right side of the tab list.</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>

    <pre><code>&lt;UiTabs :model-value="selectedTab"&gt;
  &lt;UiTab text="tab1" value="tab1"&gt;Tab 1&lt;/UiTab&gt;
  &lt;UiTab text="tab2" value="tab2"&gt;Tab 2&lt;/UiTab&gt;
&lt;/UiTabs&gt;</code></pre>

    <UiTabs :model-value="selectedTab">
      <UiTab
        text="tab1"
        value="tab1"
      >
        Tab 1
      </UiTab>
      <UiTab
        text="tab2"
        value="tab2"
      >
        Tab 2
      </UiTab>
    </UiTabs>

    <pre><code>&lt;UiTabs name="myTabs"&gt;
  &lt;UiTab text="tab1" value="tab1"&gt;Tab 1&lt;/UiTab&gt;
  &lt;UiTab text="tab2" value="tab2"&gt;Tab 2&lt;/UiTab&gt;
  &lt;template #left&gt;Left Content&lt;/template&gt;
  &lt;template #right&gt;Right Content&lt;/template&gt;
&lt;/UiTabs&gt;</code></pre>

    <UiTabs name="myTabs">
      <UiTab
        text="tab1"
        value="tab1"
      >
        Tab 1
      </UiTab>
      <UiTab
        text="tab2"
        value="tab2"
      >
        Tab 2
      </UiTab>
      <template #left>
        Left Content
      </template>
      <template #right>
        Right Content
      </template>
    </UiTabs>

    <hr>
    <h2>Tabs with window hash navigation</h2>
    <p>just use href="#tabname" in each tab</p>
    <UiTabs>
      <UiTab
        text="Thing 1"
        href="#/phi.js/packages/ui/components/UiTabs/UiTabs.docs.vue#thing1"
      >
        <h1>Thing 1</h1>
      </UiTab>
      <UiTab
        text="Thing 2"
        href="#/phi.js/packages/ui/components/UiTabs/UiTabs.docs.vue#thing2"
      >
        <h1>Thing 2</h1>
      </UiTab>
      <UiTab
        text="Thing 3"
        href="#/phi.js/packages/ui/components/UiTabs/UiTabs.docs.vue#thing3"
      >
        <h1>Thing 3</h1>
      </UiTab>
    </UiTabs>
  </div>
</template>