<script setup>
import UiDetails from './UiDetails.vue'

function deleteMe() {
  return confirm('Delete?')
}

</script>

<template>
  <div class="Docs">
    <h1>UiDetails</h1>
    <code>import { UiDetails } from '@/packages/ui'</code>
    <p>
      UiDetails is a component that allows you to hide and show additional content under a summary. It can also be grouped with other UiDetails components so that only one can be open at a time.
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
          <td>open</td>
          <td>Whether or not the component should be open by default</td>
          <td>Boolean</td>
          <td>No</td>
          <td>false</td>
        </tr>
        <tr>
          <td>text</td>
          <td>The main text to be displayed in the summary</td>
          <td>String, Number</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>subtext</td>
          <td>Secondary text to be displayed in the summary</td>
          <td>String, Number</td>
          <td>No</td>
          <td>''</td>
        </tr>
        <tr>
          <td>icon</td>
          <td>An icon to be displayed in the summary</td>
          <td>String, Number</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>badge</td>
          <td>A badge to be displayed in the summary</td>
          <td>String, Number</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>duration</td>
          <td>The duration of the animation in milliseconds</td>
          <td>Number</td>
          <td>No</td>
          <td>150</td>
        </tr>
        <tr>
          <td>easing</td>
          <td>The easing function to use for the animation</td>
          <td>String</td>
          <td>No</td>
          <td>'ease-out'</td>
        </tr>
        <tr>
          <td>group</td>
          <td>The name of the group that this UiDetails component belongs to. Only one UiDetails component in a group can be open at a time.</td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>onDelete</td>
          <td>A function to call when the delete icon is clicked. If this prop is set, the delete icon will be displayed.</td>
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
          <td>update:open</td>
          <td>Emitted when the open state of the component changes.</td>
        </tr>
        <tr>
          <td>delete</td>
          <td>Emitted when the delete icon is clicked.</td>
        </tr>
        <tr>
          <td>open</td>
          <td>Emitted when the component is opened.</td>
        </tr>
        <tr>
          <td>close</td>
          <td>Emitted when the component is closed.</td>
        </tr>
        <tr>
          <td>before-open</td>
          <td>Emitted before the component is opened.</td>
        </tr>
        <tr>
          <td>before-close</td>
          <td>Emitted before the component is closed.</td>
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
          <td>summary</td>
          <td>The content to be displayed in the summary section. This slot can receive a scoped prop called "is-open", which is a boolean indicating whether the component is currently open or not, and a method called "close", which can be used to close the component.</td>
          <td>:is-open, :close</td>
        </tr>
        <tr>
          <td>actions</td>
          <td>The content to be displayed in the actions section of the summary. This slot can receive the same scoped props as the "summary" slot.</td>
          <td>:is-open, :close</td>
        </tr>
        <tr>
          <td>contents</td>
          <td>The content to be displayed in the main contents section of the component. This slot can receive the same scoped props as the "summary" slot.</td>
          <td>:is-open, :close</td>
        </tr>
        <tr>
          <td>default</td>
          <td>An alias for the "contents" slot. This slot can receive the same scoped props as the "summary" slot.</td>
          <td>:is-open, :close</td>
        </tr>
        <tr>
          <td>footer</td>
          <td>The content to be displayed in the footer section of the component. This slot can receive the same scoped props as the "summary" slot.</td>
          <td>:is-open, :close</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>

    <pre><code>&lt;UiDetails&gt;
  &lt;template #summary&gt;
    &lt;h3&gt;Click me&lt;/h3&gt;
  &lt;/template&gt;
  &lt;p&gt;Hidden content&lt;/p&gt;
&lt;/UiDetails&gt;</code></pre>

    <UiDetails>
      <template #summary>
        <h3>Click me</h3>
      </template>
      <p>Hidden content</p>
    </UiDetails>

    <h3>With icons and badges</h3>

    <pre><code>&lt;UiDetails
  icon="mdi:calendar"
  text="Event Name"
  subtext="Event Description"
  badge="Today"
&gt;
  &lt;p&gt;Details about the event&lt;/p&gt;
&lt;/UiDetails&gt;</code></pre>

    <UiDetails
      icon="mdi:calendar"
      text="Event Name"
      subtext="Event Description"
      badge="Today"
    >
      <p>Details about the event</p>
    </UiDetails>

    <h3>With group functionality</h3>

    <pre><code>&lt;UiDetails group="my-group"&gt;
  &lt;template #summary&gt;
    &lt;h3&gt;Grouped 1&lt;/h3&gt;
  &lt;/template&gt;
  &lt;p&gt;Hidden content&lt;/p&gt;
&lt;/UiDetails&gt;

&lt;UiDetails group="my-group"&gt;
  &lt;template #summary&gt;
    &lt;h3&gt;Grouped 2&lt;/h3&gt;
  &lt;/template&gt;
  &lt;p&gt;Hidden content&lt;/p&gt;
&lt;/UiDetails&gt;</code></pre>

    <UiDetails group="my-group">
      <template #summary>
        <h3>Grouped 1</h3>
      </template>
      <p>Hidden content</p>
    </UiDetails>

    <UiDetails group="my-group">
      <template #summary>
        <h3>Grouped 2</h3>
      </template>
      <p>Hidden content</p>
    </UiDetails>

    <h3>With delete functionality</h3>

    <pre><code>&lt;UiDetails
  text="Delete me"
  @delete="deleteMe"
&gt;
  &lt;p&gt;Hidden content&lt;/p&gt;
&lt;/UiDetails&gt;</code></pre>

    <UiDetails
      text="Delete me"
      @delete="deleteMe"
    >
      <p>Hidden content</p>
    </UiDetails>
  </div>
</template>