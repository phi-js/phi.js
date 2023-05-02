<script setup>
import { ref } from 'vue'
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
  'left-end',
]

const isOpen = ref(false)
</script>

<template>
  <div class="Docs">
    <h1>UiPopover</h1>
    <code>import { UiPopover } from '@/packages/ui-popover'</code>
    <p>
      UiPopover is a customizable tooltip/popover component built on top of Tippy.js. It allows you to display additional information or actions when users interact with an element.
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
          <td>Controls whether the popover is open or closed</td>
          <td>Boolean</td>
          <td>false</td>
          <td>false</td>
        </tr>
        <tr>
          <td>placement</td>
          <td>Defines the position of the popover relative to the trigger element. See <a href="https://atomiks.github.io/tippyjs/#placements">Tippy.js placements</a> for available options.</td>
          <td>String</td>
          <td>false</td>
          <td>'bottom'</td>
        </tr>
        <tr>
          <td>tippy</td>
          <td>Additional Tippy.js options to be passed to the instance</td>
          <td>Object</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>trigger</td>
          <td>Event that triggers the popover. Currently supports 'click' only.</td>
          <td>String</td>
          <td>false</td>
          <td>'click'</td>
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
          <td>Emitted when the popover's open state changes</td>
        </tr>
        <tr>
          <td>open</td>
          <td>Emitted when the popover is opened</td>
        </tr>
        <tr>
          <td>close</td>
          <td>Emitted when the popover is closed</td>
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
          <td>trigger</td>
          <td>Content of the trigger element that users interact with to show/hide the popover</td>
          <td>open, close, toggle</td>
        </tr>
        <tr>
          <td>contents</td>
          <td>Content of the popover itself, can be used to wrap the default slot with additional logic or styling</td>
          <td>close</td>
        </tr>
        <tr>
          <td>default</td>
          <td>Content of the popover itself, displayed inside the "contents" slot if not specified</td>
          <td>close</td>
        </tr>
      </tbody>
    </table>

    <pre><code>
&lt;UiPopover :open="isOpen" placement="bottom-start" trigger="click"&gt;
  &lt;template #trigger&gt;
    &lt;button&gt;Click me&lt;/button&gt;
  &lt;/template&gt;
  &lt;template #default&gt;
    &lt;div&gt;Popover content&lt;/div&gt;
  &lt;/template&gt;
&lt;/UiPopover&gt;
</code></pre>


    <UiPopover
      :open="isOpen"
      placement="bottom-start"
      trigger="click"
    >
      <template #trigger>
        <button>Click me</button>
      </template>
      <template #default>
        <div>Popover content</div>
      </template>
    </UiPopover>


    <div style="text-align: center">
      <UiPopover
        v-for="placement in placements"
        :key="placement"
        :placement="placement"
      >
        <template #trigger>
          <UiItem
            class="ui--clickable"
            icon="mdi:window-maximize"
            text="Abrir Popover"
            :subtext="placement"
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
  </div>
</template>
