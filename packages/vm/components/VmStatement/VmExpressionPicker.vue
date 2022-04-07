<script>
import { plugins } from '../../plugins/registerPlugin.js'
import { UiItem, UiPopover } from '../../../ui'

export default {
  name: 'VmExpressionPicker',
  components: { UiItem, UiPopover },

  emits: ['input'],

  data() {
    return {}
  },

  computed: {
    functions() {
      const allFunctions = {}
      plugins.forEach((plugin) => {
        for (let fnName in plugin.functions) {
          allFunctions[fnName] = plugin.functions[fnName]
          allFunctions[fnName].name = fnName
        }
      })
      return allFunctions
    },
  },

  methods: {
    launchBlankStatement() {
      this.$emit('input', {
        expression: {},
        definition: {
          icon: 'mdi:state-machine',
          text: 'Custom statement',
        },
      })
    },

    launchFunction(definition) {
      let expression = {
        call: definition.name,
        args: null,
      }
      this.$emit('input', { expression, definition })
    },

    launchIf() {
      let expression = {
        if: { and: [] },
        then: { do: null },
        else: { do: null },
      }

      this.$emit('input', {
        expression,
        definition: {
          icon: 'mdi:directions-fork',
          text: 'IF',
        },
      })
    },

    launchSwitch() {
      let expression = {
        switch: null,
        case: [],
        default: { chain: [] },
      }

      this.$emit('input', {
        expression,
        definition: {
          icon: 'mdi:electric-switch',
          text: 'Switch',
        },
      })
    },

    launchEval() {
      this.$emit('input', {
        expression: { eval: '' },
        definition: {
          icon: 'mdi:language-javascript',
          text: 'JavaScript function',
        },
      })
    },

    // launchOperator(op) {
    //   this.$emit('input', {
    //     op: op.name,
    //     field: null,
    //     args: null,
    //   });
    // },
  },
}
</script>

<template>
  <div class="VmExpressionPicker">
    <UiPopover placement="bottom-start">
      <template #trigger>
        <UiItem
          class="ui--clickable"
          icon="mdi:plus-circle"
          subtext="Agregar ..."
        />
      </template>

      <template #contents="{ close }">
        <div class="VmExpressionPicker__popover-contents">
          <div class="launcher-functions">
            <UiItem
              v-for="fn in functions"
              :key="fn.name"
              v-bind="fn"
              class="ui--clickable"
              @click="close(); launchFunction(fn)"
            />
          </div>

          <div class="launcher-statements">
            <UiItem
              class="ui--clickable"
              icon="mdi:directions-fork"
              text="IF"
              @click="close(); launchIf()"
            />

            <UiItem
              class="ui--clickable"
              icon="mdi:electric-switch"
              text="Switch"
              @click="close(); launchSwitch()"
            />
          </div>

          <UiItem
            class="ui--clickable"
            icon="mdi:language-javascript"
            text="JavaScript function"
            @click="close(); launchEval()"
          />

          <UiItem
            class="ui--clickable"
            icon="mdi:state-machine"
            text="Statement"
            @click="close(); launchBlankStatement()"
          />
        </div>
      </template>
    </UiPopover>
  </div>
</template>

<style lang="scss">
.VmExpressionPicker {
  user-select: none;

  &__popover-contents {
    --ui-item-padding: 8px 12px;
    user-select: none;

    border-radius: 5px;
    width: 220px;
    max-height: 500px;
    overflow: auto;

    .ui--clickable {
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>