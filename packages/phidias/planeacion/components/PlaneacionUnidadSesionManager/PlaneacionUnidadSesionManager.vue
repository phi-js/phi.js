<template>
  <div class="PhidiasUnidadSesionManager">
    <UnidadSesion
      :unidad="unidad"
      v-if="showCreator"
      @input="crearSesion($event)"
      ref="creator"
    />

    <UnidadSesion
      :unidad="unidad"
      v-for="(sesion, i) in sesiones"
      :key="sesion.id"
      v-model="sesiones[i]"
      @input="onUpdateSesion(sesiones[i])"
      @delete="eliminarSesion(sesion)"
      :read-only="sesion.statevm && (sesion.statevm.state == 'aprobado' || sesion.statevm.state == 'pendiente')"
    >
      <template #right>
        <!-- log de sesion --->
        <UiDialog :trigger-event="null">
          <template #trigger="{ open }">
            <UiItem
              class="ui-clickable right-item"
              icon="mdi:view-list-outline"
              text="Reflexión"
              @mousedown.native.prevent.stop="open()"
            />
          </template>
          <template #contents>
            <PlaneacionSesionLogManager
              :sesion-id="sesion.id"
              :grupos="grupos"
            />
          </template>
        </UiDialog>

        <!-- Control de estados (pendiente, aceptado, rechazado) --->
        <UiDialog :trigger-event="null">
          <template #trigger="{ open }">

            <UiItem
              v-if="sesion.statevm && sesion.statevm.state && stateHash[sesion.statevm.state]"
              class="ui-clickable right-item"
              @mousedown.native.prevent.stop="open()"
              text="Retroalimentación"
              :icon="stateHash[sesion.statevm.state].icon"
              :title="stateHash[sesion.statevm.state].text"
              :icon-color="stateHash[sesion.statevm.state].color"
            />
            <UiItem
              v-else
              text="Retroalimentación"
              class="ui-clickable right-item"
              @mousedown.native.prevent.stop="open()"
              :icon="stateHash['building'].icon"
              :title="stateHash['building'].text"
              :icon-color="stateHash['building'].color"
            />
          </template>
          <template #contents>
            <UnidadSesionViewer :value="sesion" />
            <hr>
            <SesionControl
              ref="sesctrl"
              :is-manager="isManager"
              :sesion-id="sesion.id"
              :states="states"
              @update:state="onUpdateState(i, $event)"
            />
          </template>
          <template #footer="{close}">
            <button
              class="ui-button --main"
              type="button"
              @click="onClickAccept(i, close)"
            >Aceptar</button>
            <button
              class="ui-button --cancel"
              type="button"
              @click="close()"
            >Cancelar</button>
          </template>
        </UiDialog>

      </template>
    </UnidadSesion>
  </div>
</template>

<script>
import useApi from '@/modules/api/mixins/useApi.js';
import apiV4, { planeacion } from '/apis/v4';

import UnidadSesion from './UnidadSesion.vue';
import UnidadSesionViewer from './UnidadSesionViewer.vue';
import PlaneacionSesionLogManager from '../PlaneacionSesionLogManager/PlaneacionSesionLogManager.vue';
import SesionControl from '../SesionControl/SesionControl.vue';
import { UiDialog, UiIcon, UiItem } from '@/modules/ui/components';

export default {
  name: 'PhidiasUnidadSesionManager',
  mixins: [useApi],

  components: {
    UnidadSesion,
    UnidadSesionViewer,
    PlaneacionSesionLogManager,
    SesionControl,
    UiDialog,
    UiIcon,
    UiItem,
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

    unidad: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    /**
     * Arreglo de SESIONES
     */
    value: {
      required: false,
      default: null,
    },

    showCreator: {
      required: false,
      default: true,
    },

    grupos: {
      type: Array,
      required: false,
      default: () => [],
    },

    isManager: {
      required: false,
      default: false,
    },
  },

  data() {
    return {
      sesiones: [],

      states: [
        {
          id: 'building',
          text: 'En proceso',
          icon: 'mdi:file-edit-outline',

          validTargetIds: ['pendiente'],
        },
        {
          id: 'pendiente',
          text: 'Por revisar',
          icon: 'mdi:file-clock-outline',
          color: 'var(--ui-color-warning)',

          validTargetIds: ['aprobado', 'corrigiendo'],
        },
        {
          id: 'aprobado',
          text: 'Aprobado',
          icon: 'mdi:file-check-outline',
          color: 'var(--ui-color-success)',

          validTargetIds: ['corrigiendo'],
          managerOnly: true,
        },
        {
          id: 'corrigiendo',
          text: 'En correcciones',
          icon: 'mdi:file-cancel',
          color: 'var(--ui-color-danger)',

          validTargetIds: ['pendiente'],
          managerOnly: true,
        },
      ],
    };
  },

  computed: {
    stateHash() {
      let retval = {};
      this.states.forEach((state) => (retval[state.id] = state));
      return retval;
    },
  },

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.sesiones = Array.isArray(newValue)
          ? JSON.parse(JSON.stringify(newValue))
          : [];
      },
    },
  },

  methods: {
    onClickAccept(i, doneCallback) {
      this.$refs.sesctrl[0].addEntry().then(doneCallback); // [0], porque solo existe una instancia de SesionControl en un momento dado
    },

    onUpdateState(sesionIndex, newState) {
      this.sesiones[sesionIndex].statevm = this.sesiones[sesionIndex]?.statevm
        ?.state
        ? { ...this.sesiones[sesionIndex].statevm.state, state: newState }
        : { state: newState };

      this.emitInput();
    },

    async eliminarSesion(sesion) {
      if (!confirm('Eliminar esta sesión ?')) {
        return;
      }

      await this.$api.deleteSesion(sesion);
      this.sesiones.splice(this.sesiones.indexOf(sesion), 1);
    },

    async crearSesion(sessionObj) {
      let created = await this.$api.createSesion({
        ...sessionObj,
        unidadId: this.unidadId,
      });

      // this.sesiones.push(created);
      this.sesiones.unshift(created);
      this.$refs.creator.reset();
      this.emitInput();
    },

    async onUpdateSesion(sesionRegistro) {
      if (
        sesionRegistro?.statevm?.state == 'aprobado' ||
        sesionRegistro?.statevm?.state == 'pendiente'
      ) {
        return;
      }

      let updated = await this.$api.updateSesion(sesionRegistro);
      sesionRegistro = updated;
      this.emitInput();
    },

    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.sesiones)));
    },
  },
};
</script>

<style lang="scss">
.PhidiasUnidadSesionManager {
  .right-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
  }
}
</style>