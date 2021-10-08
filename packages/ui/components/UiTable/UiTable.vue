<template>
  <div class="UiTable">
    <table>
      <thead>
        <tr>
          <th
            v-for="(col, i) in columns"
            :key="i"
          >
            <component
              :is="col.slotHeader"
              v-if="col.slotHeader"
            />
            <div v-else>
              {{ col.props.header || 'Sin titulo' }}
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(item, i) in data"
          :key="i"
        >
          <td
            v-for="(col, ci) in columns"
            :key="ci"
            class="column"
          >
            <component
              :is="col.slotContent"
              v-if="col.slotContent"
              :item="item"
              :value="columnValues[i][ci]"
            />
            <div v-else-if="columnValues[i][ci]">
              {{ columnValues[i][ci] }}
            </div>
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <th
            v-for="(col, i) in columns"
            :key="i"
          >
            <component
              :is="col.slotFooter"
              v-if="col.slotFooter"
            />
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>import { getProperty } from '../../helpers'

export default {
  name: 'UiTable',

  props: {
    data: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  computed: {
    columns() {
      if (!this.$slots?.default) {
        return []
      }

      let retval = []
      let renderedSlot = this.$slots.default()

      renderedSlot
        .filter((vnode) => vnode?.type?.name === 'UiColumn')
        .forEach((vNode) => {
          retval.push({
            props: vNode?.props || {},
            slotHeader: vNode?.children?.header,
            slotContent: vNode?.children?.default || vNode?.children?.content,
            slotFooter: vNode?.children?.footer,
          })
        })

      return retval
    },

    columnValues() {
      return this.data.map((item) => {
        let colValues = {}
        this.columns.forEach((column, c) => {
          colValues[c] = column.props?.value ? getProperty(item, column.props.value) : null
        })
        return colValues
      })
    },
  },
}
</script>

<style lang="scss">
.UiTable {
  & > table {
    width: 100%;
    td {
      vertical-align: top;
    }

    th,
    td {
      text-align: left;
    }
  }
}
</style>