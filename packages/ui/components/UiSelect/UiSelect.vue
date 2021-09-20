<template>
  <div class="UiSelect">
    <UiPopover v-model:open="isOpen" placement="bottom-start" trigger="">
      <template #trigger="{ open, toggle }">
        <div
          class="picker-face ui-inset"
          tabindex="0"
          @keydown="onFaceKeyDown($event)"
        >
          <div
            v-if="!innerValue.length"
            class="picker-placeholder"
            @click="toggle()"
          >
            <slot name="placeholder">{{ placeholder }} &ZeroWidthSpace;</slot>
          </div>
          <template v-else-if="selectedOptions.length <= maxChips">
            <div
              v-for="option in selectedOptions"
              :key="option.value"
              class="picker-chip"
            >
              <slot
                name="chip"
                v-bind="option"
                :openDialog="() => focusOption(option).then(open)"
                :toggleDialog="() => focusOption(option).then(toggle)"
                :select="() => selectOption(option)"
                :deselect="() => deselectOption(option)"
                :toggle="() => toggleOption(option)"
              >
                <slot
                  name="option"
                  v-bind="option"
                  :select="() => selectOption(option)"
                  :deselect="() => deselectOption(option)"
                  :toggle="() => toggleOption(option)"
                >
                  <div
                    class="generic-option"
                    @click="focusOption(option).then(toggle)"
                  >
                    <p class="generic-option-text">{{ option.text }}</p>
                    <p class="generic-option-subtext">{{ option.subtext }}</p>
                  </div>
                </slot>
              </slot>
            </div>
          </template>
          <div v-else class="picker-aggregator" @click="toggle()">
            <slot name="aggregator" :options="selectedOptions">
              <div class="generic-option">
                <p class="generic-option-text">
                  {{ selectedOptions.length }} elementos seleccionados
                </p>
              </div>
            </slot>
          </div>

          <UiIcon
            class="picker-face-icon"
            :value="isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
            @click="toggle()"
          />
        </div>
      </template>

      <template #contents>
        <div ref="popoverContents" class="picker-popover-contents">
          <div class="picker-search">
            <input
              ref="searchInput"
              v-model="searchString"
              type="text"
              :placeholder="searchPlaceholder"
              @keydown="onSearchKeyDown($event)"
              @input="onSearchInput"
            />
          </div>

          <div class="picker-popover-options">
            <div
              v-for="(option, i) in filteredOptions"
              :key="option.value"
              class="option-container option-listed"
              :class="{
                '--selected': option.isSelected,
                '--focused': focusedIndex === i
              }"
            >
              <slot
                name="list-option"
                v-bind="option"
                :select="() => selectOption(option)"
                :deselect="() => deselectOption(option)"
                :toggle="() => toggleOption(option)"
                :is-focused="focusedIndex === i"
              >
                <slot
                  name="option"
                  v-bind="option"
                  :select="() => selectOption(option)"
                  :deselect="() => deselectOption(option)"
                  :toggle="() => toggleOption(option)"
                  :is-focused="focusedIndex === i"
                >
                  <div
                    class="generic-option"
                    :class="{
                      '--selected': option.isSelected,
                      '--focused': focusedIndex === i
                    }"
                    @click="toggleOption(option)"
                  >
                    <p class="generic-option-text">{{ option.text }}</p>
                    <p class="generic-option-subtext">{{ option.subtext }}</p>
                  </div>
                </slot>
              </slot>
            </div>
          </div>
        </div>
      </template>
    </UiPopover>
  </div>
</template>

<script>
import { getProperty } from '../../helpers'
import { UiPopover } from '../UiPopover'
import { UiIcon } from '../UiIcon'

/**
 * Este componente recibe un arreglo de objetos arbitrarios
 * y muestra in PICKER para seleccionar uno o varios
 */
