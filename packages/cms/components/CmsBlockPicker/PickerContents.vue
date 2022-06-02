<script>
import Quicklaunch from './Quicklaunch/index.js'

import { getBlockDefinition, getPluginData } from '../../functions'
import { UiIcon, UiTabs, UiTab } from '@/packages/ui/components'
import { useI18n } from '../../../i18n'

export default {
  name: 'PickerContents',

  components: {
    UiIcon,
    UiTabs,
    UiTab,
  },

  props: {
    page: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    placeholder: {
      type: String,
      required: false,
      default: 'Buscar ...',
    },

    hideTabs: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  emits: ['input'],

  setup() {
    const pluginData = getPluginData()

    const i18n = useI18n({
      en: {
        'CmsLauncher.Tab.default': 'Content',
        'CmsLauncher.Tab.communication': 'Communication',
        'CmsLauncher.Tab.input': 'Form',
        'CmsLauncher.Tab.academia': 'Academia',
        'CmsLauncher.Tab.ecommerce': 'eCommerce',
        'CmsLauncher.Tab.cms': 'CMS',
        'CmsLauncher.Tab.navigation': 'Navigation',
        'CmsLauncher.Tab.video': 'Video',
        'CmsLauncher.Tab.db': 'Database',
        'CmsLauncher.Tab.embed': 'Embed',
      },

      es: {
        'CmsLauncher.Tab.default': 'Contenido',
        'CmsLauncher.Tab.communication': 'Comunicación',
        'CmsLauncher.Tab.input': 'Formulario',
        'CmsLauncher.Tab.academia': 'Academia',
        'CmsLauncher.Tab.ecommerce': 'eCommerce',
        'CmsLauncher.Tab.cms': 'CMS',
        'CmsLauncher.Tab.navigation': 'Navegación',
        'CmsLauncher.Tab.video': 'Video',
        'CmsLauncher.Tab.db': 'Base de Datos',
        'CmsLauncher.Tab.embed': 'Embebir',
      },
    })

    return {
      pluginData,
      i18n,
    }
  },

  data() {
    return {
      allBlocks: this.pluginData?.blocks || {},

      text: '',
      launcherComponent: null,
      emptyTagsTab: 'default',
      currentTab: 'default',
    }
  },

  computed: {
    availableBlocks() {
      let blocks = []
      for (let name in this.allBlocks) {
        let block = this.allBlocks[name]
        block.name = name
        blocks.push(block)
      }

      return blocks.filter((block) => !block.disabled && !this.containsDisabledTags(block))
    },

    availableTabs() {
      let tabs = {}
      this.availableBlocks.forEach((c) => {
        let tags = c.tags ? c.tags : [this.emptyTagsTab]
        tags.forEach((tag) => {
          tabs[tag] = true
        })
      })

      return Object.keys(tabs)
    },

    currentTabBlocks() {
      let retval = this.availableBlocks.filter((c) =>
        (!c.tags && this.currentTab == this.emptyTagsTab) ||
        (c.tags && c.tags.includes(this.currentTab)))

      if (this.text.trim()) {
        let searchString = this.normalize(this.text)
        retval = retval.filter((c) =>
          this.normalize(c.title).includes(searchString))
      }

      return retval
    },

    suggestedBlocks() {
      return Quicklaunch.getSuggestedBlocks(this.text).map((block) =>
        Object.assign(block, { _suggested: true }))
    },
  },

  methods: {
    containsDisabledTags(component) {
      if (!this.hideTabs.length || !component.tags) {
        return false
      }

      for (let i = 0; i < component.tags.length; i++) {
        if (this.hideTabs.includes(component.tags[i])) {
          return true
        }
      }

      return false
    },

    launchDefinition(definition) {
      let block = Object.assign({}, definition.block, { component: definition.name })
      return this.launchBlock(block)
    },

    async launchBlock(block) {
      let definition = await getBlockDefinition(block)
      if (!definition) {
        return
      }

      if (definition.launcher) {
        this.launcherComponent = definition.launcher
        if (this.launcherComponent.props) {
          // this.launcherComponent.props = interpolate(
          //   this.launcherComponent.props,
          //   { page: this.page },
          // )
        }
        return
      }

      // let targetBlock = Object.assign({}, block, { component: definition.id });
      let targetBlock = Object.assign({}, block)

      targetBlock.props = Object.assign(
        {},
        definition.block.props,
        block.props,
      )

      this.$emit('input', targetBlock)
    },

    autoCreate() {
      if (!this.suggestedBlocks.length) {
        return
      }

      this.launchBlock(this.suggestedBlocks[0])
      this.text = ''
    },

    onDrawerClose() {
      this.launcherComponent = null
    },

    onLauncherComponentInput(input) {
      let blocks = Array.isArray(input) ? input : [input]
      blocks.forEach((block) => this.$emit('input', block))
    },

    onLauncherComponentCancel() { },

    countBlocks(definitionId) {
      let retval = 0;
      (this.page?.blocks || []).forEach((block) => {
        if (block.component == definitionId) {
          retval++
        }
      })
      return retval
    },

    normalize(string) {
      if (!string) {
        return ''
      }

      return string
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
    },

    focus() {
      this.$refs.inputSearch?.focus()
    },
  },
}
</script>

<template>
  <div class="PickerContents">
    <div class="PickerContents__search">
      <input
        ref="inputSearch"
        v-model="text"
        type="text"
        :placeholder="placeholder"
        @keydown.enter.prevent.stop="autoCreate()"
      >
    </div>

    <UiTabs v-model="currentTab">
      <UiTab
        v-for="(tabName, i) in availableTabs"
        :key="i"
        :value="tabName"
        :text="i18n.t(`CmsLauncher.Tab.${tabName}`)"
      />
    </UiTabs>
    <div class="content-under-tabs">
      <div
        v-if="launcherComponent"
        class="launcher-component"
      >
        <component
          :is="launcherComponent.component"
          v-bind="launcherComponent.props"
          @input="onLauncherComponentInput"
          @cancel="onLauncherComponentCancel"
        />
      </div>

      <div class="launcher-picker">
        <div class="launcher-picker-items">
          <div
            v-for="component in currentTabBlocks"
            :key="component.id"
            class="launcher-picker-item"
            @click="launchDefinition(component)"
          >
            <UiIcon
              class="picker-item-icon"
              :src="component.icon"
            />
            <h3>{{ component.title }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.PickerContents {
  position: relative;

  .content-under-tabs {
    min-height: 50px;
    max-height: 500px;
    overflow-y: auto;
  }

  .PickerContents__search {
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);

    textarea,
    input {
      flex: 1;
      font-size: 1em;
      border: 0;
      background: transparent;
      resize: vertical;
      color: inherit;
      outline: none;

      padding: 12px 16px;
    }
  }

  .launcher-picker-items {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;

    .launcher-picker-item {
      width: 110px;

      cursor: pointer;
      margin: 6px;
      padding: 8px;
      text-align: center;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .picker-item-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;

        font-size: 1.8em;
      }

      h3 {
        font-size: 12px;
      }
    }
  }
}
</style>