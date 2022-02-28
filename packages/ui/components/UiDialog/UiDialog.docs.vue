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
  <UiDialog>
    <template #trigger>
      Click me
    </template>
    <template #contents>
      Hello :)
    </template>
  </UiDialog>

  <hr>

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
</template>