export default {
  name: 'UiSelect',
  components: { UiPopover, UiIcon },

  props: {
    placeholder: {
      type: String,
      required: false,
      default: null
    },

    multiple: {
      type: Boolean,
      required: false,
      default: false
    },

    /**
     * v-model:
     * Obedece al mismo comportamiento de &lt;select v-model="..."&gt;
     */
    value: {},

    /**
     * Arreglo de objetos arbitrarios
     */
    data: {
      type: Array,
      required: false,
      default: () => []
    },

    /**
     * STRING.  Path json ("$.prop1.prop2") indicando la propiedad del objeto a usar como valor
     *
     * FUNCTION. Función que recibe un argumento "item" con el elemento del arreglo
     * y retorna un escalar para usar como VALOR
     */
    optionValue: {
      type: [String, Function],
      required: false,
      default: '$.value'
    },

    optionText: {
      type: [String, Function],
      required: false,
      default: '$.text'
    },

    optionSubtext: {
      type: [String, Function],
      required: false,
      default: null
    },

    /**
     * Placeholder a usar en el input de busqueda
     */
    searchPlaceholder: {
      type: String,
      required: false,
      default: 'Buscar'
    },

    /**
     * Numero de elementos seleccionados a mostrar, antes
     * de mostrar el texto "N elementos seleccionados"
     */
    maxChips: {
      type: [String, Number],
      required: false,
      default: 3
    },

    /**
     * Cerrar el dialogo al seleccionar una opción
     */
    autoClose: {
      type: [Boolean, String, Number],
      required: false,
      default: 'auto'
    }
  },

  data() {
    return {
      /**
       * Valor interno (siempre es un arreglo)
       */
      innerValue: [],

      focusedIndex: 0,
      searchString: '',
      isOpen: false
    }
  },

  computed: {
    availableOptions() {
      let retval = this.data.map((item) => {
        let optionValue =
          typeof this.optionValue == 'function'
            ? this.optionValue(item)
            : getProperty(item, this.optionValue.substr(2)) || null

        return {
          item,
          value: optionValue,
          text:
            typeof this.optionText == 'function'
              ? this.optionText(item)
              : this.optionText
              ? getProperty(item, this.optionText.substr(2))
              : null,
          subtext:
            typeof this.optionSubtext == 'function'
              ? this.optionSubtext(item)
              : this.optionSubtext
              ? getProperty(item, this.optionSubtext.substr(2))
              : null,
          fulltext: this.getStrings(item).join(' '),
          isSelected: this.innerValue.includes(optionValue),
          select() {},
          deselect() {},
          toggle() {}
        }
      })

      // Si el picker es multiple, mostrar todas
      // las opciones seleccionadas al inicio de la lista
      // if (this.multiple) {
      //   retval.sort((a, b) => b.isSelected - a.isSelected);
      // }

      return retval
    },

    filteredOptions() {
      let search = this.normalize(this.searchString)
      if (!search) {
        return this.availableOptions
      }

      let words = search.split(' ')
      return this.availableOptions.filter((option) =>
        words.every((word) => option.fulltext.includes(word))
      )
    },

    selectedOptions() {
      return this.innerValue.map((value) => {
        let found = this.availableOptions.find((opt) => opt.value === value)
        return (
          found || {
            value,
            item: null,
            text: value,
            subtext: '',
            isSelected: true
          }
        )
      })
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.innerValue = Array.isArray(newValue)
          ? [...newValue]
          : newValue != null
          ? [newValue]
          : []
      }
    },

    isOpen: {
      handler(newValue) {
        this.$nextTick(() => {
          if (newValue) {
            this.$refs?.searchInput?.focus()
          } else {
            this.$el.querySelector('.picker-face').focus()
            this.searchString = ''
          }
        })
      }
    },

    focusedIndex() {
      this.$nextTick(
        () =>
          this.$refs.popoverContents &&
          this.$refs.popoverContents
            .querySelector('.--focused')
            ?.scrollIntoView({
              block: 'nearest',
              inline: 'nearest'
            })
      )
    }
  },

  methods: {
    onFaceKeyDown(event) {
      switch (event.key) {
        case 'Space':
        case 'Enter':
          this.open()
          break

        case 'ArrowDown':
          this.open()
          this.focusedIndex = Math.min(
            this.focusedIndex + 1,
            this.filteredOptions.length - 1
          )
          break

        case 'ArrowUp':
          this.open()
          this.focusedIndex = Math.max(this.focusedIndex - 1, 0)
          break

        default:
          if (event.key.length == 1) {
            this.open()
          }
          break
      }
    },

    onSearchKeyDown(event) {
      switch (event.key) {
        case 'Tab':
          this.close()
          break

        case 'ArrowDown':
          this.focusedIndex = Math.min(
            this.focusedIndex + 1,
            this.filteredOptions.length - 1
          )
          break

        case 'ArrowUp':
          this.focusedIndex = Math.max(this.focusedIndex - 1, 0)
          break

        case 'Backspace':
          break

        case 'Escape':
          break

        case 'Enter':
          this.toggleOption(this.filteredOptions?.[this.focusedIndex])
          break
      }
    },

    onSearchInput() {
      if (this.searchString == ' ') {
        this.searchString = ''
      }

      this.focusedIndex = 0
    },

    clear() {
      this.innerValue = []
      this.$emit('input', this.multiple ? this.innerValue : this.innerValue[0])
    },

    selectOption(option) {
      if (!option || option.isSelected) {
        return
      }

      if (this.multiple) {
        this.innerValue.push(option.value)
      } else {
        this.innerValue = [option.value]
      }
      this.$emit('select', option.item)
      this.$emit('input', this.multiple ? this.innerValue : this.innerValue[0])
      this.afterOptionChange(option)
    },

    deselectOption(option) {
      if (!option || !option.isSelected) {
        return
      }

      let foundIndex = this.innerValue.indexOf(option.value)
      // La option a deseleccionar No en innerValue (no pasa nunca)
      if (foundIndex === -1) {
        this.afterOptionChange(option)
        return
      }

      if (this.multiple) {
        this.innerValue.splice(foundIndex, 1)
      } else {
        // zzzz
        // si es un picker unico, no se desmarca el elemento actual
      }
      this.$emit('deselect', option.item)
      this.$emit('input', this.multiple ? this.innerValue : this.innerValue[0])
      this.afterOptionChange(option)
    },

    toggleOption(option) {
      if (!option) {
        return
      }

      if (option.isSelected) {
        this.deselectOption(option)
      } else {
        this.selectOption(option)
      }
    },

    afterOptionChange() {
      let autoClose =
        this.autoClose === 'auto' ? !this.multiple : this.autoClose

      if (autoClose) {
        this.close()
      } else {
        this.searchString = ''
        this.$refs?.searchInput?.focus()
      }
    },

    async focusOption(option) {
      this.focusedIndex = this.filteredOptions.indexOf(option)
    },

    open() {
      this.isOpen = true

      // Enfocar el ultimo elemento seleccionado
      // (o el primer elemento, si no hay seleccion)
      this.focusedIndex = 0
      for (let i = this.filteredOptions.length - 1; i >= 0; i--) {
        if (this.filteredOptions[i].isSelected) {
          this.focusedIndex = i
          break
        }
      }
    },

    close() {
      this.isOpen = false
      this.searchString = ''
    },

    toggle() {
      this.isOpen ? this.close() : this.open()
    },

    normalize(string) {
      if (!string.trim()) {
        return ''
      }

      return string
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    },

    // Retorna un arreglo con todas las cadenas encontradas en el objeto
    getStrings(object) {
      if (!object) {
        return []
      }

      if (typeof object == 'string') {
        let string = this.normalize(object)
        return string ? [string] : []
      }

      let retval = []

      if (Array.isArray(object)) {
        object.forEach(
          (item) => (retval = retval.concat(this.getStrings(item)))
        )
      } else {
        for (const p in object) {
          retval = retval.concat(this.getStrings(object[p]))
        }
      }

      return retval
    }
  }
}
</script>

