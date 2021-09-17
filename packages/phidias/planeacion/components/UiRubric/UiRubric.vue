<template>
  <div class="ui-rubric">
    <table
      class="ui-rubric-table"
      style="width:100%"
      cellspacing="0"
      cellpadding="0"
    >
      <thead>
        <tr>
          <td>
            <slot name="corner"></slot>
          </td>
          <td
            v-for="column in columns"
            :key="column.id"
            :class="{'--column-hover': hoveredColumnId == column.id}"
            @mouseenter="hoveredColumnId = column.id"
            @mouseleave="hoveredColumnId = null"
          >
            <div
              class="ui-rubric-column-header"
              :style="{backgroundColor: column.color}"
            >
              {{ column.text }}
            </div>

            <slot
              name="column-description"
              :column="column"
            ></slot>
          </td>
          <td>
            <slot name="row-end-header"></slot>
          </td>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(row, r) in rows"
          :key="row.id"
        >
          <td class="row-header">
            <div
              class="ui-rubric-row-header"
              xxxx-style="{backgroundColor: row.color}"
            >
              <slot
                name="row-header"
                :row="row"
              >{{ row.text || row.name }}</slot>

            </div>
            <slot
              name="row-description"
              :row="row"
            ></slot>
          </td>

          <td
            v-for="(column, c) in columns"
            :key="column.id"
            :class="{'--column-hover': hoveredColumnId == column.id}"
            @mouseenter="hoveredColumnId = column.id"
            @mouseleave="hoveredColumnId = null"
          >
            <slot
              v-if="arrData[r] && arrData[r][c]"
              name="cell"
              :row="row"
              :column="column"
              :item="arrData[r][c]"
            >
              <div class="rubric-cell ui-noselect">
                <pre>{{ arrData[r][c] }}</pre>
              </div>
            </slot>
            <slot
              v-else
              name="empty"
              :row="row"
              :column="column"
            ></slot>
          </td>

          <td>
            <slot
              name="row-end"
              :row="row"
            ></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'UiRubric',

  props: {
    columns: {
      type: Array,
      required: false,
      default: () => [],
    },

    rows: {
      type: Array,
      required: false,
      default: () => [],
    },

    value: {
      type: Array,
      required: false,
      default: () => [],
    },

    rowProperty: {
      type: String,
      required: false,
      default: 'row',
    },

    columnProperty: {
      type: String,
      required: false,
      default: 'column',
    },
  },

  data() {
    return {
      arrData: [],
      hoveredColumnId: null,
    };
  },

  mounted() {
    this.populateArrData();
  },

  watch: {
    value: {
      handler() {
        this.populateArrData();
      },
    },

    rows: {
      handler() {
        this.populateArrData();
      },
    },

    columns: {
      handler() {
        this.populateArrData();
      },
    },
  },

  computed: {
    /*
    Objeto indicando el indice de cada columna segun su ID:
    {
      "c1": 0,
      "c3": 2,
      "c2": 1,
      "c4": 3
    }
    */
    columnIndexes() {
      let retval = {};
      this.columns.forEach((column, columnIndex) => {
        retval[column.id] = columnIndex;
      });
      return retval;
    },

    rowIndexes() {
      let retval = {};
      this.rows.forEach((row, rowIndex) => {
        retval[row.id] = rowIndex;
      });
      return retval;
    },
  },

  methods: {
    warn() {
      // return console.warn(arguments);
    },

    populateArrData() {
      let newValue = Array.isArray(this.value) ? this.value : [];

      let retval = [];
      this.rows.forEach((row, rowIndex) => {
        this.columns.forEach((col, columnIndex) => {
          if (typeof retval[rowIndex] == 'undefined') {
            retval[rowIndex] = [];
          }

          retval[rowIndex][columnIndex] = null;
        });
      });

      newValue.forEach((cellObj) => {
        let rowId =
          typeof cellObj[this.rowProperty] != 'undefined'
            ? cellObj[this.rowProperty]
            : null;

        if (rowId == null) {
          this.warn('UiRubric: Could not determine row for data item', cellObj);
          return;
        }

        let columnId =
          typeof cellObj[this.columnProperty] != 'undefined'
            ? cellObj[this.columnProperty]
            : null;

        if (columnId == null) {
          this.warn(
            'UiRubric: Could not determine column for data item',
            cellObj
          );
          return;
        }

        let rowIndex = this.rowIndexes[rowId];
        if (typeof rowIndex == 'undefined') {
          this.warn(
            'UiRubric: Could not determine row index for data item',
            cellObj
          );
          return;
        }

        let columnIndex = this.columnIndexes[columnId];
        if (typeof columnIndex == 'undefined') {
          this.warn(
            'UiRubric: Could not determine column index for data item',
            cellObj
          );
          return;
        }

        retval[rowIndex][columnIndex] = cellObj;
      });

      this.arrData = retval;
    },
  },
};
</script>

<style lang="scss">
.ui-rubric {
  .ui-rubric-column-header {
    border-radius: var(--ui-radius);
    padding: var(--ui-padding);
    text-align: center;
  }

  .ui-rubric-row-header {
    margin: 0;
    padding: 5px 0;
  }

  .ui-rubric-table {
    td {
      vertical-align: top;
    }

    thead td,
    td.row-header {
      padding: 3px 4px;
      font-weight: bold;
      font-size: 0.9em;
    }

    // Hovered columns
    td.--column-hover {
      background-color: rgba(0, 0, 0, 0.02);
    }

    // Hovered rows
    tbody tr:hover td {
      background-color: rgba(0, 0, 0, 0.02);
    }
  }
}
</style>