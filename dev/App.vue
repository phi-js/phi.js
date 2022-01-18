<script setup>
// Estilos globales
import '@/packages/ui/style/normalize.scss'
import '@/packages/ui/style/index.scss'

import {
  shallowRef,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  computed,
  reactive,
} from 'vue'

// UI components
import { UiIcon, UiInput, UiItem, UiTree, UiPopover } from '@/packages/ui/components'

// Modulo API: Definicion de clients globales
import { provideApi } from '@/packages/api'
import placeholderApi from '@/packages/placeholder/api'
provideApi(placeholderApi)

import { provideI18n } from '@/packages/i18n'
const i18n = provideI18n({
  locale: 'es', // set locale
  fallbackLocale: 'en', // set fallback locale,
  currency: 'cop', //default currency
  messages: {
    de: { globalWord: 'globales Wort' },
    en: { globalWord: 'Global Word' },
    es: { globalWord: 'Palabra Global' },
    fr: { globalWord: 'mot global' },
  },
})

// Lista de paginas
// (por ahora VITE no da una forma de listar archivos locales)
import { normalize } from '@/packages/ui/helpers'
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
          isActive: filteredChildren.some((child) => child.isActive),
        })
      }
    } else if (strFilter) {
      let searchKey = normalize(node.text)
      if (searchKey.includes(strFilter)) {
        retval.push({
          ...node,
          isActive: true,
        })
      }
    } else {
      retval.push({
        ...node,
        isActive: currentPage.value == node?.payload.href,
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
      throw e
    }
  },
  { immediate: true },
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

// Control de APIs disponibles
const apis = reactive([])
for (let i = 0; i < 5; i++) {
  apis.push({
    id: i,
    name: `API ${i}`,
    baseURL: `https://some-api-${i}.example.com`,
    isEnabled: Math.random() >= 0.5,
  })
}

const enabledApis = computed(() => apis.filter((a) => a.isEnabled))
</script>

<template>
  <div class="ui-theme-default">
    <div id="app__top-bar">
      <!-- <button @click="apis.push(Math.random())">PUSH API</button> -->
      <UiItem
        id="app__logo"
        text="Phi.js"
        icon="/phi.svg"
      />

      <UiPopover>
        <template #trigger>
          <UiItem
            class="api-dialog__trigger ui--clickable"
            icon="mdi:wifi"
            :text="`APIs ${enabledApis.length ? `(${enabledApis.length})` : ''}`"
            :badge="!enabledApis.length ? 0 : null"
          />
        </template>
        <template #contents>
          <div class="api-dialog__contents">
            <UiItem
              v-for="api in apis"
              :key="api.id"
              :icon="
                api.isEnabled
                  ? 'mdi:checkbox-marked'
                  : 'mdi:checkbox-blank-outline'
              "
              :text="api.name"
              :subtext="api.baseURL"
              :icon-color="api.isEnabled ? 'var(--ui-color-success)' : null"
              class="api-item ui--clickable"
              @click="api.isEnabled = !api.isEnabled"
            />
          </div>
        </template>
      </UiPopover>

      <UiItem icon="mdi:web">
        <select
          v-model="i18n.locale"
          class="ui__input"
        >
          <option value="en">
            en
          </option>
          <option value="es">
            es
          </option>
          <option value="de">
            de
          </option>
          <option value="fr">
            fr
          </option>
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

        <UiTree
          v-slot="{item, children, isOpen, toggle}"
          :value="filteredTree"
          class="app__tree"
          :initial-open="(item) => item.isActive"
        >
          <a
            v-if="item?.payload?.href"
            :class="{ '--active': currentPage == item.payload.href }"
            :href="`/#/${item.payload.href}`"
          >
            <UiItem
              :text="item.text"
              :subtext="item.payload.isLocal ? '.local' : ''"
            />
          </a>
          <div v-else>
            <UiItem
              :icon="item.icon"
              :text="item.text"
              :subtext="item.subtext"

              class="ui--clickable"
              @click="toggle()"
            >
              <template
                v-if="children?.length"
                #actions
              >
                <UiIcon :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" />
              </template>
            </UiItem>
          </div>
        </UiTree>
      </div>

      <div id="app-body">
        <transition name="fade">
          <div
            v-if="component"
            :key="currentPage"
          >
            <component :is="component" />
          </div>
        </transition>

        <div v-if="error">
          <h1>404</h1>
          <p>'{{ currentPage }}' no encontrado</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  --app-sidebar-width: 240px;

  --ui-color-primary:#41b883;

  a {
    text-decoration: none;
    color: var(--ui-color-primary);
  }

  em {
    font-size: 0.9em;
    font-weight: 500;
    font-style: normal;
    color: var(--ui-color-primary);
  }

  .app__tree {
    .UiTree__children {
      margin-left: 12px;
    }
  }

  &__top-bar {
    // background-color: #fff;
    padding: 4px 8px;
    display: flex;
    align-items: center;

    & > :last-child {
      margin-left: auto;
    }
  }

  &__logo {
    width: var(--app-sidebar-width);
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
    padding: var(--ui-padding);

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
        background-color: var(--ui-color-primary);
        color: #fff;
      }
    }
  }

  #app-body {
    flex: 1;
    padding: 18px 32px;

    max-width: calc(100% - var(--app-sidebar-width)); // !!!! fixes intental item overflow
  }

  .api-item {
    .ui-item__icon {
      align-self: baseline;
    }
  }

  // Estilos fijos para elementos class="docs-page"
  .docs-page {

    pre {
      padding: var(--ui-padding);
      border-radius: var(--ui-radius);
      background-color: var(--ui-color-darken);

      overflow: auto;
      max-height: 600px;
      max-width: 80vw;
    }

    & > section {
      margin-bottom: var(--ui-breathe);

      & > label {
        display: block;
        font-weight: bold;
        font-family: var(--ui-font-secondary);
      }
    }
  }

  .docs-code {
    overflow: auto;
    max-height: 300px;
    padding: var(--ui-padding);
    border-radius: var(--ui-radius);
    background-color: rgba(0, 0, 0, 0.04);
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
