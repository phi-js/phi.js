<template>
  <div class="PlaneacionProductoInput">
    <UiTabs v-model="currentView">
      <UiTab
        value="form"
        text="Datos"
        icon="mdi:form-textbox"
      />
      <UiTab
        value="body"
        text="Caracterización"
        icon="mdi:file"
      />
      <UiTab
        value="rubric"
        text="Evidencias de Desempeño"
        icon="mdi:grid-large"
      />
    </UiTabs>

    <div
      class="editor-section"
      v-show="currentView == 'form'"
    >
      <UiCardEditor
        path="/1/cms/pages/test/files"
        v-model="producto.card"
      />

      <!-- <UiField label="Título">
        <input
          type="text"
          class="ui-native"
          v-model="producto.title"
        />
      </UiField> -->

      <UiField
        class="--wide"
        label="Cursos"
      >
        <select
          multiple
          class="ui-native"
          v-model="producto.cursos"
        >
          <option
            v-for="curso in cursos"
            :key="curso.id"
            :value="curso.id"
          >{{ curso.name }}</option>
        </select>
      </UiField>

      <UiField
        class="--wide"
        label="Red de conocimiento"
      >
        <select
          class="ui-native"
          v-model="producto.red"
        >
          <option :value="null"> --- </option>
          <option
            v-for="red in redes"
            :key="red.id"
            :value="red.id"
          >{{ red.text }}</option>
        </select>
      </UiField>
    </div>

    <div
      class="editor-section"
      v-show="currentView == 'body'"
    >
      <CmsPageEditor v-model="producto.body" />
    </div>

    <div
      class="editor-section"
      v-show="currentView == 'rubric'"
    >
      <PlaneacionProductoRubric
        :notas="notas"
        :competencias="competencias"
        v-model="producto.redacciones"
      />
    </div>

  </div>
</template>

<script>
import { bindProps } from '@/modules/ui';
import { UiField, UiCardEditor, UiTabs, UiTab } from '@/modules/ui/components';
import PlaneacionProductoRubric from './PlaneacionProductoRubric.vue';
import CmsPageEditor from '@/modules/cms/components/Page/PageEditor.vue';

export default {
  name: 'PlaneacionProductoInput',
  mixins: [bindProps],

  components: {
    UiField,
    UiCardEditor,
    UiTabs,
    UiTab,
    PlaneacionProductoRubric,
    CmsPageEditor,
  },

  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    cursos: {
      type: Array,
      required: false,
      default: () => [],
    },

    notas: {
      type: Array,
      required: false,
      default: () => [],
    },

    competencias: {
      type: Array,
      required: false,
      default: () => [],
    },

    redes: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      currentView: 'form',
      producto: {
        title: '',
        cursos: [],
        red: null,
        body: null,
        redacciones: [],
        card: {
          text: '',
          secondary: '',
          color: '',
          cover: '',
        },
      },
    };
  },

  $bindProps: {
    producto: {
      prop: 'value',
      sanitize(objProducto) {
        return {
          ...objProducto,

          // asegurarse de que body sea un objeto
          body: {
            ...objProducto.body,
            // y que tenga un ID.  Si no lo tiene, usar el id de objProducto
            id: objProducto?.body?.id || objProducto.id,
          },
        };
      },
    },
  },
};
</script>