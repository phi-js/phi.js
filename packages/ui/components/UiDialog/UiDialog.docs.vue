<script setup>
import { ref } from 'vue'
import { UiDialog, UiItem } from '../'

const isSaving = ref(false)
async function doAccept() {
  isSaving.value = true
  await new Promise((resolve) => setTimeout(resolve, 2000))
  isSaving.value = false

  return confirm('Retornar TRUE?')
}

function doCancel() {
  return confirm('Perderás los cambios.  Continuar?')
}

const isOpen = ref(false)
</script>

<template>
  <div class="Docs">
    <h1>UiDialog</h1>
    <code>import { UiDialog } from '@/packages/ui'</code>
    <p>
      The UiDialog component provides a customizable dialog with a trigger, header, content, and footer. It supports opening and closing the dialog, accepting and canceling actions, and handling asynchronous actions with a waiting state.
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
          <td>Initial open state of the dialog.</td>
          <td>String, Number, Boolean</td>
          <td>No</td>
          <td>false</td>
        </tr>
        <tr>
          <td>onAccept</td>
          <td>Function to be called when the accept action is performed.</td>
          <td>Function</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>onCancel</td>
          <td>Function to be called when the cancel action is performed.</td>
          <td>Function</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>tabindex</td>
          <td>Tabindex of the dialog trigger element.</td>
          <td>String, Number</td>
          <td>No</td>
          <td>''</td>
        </tr>
        <tr>
          <td>isWaiting</td>
          <td>Indicates if the dialog is in a waiting state for asynchronous actions.</td>
          <td>Boolean, String</td>
          <td>No</td>
          <td>false</td>
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
          <td>Emitted when the open state of the dialog changes.</td>
        </tr>
        <tr>
          <td>open</td>
          <td>Emitted when the dialog is opened.</td>
        </tr>
        <tr>
          <td>close</td>
          <td>Emitted when the dialog is closed.</td>
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
          <td>Slot for customizing the dialog trigger element.</td>
          <td>isOpen, open, close</td>
        </tr>
        <tr>
          <td>summary</td>
          <td>Alternative naming for the trigger slot.</td>
          <td>isOpen, open, close</td>
        </tr>
        <tr>
          <td>header</td>
          <td>Slot for customizing the dialog header.</td>
          <td>accept, cancel, close</td>
        </tr>
        <tr>
          <td>default</td>
          <td>Slot for customizing the dialog content.</td>
          <td>accept, cancel, close</td>
        </tr>
        <tr>
          <td>footer</td>
          <td>Slot for customizing the dialog footer and action buttons.</td>
          <td>accept, cancel, close</td>
        </tr>
      </tbody>
    </table>


    <fieldset>
      <legend>Basic example</legend>
      <UiDialog>
        <template #trigger>
          Open dialog
        </template>
        <template #default>
          Hello :)
        </template>
      </UiDialog>
    </fieldset>

    <fieldset>
      <legend>v-model:open</legend>

      <label for="chbox">
        isOpen: <input
          id="chbox"
          v-model="isOpen"
          type="checkbox"
        > {{ isOpen }}
      </label>
      <UiDialog v-model:open="isOpen">
        Hello :)
      </UiDialog>
    </fieldset>



    <fieldset>
      <legend>All slots</legend>
      <UiDialog>
        <template #trigger>
          <button>Open Dialog</button>
        </template>
        <template #header>
          <h2>Dialog Title</h2>
        </template>
        <template #default>
          <p>This is the main content of the dialog.</p>
        </template>
        <template #footer="{ close }">
          <button type="submit">
            Accept
          </button>
          <button type="button">
            Do nothing
          </button>
          <button
            type="button"
            @click="close"
          >
            Close
          </button>
        </template>
      </UiDialog>
    </fieldset>


    <fieldset>
      <legend>Accept and Cancel listeneres</legend>
      <UiDialog
        :is-waiting="isSaving"
        @accept="doAccept"
        @cancel="doCancel"
      >
        <template #trigger>
          <UiItem
            class="ui--clickable"
            icon="mdi:window-maximize"
            text="Abrir Dialog"
          />
        </template>

        <template #default>
          <h1>Contenido del dialog</h1>
          <p>dfkjh adsflkjhas dklfhasdf lkahsdfk jlasdh kfjldsakjhf kasdf s</p>
          <p>dfkjh adsflkjhas dklfhasdf lkahsdfk jlasdh kfjldsakjhf kasdf s</p>
          <p>dfkjh adsflkjhas dklfhasdf lkahsdfk jlasdh kfjldsakjhf kasdf s</p>
        </template>
      </UiDialog>
    </fieldset>
  </div>
</template>