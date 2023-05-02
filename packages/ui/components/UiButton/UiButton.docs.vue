<script setup>
import { ref } from 'vue'
import UiButton from './UiButton.vue'

const isLoading = ref(false)
function doLoad() {
  isLoading.value = true
  setTimeout(() => isLoading.value = false, 1000)
}
</script>

<template>
  <div class="Docs">
    <h1>UiButton</h1>
    <code>import { UiButton } from '@/packages/ui'</code>
    <p>
      The UiButton component is a customizable button component that can display an icon, label, loading state, and error state. It is built on top of the UiItem component.
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
          <td>label</td>
          <td>The label to display on the button.</td>
          <td>String</td>
          <td>No</td>
          <td>''</td>
        </tr>
        <tr>
          <td>icon</td>
          <td>The icon to display on the button.</td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>isLoading</td>
          <td>Whether or not the button is in loading state.</td>
          <td>Boolean</td>
          <td>No</td>
          <td>false</td>
        </tr>
        <tr>
          <td>loadingLabel</td>
          <td>The label to display on the button when in loading state.</td>
          <td>String</td>
          <td>No</td>
          <td>''</td>
        </tr>
        <tr>
          <td>error</td>
          <td>The error to display on the button.</td>
          <td>String or Array of Strings</td>
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
          <td>Triggered when the button is clicked.</td>
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
          <td>default</td>
          <td>The default slot can be used to add additional content inside the button.</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>

    <pre><code>
// Example 1: A basic button with a label
&lt;UiButton label="Click Me" /&gt;

// Example 2: A button with an icon and a label
&lt;UiButton label="Save" icon="mdi:content-save" /&gt;

// Example 3: A button in loading state
&lt;UiButton label="Save" icon="mdi:content-save" :is-loading="true" loading-label="Saving..." /&gt;

// Example 4: A button in error state
&lt;UiButton label="Save" icon="mdi:content-save" error="Error message" /&gt;

// Example 5: A button with additional content in the default slot
&lt;UiButton label="Save" icon="mdi:content-save"&gt;
  &lt;span&gt;Additional content&lt;/span&gt;
&lt;/UiButton&gt;
</code></pre>


    <div>
      <UiButton label="Click Me" />
      <UiButton
        label="Save"
        icon="mdi:content-save"
      />
      <UiButton
        label="Save"
        icon="mdi:content-save"
        :is-loading="true"
        loading-label="Saving..."
      />
      <UiButton
        label="Save"
        icon="mdi:content-save"
        error="Error message"
      />
      <UiButton
        label="Save"
        icon="mdi:content-save"
      >
        <span>Additional content</span>
      </UiButton>
    </div>

    <hr>

    <UiButton
      label="Trigger load"
      @click="doLoad()"
    />

    <fieldset>
      <legend>Button nativo</legend>
      <button type="button">
        Este es un slot
      </button>

      <button
        type="button"
        class="UiButton"
      >
        Boton .UiButton
      </button>
      <button
        type="button"
        class="UiButton UiButton--loading"
      >
        .UiButton--loading
      </button>
      <button
        type="button"
        class="UiButton UiButton--error"
      >
        .UiButton--error
      </button>
    </fieldset>

    <fieldset>
      <legend>UiButton</legend>
      <br>
      <UiButton
        :is-loading="isLoading"
        icon="mdi:upload"
        @click="doLoad()"
      />
      <!-- <br><UiButton :isLoading="isLoading" @click="doLoad()" value="Este es un valor" />
      <br><UiButton :isLoading="isLoading" @click="doLoad()" label="Este es un text" />
      <br><UiButton :isLoading="isLoading" @click="doLoad()">Este es un slot</UiButton>-->

      <br>
      <UiButton
        :is-loading="isLoading"
        label="Cargar (err)"
        error="Código no encontrado"
        @click="doLoad()"
      />
      <UiButton
        :is-loading="isLoading"
        label="Cargar"
        loading-label="Cargando"
        @click="doLoad()"
      />
      <br>
      <UiButton
        :is-loading="isLoading"
        icon="mdi:upload"
        loading-label="Cargando"
        value="Este es un valor"
        @click="doLoad()"
      />
      <br>
      <UiButton
        :is-loading="isLoading"
        loading-label="Cargando"
        label="Wachu wachu"
        subtext="Hola mundo"
        @click="doLoad()"
      />
      <br>
      <UiButton
        :is-loading="isLoading"
        loading-label="Cargando"
        @click="doLoad()"
      >
        Este es un slot
      </UiButton>
    </fieldset>
  </div>
</template>