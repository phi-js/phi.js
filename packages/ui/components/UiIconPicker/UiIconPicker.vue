<template>
  <div class="UiIconPicker">
    <UiIcon
      class="UiIconPicker__current ui--clickable"
      :src="modelValue"
      :color="color"
      @click="isDialogOpen = true"
    />

    <UiDialog
      v-model:open="isDialogOpen"
      @close="onDialogClose"
    >
      <template #header>
        <slot name="header" />

        <input
          class="UiIconPicker__search"
          type="text"
          placeholder="Buscar ..."
          :value="searchString"
          @input="setSearchString($event.target.value)"
        >

        <div
          v-show="!searchString"
          class="UiIconPicker__pagination"
        >
          <div
            class="UiIconPicker__page-item ui--clickable --prev"
            @click="currentPage = Math.max(currentPage-1, 1)"
          >
            &lsaquo;
          </div>

          <div
            v-for="n in nPages"
            :key="n"
            class="UiIconPicker__page-item ui--clickable"
            :class="{'--selected': currentPage == n}"
            @click="currentPage = n"
          >
            {{ n }}
          </div>

          <div
            class="UiIconPicker__page-item ui--clickable --next"
            @click="currentPage = Math.min(currentPage+1, nPages)"
          >
            &rsaquo;
          </div>
        </div>
      </template>

      <template #contents>
        <div class="UiIconPicker__grid">
          <span
            v-for="iconName in listedIcons"
            :key="iconName"
            :class="['mdi', `mdi-${iconName}`, 'ui--clickable', {'--selected': modelValue == `mdi:${iconName}`}]"
            :title="iconName"
            @click="selectIcon(iconName)"
          />
        </div>
      </template>
    </UiDialog>
  </div>
</template>

<script>
import mdiIcons from '../UiIcon/Provider/Mdi.js'
import { UiIcon } from '../UiIcon'
import { UiDialog } from '../UiDialog'

export default {
  name: 'UiIconPicker',
  components: { UiIcon, UiDialog },

  props: {
    modelValue: {
      type: String,
      required: false,
      default: null,
    },

    color: {
      type: String,
      required: false,
      default: null,
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      isDialogOpen: false,
      searchString: '',
      searchTimer: null,
      pageSize: 250,
      currentPage: 1,
    }
  },

  computed: {
    nPages() {
      return Math.ceil(mdiIcons.length / this.pageSize)
    },

    listedIcons() {
      let query = this.searchString.trim()
      if (query) {
        let exp = new RegExp(query)
        return mdiIcons.filter((i) => exp.test(i))
      }

      let start = (this.currentPage - 1) * this.pageSize
      let end = start + this.pageSize

      return mdiIcons.slice(start, end)
    },
  },

  methods: {
    selectIcon(iconName) {
      this.$emit('update:modelValue', `mdi:${iconName}`)
      this.isDialogOpen = false
      this.onDialogClose()
    },

    onDialogClose() {
      this.searchString = ''
      this.currentPage = 1
      return true
    },

    setSearchString(value) {
      let trimmedValue = value.trim()
      if (!trimmedValue) {
        this.searchString = ''
        return
      }

      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(
        () => (this.searchString = trimmedValue),
        400,
      )
    },
  },
}
</script>

<style lang="scss">
.UiIconPicker {
  &__current {
    --ui-icon-size: 28px;
  }

  &__search {
    display: block;
    width: 100%;
    font: inherit;
    border: 0;
    background-color: rgba(0, 0, 0, 0.03);
  }

  &__pagination {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
  }

  &__page-item {
    display: block;
    padding: 8px 12px;

    &.--selected {
      font-weight: bold;
      color: var(--ui-color-primary);
    }
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;

    .mdi {
      display: block;
      padding: 8px 12px;
      font-size: 28px;
      border: 1px solid transparent;
      color: #666;

      &.--selected {
        color: var(--ui-color-primary);
        border: 1px solid var(--ui-color-primary);
      }
    }
  }
}
</style>