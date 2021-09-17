<template>
  <div class="UnidadSesionScaffold">
    <UiDataScaffold
      v-bind="$attrs"
      v-on="$listeners"
      :insert-guard="insertSesion"
      :update-guard="updateSesion"
      :remove-guard="removeSesion"
    >
      <template #before="{ value, update, accept, cancel }">
        <UiDialog>
          <template #trigger="{ isOpen }">
            <UiItem
              v-show="!isOpen"
              class="ui-clickable"
              icon="mdi:plus-box-outline"
              text="Agregar sesión"
            />
            <UnidadSesionItem
              v-show="isOpen"
              class="ui-clickable"
              :value="value"
            />
          </template>

          <template #contents>
            <UnidadSesionInput
              :value="value"
              @input="update"
            />
          </template>

          <template #footer="{ close }">
            <SesionRetroalimentacion
              class="retroalimentacion-footer"
              :is-manager="isManager"
              :value="value"
              @input="update"
            />

            <div style="display:flex">
              <button
                type="button"
                class="ui-button --main"
                @click="accept().then(close)"
              >Aceptar</button>

              <button
                type="button"
                class="ui-button --cancel"
                @click="cancel().then(close)"
              >Cancelar</button>
            </div>
          </template>
        </UiDialog>
      </template>

      <template #item="{ original, value, update, accept, cancel, remove }">
        <UiDialog>
          <template #trigger>
            <div
              style="display:flex; align-items: center"
              class="ui-clickable"
            >
              <UnidadSesionItem
                style="flex:1"
                :value="value"
              />

              <UiDialog :trigger-event="null">
                <template #trigger="{ open }">
                  <UiItem
                    class="ui-clickable"
                    icon="mdi:view-list-outline"
                    text="Reflexión"
                    @mousedown.native.prevent.stop="open()"
                  />
                </template>
                <template #contents>
                  <PlaneacionSesionLogManager
                    :sesion-id="value.id"
                    :grupos="grupos"
                  />
                </template>
              </UiDialog>

            </div>
          </template>
          <template #contents>
            <!-- modo read-only -->
            <UnidadSesion
              v-if="isManager || original.estado == 'aprobado' || original.estado == 'pendiente'"
              :value="value"
            />
            <UnidadSesionInput
              v-else
              :value="value"
              @input="update"
            />
          </template>

          <template #footer="{ close }">
            <!-- control de retroalimentacion / estados -->
            <SesionRetroalimentacion
              class="retroalimentacion-footer"
              :is-manager="isManager"
              :value="value"
              @input="update"
            />

            <div style="display:flex">
              <button
                type="button"
                class="ui-button --main"
                @click="accept().then(close)"
              >Aceptar</button>

              <button
                type="button"
                class="ui-button --cancel"
                @click="cancel().then(close)"
              >Cancelar</button>

              <button
                :disabled="original.estado == 'aprobado' || original.estado == 'pendiente'"
                style="margin-left: auto"
                type="button"
                class="ui-button --danger"
                @click="remove().then(close)"
              >Eliminar</button>
            </div>
          </template>
        </UiDialog>
      </template>
    </UiDataScaffold>
  </div>
</template>

<script>
import UnidadSesion from './UnidadSesion.vue';
import UnidadSesionInput from './UnidadSesionInput.vue';
import UnidadSesionItem from './UnidadSesionItem.vue';

import SesionRetroalimentacion from '../SesionRetroalimentacion/SesionRetroalimentacion.vue';
import PlaneacionSesionLogManager from '../../../../components/PlaneacionSesionLogManager/PlaneacionSesionLogManager.vue';

import useApi from '@/modules/api/mixins/useApi.js';
import apiV4, { planeacion } from '/apis/v4';

import { UiDataScaffold } from '@/modules/ui/components/UiDataScaffold';
import { UiItem, UiInput, UiDrawer, UiDialog } from '@/modules/ui/components';

export default {
  name: 'UnidadSesionScaffold',
  mixins: [useApi],

  components: {
    SesionRetroalimentacion,
    PlaneacionSesionLogManager,
    UiDataScaffold,
    UiItem,
    UiInput,
    UiDrawer,
    UiDialog,
    UnidadSesion,
    UnidadSesionInput,
    UnidadSesionItem,
  },

  $api: {
    type: apiV4,
    wrappers: [planeacion],
  },

  props: {
    unidadId: {
      required: false,
      default: null,
    },

    isManager: {
      required: false,
      default: false,
    },

    grupos: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  methods: {
    async removeSesion(sesion) {
      if (!confirm('Eliminar esta sesión?')) {
        throw null;
      }
      return this.$api.deleteSesion(sesion);
    },

    async insertSesion(sessionObj) {
      let created = await this.$api.createSesion({
        ...sessionObj,
        unidadId: this.unidadId,
      });

      return created;
    },

    async updateSesion(sesionRegistro) {
      // if (
      //   sesionRegistro?.statevm?.state == 'aprobado' ||
      //   sesionRegistro?.statevm?.state == 'pendiente'
      // ) {
      //   return;
      // }
      let updated = await this.$api.updateSesion(sesionRegistro);
      return updated;
    },
  },
};
</script>

<style lang="scss">
.retroalimentacion-footer {
  margin-bottom: 22px;
}
</style>