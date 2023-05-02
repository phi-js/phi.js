<script setup>
import { ref } from 'vue'
import { UiDialog, UiItem, UiInput } from '../'

const isSaving = ref(false)
async function doAccept() {
  isSaving.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000))
  isSaving.value = false

  return true
}

function doCancel() {
  return confirm('Perderás los cambios.  Continuar?')
}
</script>

<template>
  <div class="Docs">
    <h1>UiDialog</h1>
    <code>import { UiDialog } from '@/packages/ui'</code>
    <p>
      The UiDialog component is a customizable dialog box that provides open, close, accept, and cancel functionalities. It also supports custom slots for triggers and contents.
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
          <td>Controls the open state of the dialog.</td>
          <td>String, Number, Boolean</td>
          <td>false</td>
          <td>false</td>
        </tr>
        <tr>
          <td>onAccept</td>
          <td>Function to be executed when the accept button is clicked.</td>
          <td>Function</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>onCancel</td>
          <td>Function to be executed when the cancel button is clicked.</td>
          <td>Function</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>tabindex</td>
          <td>Tabindex attribute for the trigger element.</td>
          <td>String, Number</td>
          <td>false</td>
          <td>''</td>
        </tr>
        <tr>
          <td>closeButton</td>
          <td>Shows a close button in the footer if true.</td>
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
          <td>update:open</td>
          <td>Emitted when the open state changes.</td>
        </tr>
        <tr>
          <td>open</td>
          <td>Emitted when the dialog is opened.</td>
        </tr>
        <tr>
          <td>close</td>
          <td>Emitted when the dialog is closed.</td>
        </tr>
        <tr>
          <td>accept</td>
          <td>Emitted when the accept button is clicked.</td>
        </tr>
        <tr>
          <td>cancel</td>
          <td>Emitted when the cancel button is clicked.</td>
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
          <td>trigger</td>
          <td>Slot for custom trigger elements that open and close the dialog.</td>
        </tr>
        <tr>
          <td>header</td>
          <td>Slot for custom header contents within the dialog.</td>
        </tr>
        <tr>
          <td>contents</td>
          <td>Slot for custom main contents within the dialog.</td>
        </tr>
        <tr>
          <td>default</td>
          <td>Alias for contents slot.</td>
        </tr>
        <tr>
          <td>footer</td>
          <td>Slot for custom footer contents within the dialog. Accept and Cancel buttons are placed here by default.</td>
        </tr>
      </tbody>
    </table>

    <pre><code>
&lt;UiDialog open @update:open="handleOpenUpdate" @open="handleOpen" @close="handleClose" &gt;
  &lt;template #trigger&gt;
    &lt;button&gt;Open Dialog&lt;/button&gt;
  &lt;/template&gt;
  &lt;template #header&gt;
    &lt;h2&gt;Dialog Title&lt;/h2&gt;
  &lt;/template&gt;
  &lt;template #contents&gt;
    &lt;p&gt;This is the main content of the dialog.&lt;/p&gt;
  &lt;/template&gt;
  &lt;template #footer="{ close }"&gt;
    &lt;button @click="close"&gt;Accept&lt;/button&gt;
    &lt;button @click="close"&gt;Cancel&lt;/button&gt;
  &lt;/template&gt;
&lt;/UiDialog&gt;
</code></pre>

    <fieldset>
      <legend>Example</legend>
      <UiDialog>
        <template #trigger>
          <button>Open Dialog</button>
        </template>
        <template #header>
          <h2>Dialog Title</h2>
        </template>
        <template #contents>
          <p>This is the main content of the dialog.</p>
        </template>
        <template #footer="{ close }">
          <button @click="close">
            Accept
          </button>
          <button @click="close">
            Cancel
          </button>
        </template>
      </UiDialog>
    </fieldset>

    <fieldset>
      <legend>Simple example</legend>
      <UiDialog>
        <template #trigger>
          Click me
        </template>
        <template #contents>
          Hello :)
        </template>
      </UiDialog>
    </fieldset>


    <fieldset>
      <legend>Cancel listener</legend>
      <UiDialog @cancel="doCancel">
        <template #trigger>
          <UiItem
            class="ui--clickable"
            icon="mdi:window-maximize"
            text="Abrir Dialog"
          />
        </template>

        <template #contents>
          <h1>Contenido del dialog</h1>
          <p>dfkjh adsflkjhas dklfhasdf lkahsdfk jlasdh kfjldsakjhf kasdf s</p>
          <p>dfkjh adsflkjhas dklfhasdf lkahsdfk jlasdh kfjldsakjhf kasdf s</p>
          <p>dfkjh adsflkjhas dklfhasdf lkahsdfk jlasdh kfjldsakjhf kasdf s</p>
        </template>

        <template #footer="{ close }">
          <div
            class="UiGroup"
            style="background-color: rgba(0, 0, 0, 0.02)"
          >
            <UiInput
              type="button"
              :label="isSaving ? 'Guardando...' : 'Aceptar'"
              :disabled="isSaving"
              @click="doAccept().then(r => r && close())"
            />
            <UiInput
              type="button"
              label="Cancelar"
              class="--cancel"
              @click="doCancel() && close()"
            />
          </div>
        </template>
      </UiDialog>
    </fieldset>
  </div>
</template>