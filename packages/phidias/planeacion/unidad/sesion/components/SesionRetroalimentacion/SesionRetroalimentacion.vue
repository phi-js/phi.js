<template>
  <div class="SesionRetroalimentacion">

    <pre>value: {{value}}</pre>

    <UiDrawer :open="!isOpen">
      <template>
        <UiItem
          v-if="isManager || !sesion.estado || (sesion.estado != 'aprobado' && sesion.estado != 'pendiente')"
          class="ui-clickable ui-noselect"
          @click="isOpen = true"
          :icon="curState.icon"
          :icon-color="curState.color"
          :text="curState.text"
          :secondary="sesion.observaciones"
        />
        <UiItem
          v-else
          :icon="curState.icon"
          :icon-color="curState.color"
          :text="curState.text"
          :secondary="sesion.observaciones"
        />
      </template>
    </UiDrawer>

    <UiDrawer :open="isOpen">
      <template>
        <div class="ui-row --tight">
          <UiIcon
            class="ui-padded ui-clickable"
            @click="isOpen = false"
            :value="curState.icon"
            :color="curState.color"
          />
          <select
            v-model="sesion.estado"
            class="ui-native"
          >
            <option
              v-for="option in stateOptions"
              :key="option.value"
              :value="option.value"
              v-text="option.text"
            ></option>
          </select>
        </div>
        <UiInput
          type="textarea"
          v-model="sesion.observaciones"
        />
      </template>
    </UiDrawer>
  </div>
</template>

<script>
import { bindProps } from '@/modules/ui';
import states from '../../states.js';
import { UiItem, UiIcon, UiInput, UiDrawer } from '@/modules/ui';

export default {
  name: 'SesionRetroalimentacion',
  mixins: [bindProps],
  components: { UiItem, UiIcon, UiInput, UiDrawer },

  props: {
    value: {
      type: Object,
      required: false,
      default: null,
    },

    isManager: {
      required: false,
      default: false,
    },
  },

  data() {
    return {
      sesion: null,
      isOpen: false,
      initialState: null,
    };
  },

  $bindProps: {
    sesion: {
      prop: 'value',
      sanitize(newValue) {
        this.initialState =
          this.initialState || newValue?.statevm?.state || 'building';

        return { ...newValue, estado: newValue?.statevm?.state || 'building' };
      },
    },
  },

  computed: {
    curState() {
      let found = states.find(
        (state) => state.id == this.sesion?.statevm?.state
      );

      return found || states[0];
    },

    stateOptions() {
      let retval = states;

      if (!this.isManager) {
        retval = retval.filter((state) => !state.managerOnly);
      }

      if (this.curState?.validTargetIds) {
        retval = retval.filter((state) =>
          this.curState.validTargetIds.includes(state.id)
        );
      }

      // siempre incluir el valor inicial
      let initialState = states.find((state) => state.id == this.initialState);
      if (!retval.find((state) => state.id == initialState.id)) {
        retval.unshift(initialState);
      }

      return retval.map((state) => ({
        text: state.text,
        value: state.id,
      }));
    },
  },
};
</script>