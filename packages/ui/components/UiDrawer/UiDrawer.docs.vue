<script setup>
import { ref } from 'vue'
import { UiDrawer } from './index.js'
import { UiItem } from '../UiItem'

const isOpen = ref(false)

</script>

<template>
  <div class="Docs">
    <h1>UiDrawer</h1>
    <code>import { UiDrawer } from '@/packages/ui'</code>
    <p>
      A drawer component that can be triggered to open and close, revealing its contents.
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
          <td>Determines whether the drawer is initially open or closed.</td>
          <td>Boolean</td>
          <td>No</td>
          <td>false</td>
        </tr>
        <tr>
          <td>drawerGroup</td>
          <td>
            If multiple instances of UiDrawer are in the same drawerGroup, opening one will close all others.
          </td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>duration</td>
          <td>
            The duration of the opening/closing animation, in milliseconds.
          </td>
          <td>Number</td>
          <td>No</td>
          <td>240</td>
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
          <td>Emitted when the drawer's open prop changes. The new value is passed as an argument.</td>
        </tr>
        <tr>
          <td>open</td>
          <td>Emitted when the drawer opens.</td>
        </tr>
        <tr>
          <td>close</td>
          <td>Emitted when the drawer closes.</td>
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
          <td>The element that triggers the opening/closing of the drawer.</td>
          <td>
            <ul>
              <li><strong>:is-open</strong>: Whether the drawer is currently open or closed.</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>contents</td>
          <td>The contents of the drawer.</td>
          <td>
            <ul>
              <li><strong>:isOpen</strong>: Whether the drawer is currently open or closed.</li>
              <li><strong>:close</strong>: A function that can be called to close the drawer.</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>default</td>
          <td>
            The default slot can be used as a shortcut if you don't need to pass any props or slots to the contents slot.
          </td>
          <td>
            <ul>
              <li><strong>:isOpen</strong>: Whether the drawer is currently open or closed.</li>
              <li><strong>:close</strong>: A function that can be called to close the drawer.</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <pre><code>
import { UiDrawer } from '@/packages/ui'

&lt;UiDrawer&gt;
  &lt;template #trigger&gt;
    &lt;button&gt;Toggle drawer&lt;/button&gt;
  &lt;/template&gt;

  &lt;template #contents&gt;
    &lt;p&gt;Drawer contents&lt;/p&gt;
  &lt;/template&gt;
&lt;/UiDrawer&gt;
</code></pre>

    <UiDrawer>
      <template #trigger>
        <button>Toggle drawer</button>
      </template>

      <template #contents>
        <p>Drawer contents</p>
      </template>
    </UiDrawer>

    <pre><code>
import { UiDrawer } from '@/packages/ui'

&lt;UiDrawer :duration="500"&gt;
  &lt;template #trigger&gt;
    &lt;button&gt;Toggle drawer&lt;/button&gt;
  &lt;/template&gt;

  &lt;template #contents="{ close }"&gt;
    &lt;button @click="close"&gt;Close drawer&lt;/button&gt;
    &lt;p&gt;Drawer contents&lt;/p&gt;
  &lt;/template&gt;
&lt;/UiDrawer&gt;
</code></pre>

    <UiDrawer :duration="500">
      <template #trigger>
        <button>Toggle drawer</button>
      </template>

      <template #contents="{ close }">
        <button @click="close">
          Close drawer
        </button>
        <p>Drawer contents</p>
      </template>
    </UiDrawer>


    <!-- Human made -->
    <hr>
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
  </div>
</template>
