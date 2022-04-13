<script setup>
import { computed, shallowRef, useSlots, watchEffect } from 'vue'
import { UiOutput } from '../UiOutput'
import { getProperty } from '../../helpers'

const props = defineProps({
  data: {
    type: Array,
    required: false,
    default: () => [],
  },

  columns: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const slots = useSlots()

const computedColumns = computed(() => {
  if (props.columns.length) {
    return props.columns.map((propColumn) => ({
      props: propColumn,
      slotHeader: null,
      slotContent: null,
      slotFooter: null,
    }))
  }

  if (!slots?.default) {
    return []
  }

  let retval = []
  let renderedSlot = slots.default()

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
})

const columnValues = shallowRef([])
watchEffect(() => {
  columnValues.value = props.data.map((item) => {
    let colValues = {}
    computedColumns.value.forEach((column, c) => {
      if (typeof column.props?.value == 'function') {
        colValues[c] = column.props.value(item)
      } else {
        colValues[c] = column.props?.value ? getProperty(item, column.props.value) : null
      }
    })
    return colValues
  })
})
</script>

<template>
  <table class="UiTable">
    <thead>
      <tr>
        <th
          v-for="(col, i) in computedColumns"
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
          v-for="(col, ci) in computedColumns"
          :key="ci"
          class="column"
        >
          <component
            :is="col.slotContent"
            v-if="col.slotContent"
            :item="item"
            :value="columnValues[i][ci]"
          />
          <UiOutput
            v-else-if="col.props.type"
            v-bind="col.props"
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
        <td
          v-for="(col, i) in computedColumns"
          :key="i"
        >
          <component
            :is="col.slotFooter"
            v-if="col.slotFooter"
          />
        </td>
      </tr>
    </tfoot>
  </table>
</template>


<style lang="scss">
.UiTable {
  width: 100%;
  td {
    vertical-align: top;
  }

  th,
  td {
    text-align: left;
  }
}
</style>