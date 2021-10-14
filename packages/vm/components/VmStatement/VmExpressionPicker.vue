<template>
  <div class="VmExpressionPicker">
    <UiPopover placement="bottom-start">
      <template #trigger>
        <UiItem
          class="ui-clickable"
          icon="mdi:plus-circle"
          subtext="Agregar ..."
        />
      </template>

      <template #contents="{close}">
        <div class="launcher-popover-contents">
          <div class="launcher-statements">
            <UiItem
              class="ui-clickable"
              icon="mdi:help-rhombus"
              text="IF"
              @click="close(); launchIf()"
            />

            <UiItem
              class="ui-clickable"
              icon="mdi:electric-switch"
              text="Switch"
              @click="close(); launchSwitch()"
            />
          </div>

          <div class="launcher-functions">
            <UiItem
              v-for="fn in functions"
              :key="fn.name"
              v-bind="fn"
              class="ui-clickable"
              @click="close(); launchFunction(fn)"
            />
          </div>

          <UiItem
            class="ui-clickable"
            icon="mdi:state-machine"
            text="Statement"
            @click="close(); launchBlankStatement()"
          />
        </div>
      </template>
    </UiPopover>
  </div>
</template>

<script>
import functionDefinitions from './functions/index.js'
import { UiItem, UiPopover } from '../../../ui'

export default {
  name: 'VmExpressionPicker',
  components: { UiItem, UiPopover },

  data() {
    return {}
  },

  computed: {
    functions() {
      let retval = []
      for (let fxName in functionDefinitions) {
        retval.push(Object.assign({ name: fxName }, functionDefinitions[fxName]))
      }
      return retval
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
          icon: 'mdi:help-rhombus',
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

<style lang="scss">
.VmExpressionPicker {
  .launcher-trigger {
    padding: var(--ui-padding);
  }

  .launcher-popover-contents {
    width: 480px;
    max-height: 500px;
    overflow: auto;
  }
}
</style>