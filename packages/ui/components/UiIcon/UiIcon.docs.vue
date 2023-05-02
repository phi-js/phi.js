<!-- eslint-disable max-len -->
<script setup>
import { ref } from 'vue'
import { UiIcon, UiItem } from '@/packages/ui/components'
import UiIconPicker from '../UiIconPicker/UiIconPicker.vue'

const curIcon = ref('mdi:vuejs')
</script>

<template>
  <div class="Docs">
    <h1>UiIcon</h1>
    <code>import { UiIcon } from '@/packages/ui'</code>
    <p>
      The UiIcon component is a reusable icon component that can be used to display icons in web applications.
      The component supports various icon providers, such as SVG files and icon fonts, and can be used with custom icon sets as well.
      When an invalid icon name is provided, the component will display a fallback character instead.
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
          <td>src</td>
          <td>The source of the icon to display.</td>
          <td>String</td>
          <td>No</td>
          <td>�</td>
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
          <td>Emitted when the icon is clicked.</td>
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
          <td>default</td>
          <td>Content to display alongside the icon.</td>
        </tr>
      </tbody>
    </table>

    <fieldset>
      <legend>Example</legend>
      <code>
        &lt;UiIcon src="{{ curIcon }}" /&gt;
      </code>
    </fieldset>


    <fieldset>
      <legend>UiIconPicker</legend>
      <input
        v-model="curIcon"
        type="text"
      >
      <UiIconPicker v-model="curIcon" />
    </fieldset>

    <fieldset>
      <legend>UiIcon</legend>
      <UiIcon :src="curIcon" />
      <UiIcon
        :src="curIcon"
        style="font-size: 2em"
      />
      <UiIcon
        :src="curIcon"
        style="font-size: 3em"
      />
      <UiIcon
        :src="curIcon"
        style="font-size: 4em; color: green"
      />
      <UiIcon
        :src="curIcon"
        style="font-size: 5em; color: blue"
      />
      <UiIcon
        :src="curIcon"
        style="font-size: 6em; color: purple"
      />
    </fieldset>

    <fieldset>
      <legend>UiItem</legend>
      <UiItem
        text="Hello world"
        :icon="curIcon"
        :subtext="curIcon"
      />
    </fieldset>
  </div>
</template>