<style lang="scss">
.UiSelect {
  display: inline-block;

  .picker-face {
    display: flex;
    max-height: 180px;
    cursor: text;

    .picker-face-icon {
      width: 32px;
    }

    .option-placeholder {
      flex: 1;
    }
  }

  .picker-placeholder {
    padding: var(--ui-padding);
    opacity: 0.8;
  }
}

// Estos quedan FUERA de .UiSelect porque UiPopover los
// agrega al final del documento
.picker-popover-contents {
  .picker-search {
    input {
      display: block;
      width: 100%;
      font-size: 1em;
      margin: 0;
      padding: var(--ui-padding);
      border: 0;
      outline: 0;
      border-bottom: 1px solid #ccc;
    }
  }

  .picker-popover-options {
    overflow-y: auto;
    max-height: 300px;
    min-width: 200px;

    .--selected {
      font-weight: bold;
    }

    .--focused {
      background-color: var(--ui-color-highlight);
    }
  }
}

.generic-option {
  padding: var(--ui-padding);
  cursor: pointer;

  &:hover {
    background-color: var(--ui-color-darken);
  }

  p {
    margin: 0;
    padding: 0;
    font-weight: inherit;
  }

  .generic-option-text {
    font-size: 1em;
  }

  .generic-option-subtext {
    font-size: 0.8em;
    opacity: 0.8;
  }
}
</style>
