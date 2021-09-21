<script setup>
// Estilos globales
import '/packages/ui/style/normalize.scss'
import '/packages/ui/style/index.scss'

import {
  shallowRef,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  computed
} from 'vue'

// UI components
import { UiInput, UiItem, UiTree } from '/packages/ui/components'

// Modulo API: Definicion de clients globales
import { provideApi } from '/packages/api'
import placeholderApi from '/packages/placeholder/api'
provideApi(placeholderApi)

import { provideI18n } from '/packages/i18n'
const i18n = provideI18n({
  locale: 'es', // set locale
  fallbackLocale: 'en', // set fallback locale,
  messages: {
    en: {
      'myDictionary.globalWord': 'Global Word'
    },
    es: {
      'myDictionary.globalWord': 'Palabra Global'
    }
  }
})

// Lista de paginas
// (por ahora VITE no da una forma de listar archivos locales)
import { normalize } from '/packages/ui/helpers'
import { default as pages, docsTree } from './pages.js'

function filterTree(arrTree, strFilter) {
  let retval = []
  arrTree.forEach((node) => {
    if (node?.children?.length) {
      let filteredChildren = filterTree(node.children, strFilter)
      if (filteredChildren.length) {
        retval.push({
          ...node,
          children: filteredChildren,
          isActive: filteredChildren.some((child) => child.isActive)
        })
      }
    } else if (strFilter) {
      let searchKey = normalize(node.text)
      if (searchKey.includes(strFilter)) {
        retval.push({
          ...node,
          isActive: true
        })
      }
    } else {
      retval.push({
        ...node,
        isActive: currentPage.value == node?.payload.href
      })
    }
  })
  return retval
}

const searchString = ref('')
const filteredTree = computed(() => {
  let search = normalize(searchString.value.trim())
  return filterTree(docsTree, search)
})

// currentPage se inicializa segun el hash actual
const currentPage = ref(window.location.hash.split('#/')[1] || '1.home')
const component = shallowRef()
const error = ref()

// Escuchar cambios en el hash de la URL y actualizar currentPage
const onHashChange = () => {
  currentPage.value =
    window.location.hash.split('#/')[1] || window.location.hash.substr(1)
}

onMounted(() => {
  window.addEventListener('hashchange', onHashChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', onHashChange)
})

// cuando cambie currentPage, cargamos dinamicamente la pagina /pages/hashname.vue
watch(
  currentPage,
  async () => {
    searchString.value = ''
    error.value = null
    try {
      component.value = await loadPageComponent(currentPage.value)
    } catch (e) {
      component.value = null
      error.value = e
    }
  },
  {
    immediate: true
  }
)

// Importar el componente asociado a un nombre de pagina
function loadPageComponent(href) {
  let objPage = pages.find((p) => p.href == href)
  let importCallback
  if (objPage?.import) {
    importCallback = objPage.import
  } else {
    let baseName = 'pages/' + href
    importCallback = () => import(`../${baseName}.vue`)
  }

  return importCallback().then((mod) => mod.default)
}
</script>

<template>
  <div id="app__top-bar">
    <!-- <button @click="apis.push(Math.random())">PUSH API</button> -->
    <UiItem id="app__logo" text="Phidias.js" icon="/phidias.png" />

    <UiItem icon="mdi:web">
      <select v-model="i18n.locale" class="ui-native">
        <option value="en">en</option>
        <option value="es">es</option>
        <option value="de">de</option>
        <option value="fr">fr</option>
      </select>
    </UiItem>
  </div>

  <div id="app__container">
    <div id="app__sidebar">
      <UiInput
        v-model="searchString"
        type="search"
        class="app-search"
        placeholder="Buscar..."
        :value="searchString"
        @input="searchString = $event.target.value"
      />

      <UiTree :value="filteredTree" class="app__tree">
        <template #item="{ item }">
          <a
            :class="{ '--active': currentPage == item.payload.href }"
            :href="`/#/${item.payload.href}`"
          >
            <UiItem
              :text="item.text"
              :subtext="item.payload.isLocal ? '.local' : ''"
            />
          </a>
        </template>
      </UiTree>
    </div>

    <div id="app-body">
      <transition name="fade">
        <div v-if="component" :key="currentPage">
          <component :is="component" />
        </div>
      </transition>

      <div v-if="error">
        <h1>404</h1>
        <p>'{{ currentPage }}' no encontrado</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  --app-sidebar-width: 240px;

  a {
    text-decoration: none;
    color: #257dba;
  }

  &__top-bar {
    background-color: #fff;
    padding: 4px 8px;
    display: flex;
    align-items: center;
  }

  &__logo {
    width: var(--app-sidebar-width);
    margin-right: auto;
  }

  &__container {
    display: flex;
    min-height: 100%;
  }

  &__sidebar {
    display: block;
    overflow: hidden;
    overflow-y: auto;
    width: var(--app-sidebar-width);

    .app-search {
      padding: var(--ui-breathe);

      .ui-input__elem {
        padding: var(--ui-padding);
        border-radius: var(--ui-radius);
        display: block;
        width: 100%;
        border: 0;
        background: #fff;
      }
    }

    a {
      display: block;
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

    .ui-code {
      overflow: auto;
      max-height: 300px;
      padding: var(--ui-padding);
      border-radius: var(--ui-radius);
      background-color: rgba(0, 0, 0, 0.04);
    }
  }

  // Transitions
  #app-body {
    position: relative;
  }

  .fade-enter-active {
    position: absolute;
    top: 18px;
    right: 32px;
    bottom: 18px;
    left: 32px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.1618s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
