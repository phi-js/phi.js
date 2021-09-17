<template>
  <UiItem
    class="UnidadSesion"
    :icon="curState.icon"
    :icon-color="curState.color"
    :text="sesion.text"
    :secondary="sesion.fechaInicial && sesion.fechaFinal ? $ts(sesion.fechaInicial, 'day') + ' - ' + $ts(sesion.fechaFinal, 'day') : null"
  />
</template>

<script>
import states from '../../states.js';
import defaultSesion from '../../sesion.js';
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import { UiItem } from '@/modules/ui/components';

export default {
  name: 'UnidadSesion',
  mixins: [useI18n],
  components: { UiItem },

  props: {
    value: {
      required: false,
      default: null,
    },
  },

  computed: {
    sesion() {
      return { ...defaultSesion, ...this.value };
    },

    curState() {
      let found = states.find((state) => state.id == this.sesion.estado);
      return found || states[0];
    },
  },
};
</script>