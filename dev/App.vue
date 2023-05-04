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
import { getTree, getComponent } from './pages.js'

import { provideI18n } from '@/packages/i18n'
const i18n = provideI18n({
  // new options
  languages: {
    en: 'English',
    es: 'Español',
    de: 'Deutsch',
    fr: 'Français',
    pir: 'Pirate!',
  },
})

function filterTree(arrTree, strSearch) {
  let retval = []
  arrTree.forEach((node) => {
    if (node?.children?.length) {
      let filteredChildren = filterTree(node.children, strSearch)
      if (filteredChildren.length) {
        retval.push({
          ...node,
          children: filteredChildren,
          isActive: filteredChildren.some((child) => child.isActive),
        })
      }
    } else if (strSearch) {
      let searchKey = normalize(node.text)
      if (searchKey.includes(strSearch)) {
        retval.push({
          ...node,
          isActive: true,
        })
      }
    } else {
      retval.push({
        ...node,
        isActive: currentUrl.value == node?.url,
      })
    }
  })
  return retval
}

const pagesTree = getTree()

const searchString = ref('')
const filteredTree = computed(() => {
  let search = normalize(searchString.value.trim())
  return filterTree(pagesTree, search)
})


// currentUrl se inicializa segun el hash actual
const currentUrl = ref(window.location.hash.split('#')[1] || '/phi.js/1.home.vue') // !!! hard-coded default page.  SHould look for first available one

// Escuchar cambios en el hash de la URL y actualizar currentUrl
const onHashChange = () => {
  currentUrl.value = window.location.hash.split('#')[1] || window.location.hash.substr(1)
}

onMounted(() => window.addEventListener('hashchange', onHashChange))
onBeforeUnmount(() => window.removeEventListener('hashchange', onHashChange))

const component = shallowRef()
const error = ref()

// cuando cambie currentUrl, cargamos dinamicamente la pagina /pages/hashname.vue
watch(
  currentUrl,
  async (newValue) => {
    // searchString.value = ''
    error.value = null
    try {
      component.value = await getComponent(newValue)
    } catch (e) {
      component.value = null
      error.value = e
      throw e
    }
  },
  { immediate: true },
)

function onClickCodeBlock(evt) {
  const codeBlock = evt.target
  navigator.clipboard.writeText(codeBlock.textContent)
  codeBlock.classList.add('Docs__copiable--copied')
  setTimeout(() => codeBlock.classList.remove('Docs__copiable--copied'), 1000)
}

function onComponentMounted(evt) {
  if (evt?.el?.classList && evt.el.classList.contains('Docs')) {
    const codeBlocks = evt.el.querySelectorAll('code')
    codeBlocks.forEach((codeBlock) => {
      codeBlock.classList.add('Docs__copiable')
      codeBlock.setAttribute('title', 'Click to copy')
      codeBlock.addEventListener('click', onClickCodeBlock)
    })
  }
}

function onComponentUnmounted(evt) {
  if (evt?.el?.classList && evt.el.classList.contains('Docs')) {
    const codeBlocks = evt.el.querySelectorAll('code')
    codeBlocks.forEach((codeBlock) => {
      codeBlock.classList.remove('Docs__copiable')
      codeBlock.removeAttribute('title')
      codeBlock.removeEventListener('click', onClickCodeBlock)
    })
  }
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

      <UiInput
        v-model="i18n.language.value"
        class="App__langPicker"
        type="select-native"
        icon="mdi:web"
        :options="i18n.availableLanguages"
      />
    </div>

    <div class="App__container">
      <div class="App__sidebar">
        <UiInput
          v-model="searchString"
          class="App__sidebarSearch"
          type="search"
          placeholder="Buscar..."
          :value="searchString"
          @input="searchString = $event.target.value"
        />

        <UiTree
          class="NavTree"
          :value="filteredTree"
          :initial-open="(item) => item.isActive"
        >
          <template #item="{ item, children, isOpen, toggle }">
            <a
              v-if="!item.children"
              class="NavTree__link"
              :class="{ 'NavTree__link--active': currentUrl == item.url }"
              :href="`#${item.url}`"
            >
              <UiItem :text="item.text" />
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
          </template>
        </UiTree>
      </div>

      <div class="App__body">
        <Transition name="fade">
          <div
            v-if="component"
            :key="currentUrl"
          >
            <Component
              :is="component"
              @vue:mounted="onComponentMounted"
              @vue:unmounted="onComponentUnmounted"
            />
          </div>
        </Transition>

        <div v-if="error">
          <h1>404</h1>
          <p>'{{ currentUrl }}' no encontrado</p>
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
    width: 300px;
    padding: 6px;
    margin: 10px;

    overflow-y: auto;
    overscroll-behavior: contain;

    max-height: calc(100vh - 54px - 20px - 4px); // minus top bar height, minus 2*margin, minus a small padding
    position: sticky;
    top: 0;

    scrollbar-width: thin; /*firefox only*/
    &::-webkit-scrollbar { /*webkit based browsers only*/
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  &__sidebarSearch {
    position: sticky;
    top: 0;
    z-index: 2;
    input {
      width: 100%;
    }
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


.Docs {
  padding: 12px 20px;

  a {
    text-decoration: underline;
  }

  var {
    font-style: normal;
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    padding: 4px 10px;
    font-weight: bold;
  }

  code {
    white-space: pre-wrap;
    display: block;
    border: 1px solid #999;
    border-radius: 4px;
    padding: 12px 16px;
  }

  table {
    width: 100%;
    margin-bottom: 1rem;
    border-spacing: 0;

    th:first-child {
      width: 16%;
    }

    th {
      text-align: left;
      border-bottom: 1px solid #ccc;
    }

    td {
      vertical-align: top;
      padding: 4px;
    }
  }

  &__copiable {
    cursor: pointer;
    &:hover {
      background-color: #ffff8877;
    }

    &--copied {
      position: relative;
      &::before {
        content: 'Copied';
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;

        margin: 6px;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 0.7rem;

        background-color: rgba(0,0,0, 0.7);
        color: #fff;
      }
    }
  }
}

</style>
