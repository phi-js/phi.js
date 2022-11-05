<script setup>
import {
  shallowRef,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  computed,
} from 'vue'

import { UiIcon, UiInput, UiItem, UiTree } from '@/packages/ui/components'

// Lista de paginas
import { normalize } from '@/packages/ui/helpers'
import { default as pages, docsTree } from './pages.js'

import { provideI18n } from '@/packages/i18n'
const i18n = provideI18n({
  locale: 'es', // set locale
  fallbackLocale: 'en', // set fallback locale,
  currency: 'cop', //default currency
  dictionary: {
    de: { globalWord: 'globales Wort' },
    en: { globalWord: 'Global Word' },
    es: { globalWord: 'Palabra Global' },
    fr: { globalWord: 'mot global' },
  },
})

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
const currentPage = ref(window.location.hash.split('#/')[1] || 'home')
const component = shallowRef()
const error = ref()

// Escuchar cambios en el hash de la URL y actualizar currentPage
const onHashChange = () => {
  currentPage.value = window.location.hash.split('#/')[1] || window.location.hash.substr(1)
}

onMounted(() => window.addEventListener('hashchange', onHashChange))
onBeforeUnmount(() => window.removeEventListener('hashchange', onHashChange))

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
</script>

<template>
  <div class="App">
    <div class="App__top-bar">
      <UiItem
        class="App__logo"
        text="Phi.js"
        icon="/phi.svg"
      />

      <UiItem
        icon="mdi:web"
        class="App__langPicker"
      >
        <select v-model="i18n.locale">
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

    <div class="App__container">
      <div class="App__sidebar">
        <UiInput
          v-model="searchString"
          type="search"
          placeholder="Buscar..."
          :value="searchString"
          @input="searchString = $event.target.value"
        />

        <UiTree
          v-slot="{ item, children, isOpen, toggle }"
          class="NavTree"
          :value="filteredTree"
          :initial-open="(item) => item.isActive"
        >
          <a
            v-if="item?.payload?.href"
            class="NavTree__link"
            :class="{ 'NavTree__link--active': currentPage == item.payload.href }"
            :href="`#/${item.payload.href}`"
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
              class="NavTree__toggler"
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

      <div class="App__body">
        <Transition name="fade">
          <div
            v-if="component"
            :key="currentPage"
          >
            <component :is="component" />
          </div>
        </Transition>

        <div v-if="error">
          <h1>404</h1>
          <p>'{{ currentPage }}' no encontrado</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.App {
  &__logo {
    font-weight: bold;
    --ui-item-padding: 0 12px;

    .UiIcon {
      width: 24px;
      height: 24px;
    }
  }

  &__langPicker {
    select {
      border: 0;
      background: transparent;
    }
  }

  &__top-bar {
    display: flex;
    align-items: center;

    padding: 8px 12px;
    background: white;

    & > :last-child {
      margin-left: auto;
    }
  }

  &__container {
    display: flex;
  }

  &__sidebar {
    display: block;
    overflow: hidden;
    overflow-y: auto;
    width: 240px;
    padding: 12px;
  }

  &__body {
    position: relative;
    flex: 1;
    min-width: 0; // prevents child overflow from stretching this div
  }

  // Transitions
  .fade-enter-active {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
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

.NavTree {
  margin-top: 12px;
  user-select: none;

  &__link {
    display: block;
    text-decoration: none;
    color: inherit;
    font-weight: bold;
    padding: 6px 8px;

    &--active {
      color: var(--ui-color-primary);
    }
  }

  &__toggler {
    --ui-item-padding: 6px 8px;
    cursor: pointer;
  }

  &__link,
  &__toggler {
    border-radius: 4px;
    transition: all 200ms;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  .UiTree__children {
    margin-left: 12px;
  }
}

@media (min-width: 320px) and (max-width: 480px) {
  .App {
    &__sidebar {
      display: none;
    }

    &__body {
      padding: 0;
    }
  }

}
</style>
