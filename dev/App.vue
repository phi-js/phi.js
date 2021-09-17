<script setup>
import '/packages/ui/style/normalize.scss';
import '/packages/ui/style/index.scss';

import { shallowRef, ref, watch, onMounted, onBeforeUnmount } from 'vue';

// Lista de paginas
// (por ahora VITE no da una forma de listar archivos locales)
import pages from './pages.js';

// currentPage se inicializa segun el hash actual
const currentPage = ref(window.location.hash.split('#/')[1] || 'home');
const component = shallowRef();
const error = ref();

// Escuchar cambios en el hash de la URL y actualizar currentPage
const onHashChange = () => {
  currentPage.value =
    window.location.hash.split('#/')[1] || window.location.hash.substr(1);
};

onMounted(() => {
  window.addEventListener('hashchange', onHashChange);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', onHashChange);
});

// cuando cambie currentPage, cargamos dinamicamente la pagina /pages/hashname.vue
watch(
  currentPage,
  async () => {
    error.value = null;
    try {
      component.value = await loadPageComponent(currentPage.value);
    } catch (e) {
      component.value = null;
      error.value = e;
    }
  },
  { immediate: true }
);

// Importar el componente asociado a un nombre de pagina
function loadPageComponent(href) {
  let objPage = pages.find((p) => p.href == href);
  let importCallback;
  if (objPage?.import) {
    importCallback = objPage.import;
  } else {
    let baseName = 'pages/' + href;
    importCallback = () => import(`../${baseName}.vue`);
  }

  return importCallback().then((mod) => mod.default);
}

</script>

<template>
  <nav id="app-menu" class="ui-noselect">
    <a
      v-for="page in pages"
      :key="page.href"
      :class="{ '--active': currentPage == page.href }"
      :href="`/#/${page.href}`"
      v-text="page.name"
    ></a>
  </nav>

  <div id="app-body">
    <component :is="component"></component>
    <div v-if="error">
      <h1>404</h1>
      <p>'{{ currentPage }}' no encontrado</p>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  display: flex;
  height: 100%;

  a {
    text-decoration: none;
    color: #257dba;
  }

  #app-menu {
    display: block;
    width: 240px;
    background-color: #ffffff88;

    a {
      display: block;
      padding: 8px 12px;
      font-weight: bold;
      border-radius: 3px;
      margin: 4px;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      &.--active {
        background-color: #257dba;
        color: #fff;
      }
    }
  }

  #app-body {
    flex: 1;
    padding: 18px 32px;
  }
}
</style>