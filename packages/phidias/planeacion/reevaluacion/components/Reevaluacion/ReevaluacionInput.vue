<template>
  <div class="ReevaluacionInput ui-column">
    <UiInput
      label="Nombre"
      type="text"
      v-model="reevaluacion.name"
    />

    <UiInput
      label="Fecha"
      type="timestamp"
      v-model="reevaluacion.date"
    />

    <UiInput label="Producto">
      <PlaneacionProductoPicker
        :course-sequence="reevaluacion.courseSequence"
        v-model="reevaluacion.objProducto"
      />
    </UiInput>
  </div>
</template>

<script>
import { reevaluacion } from '/apis/v4/planeacion/reevaluacion';
import { bindProps, UiInput, UiItem, UiIcon } from '@/modules/ui';
import PlaneacionProductoPicker from '../../../components/PlaneacionProductoPicker/PlaneacionProductoPicker.vue';

export default {
  name: 'ReevaluacionInput',
  mixins: [bindProps],
  components: { UiInput, UiItem, UiIcon, PlaneacionProductoPicker },

  props: {
    value: {
      type: Object,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      reevaluacion,
    };
  },

  $bindProps: {
    reevaluacion: 'value',
  },
};
</script>