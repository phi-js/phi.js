<template>
  <div class="ui-graph-grid">
    <!-- <label class="ui-noselect ui-clickable">
      <input
        type="checkbox"
        v-model="showGuides"
      >
      Grid
    </label> -->

    <div class="grid-dom">
      <div
        v-for="(col,i) in limits.x"
        :key="i"
        class="grid-column"
        :style="{minWidth: width+'px'}"
      >
        <div
          v-for="(node, j) in nodes.filter((n) => n.x == i)"
          :key="j"
          class="grid-item"
          :style="{
            position: 'absolute',
            top: (node.y*height - height/2)+'px',
            left: (-width/2)+'px',
            minWidth: width+'px',
          }"
        >
          <slot
            name="node"
            :node="node"
          >
            <UiItem
              :style="node.style"
              class="grid-node ui-z ui-noselect --nowrap"
              :class="node.class"
              :text="node.text || node.id"
              v-bind="node"
              @click="$emit('click-node', node.id)"
            />
          </slot>
        </div>
      </div>
    </div>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="grid-svg"
      :class="{'--guides': showGuides}"
      :style="{width: (limits.x * width)+'px', minHeight: (limits.y * height)+'px'}"
    >
      <defs>
        <marker
          id="arrow"
          :markerWidth="arrow.length"
          :markerHeight="arrow.base"
          refX="0"
          :refY="arrow.base/2"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            :d="`M0,0 L0,${arrow.base} L${arrow.length},${arrow.base/2} z`"
            fill="var(--ui-color-primary)"
          />
        </marker>
      </defs>

      <!-- paths -->
      <path
        v-for="(line,i) in lines"
        :key="i"
        :d="line"
        marker-end="url(#arrow)"
        stroke="var(--ui-color-primary)"
        stroke-width="2"
        fill="transparent"
        @click="$emit('click-path', paths[i])"
      />

      <!-- grid guides -->
      <!-- <path
        v-for="col in limits.x+1"
        :key="`col${col}`"
        :d="`M${(col-1) * width} 0 v500`"
        stroke="#80808033"
        fill="transparent"
        class="grid-guide --vertical"
      />
      <path
        v-for="row in limits.y+1"
        :key="`row${row}`"
        :d="`M0 ${(row-1) * height} h${limits.x * width}`"
        stroke="#80808033"
        fill="transparent"
        class="grid-guide --horizontal"
      /> -->

      <!-- intersection points -->
      <!-- <template v-for="col in 20">
        <template v-for="row in 20">
          <circle
            class="really"
            :key="`point-${col}-${row}`"
            :cx="(col-1) * width"
            :cy="(row-1) * height"
            r="20"
            fill="transparent"
          />
        </template>
      </template> -->
    </svg>
  </div>
</template>

<script>
import { UiItem } from '/packages/ui/components'

export default {
  name: 'UiGraphGrid',
  components: { UiItem },

  props: {
    /*
    {
      nodes: [],
      paths: [],
    }
    */
    graph: {
      type: Object,
      required: true,
    },
  },

  emits: ['click-node', 'click-path'],

  data() {
    return {
      width: 100,
      height: 50,

      nodes: [],
      paths: [],

      showGuides: false,

      arrow: {
        base: 4,
        length: 4,
      },
    }
  },

  computed: {
    limits() {
      let retval = {
        x: 0,
        y: 0,
      }

      for (let i = 0; i < this.nodes.length; i++) {
        retval.x = Math.max(retval.x, this.nodes[i].x + 1)
        retval.y = Math.max(retval.y, this.nodes[i].y + 1)
      }
      return retval
    },

    entrances() {
      let retval = {}
      this.paths.forEach((path) => {
        if (typeof retval[path.to] == 'undefined') {
          retval[path.to] = []
        }
        retval[path.to].push(path.from)
      })

      return retval
    },

    exits() {
      let retval = {}
      this.paths.forEach((path) => {
        if (typeof retval[path.from] == 'undefined') {
          retval[path.from] = []
        }
        retval[path.from].push(path.to)
      })

      return retval
    },

    lines() {
      let retval = []
      this.paths.forEach((path) => {
        let nodeFrom = this.nodes.find((n) => n.id == path.from)
        let nodeTo = this.nodes.find((n) => n.id == path.to)

        // let foundPath = this.getPath(nodeFrom, nodeTo);
        let foundPath = this.getPathFromWest(nodeFrom, nodeTo)
        if (!foundPath) {
          console.warn('No se puede dibujar ruta entre', nodeFrom, nodeTo)
          return
        }

        retval.push(this.toLine(foundPath, this.width, this.height))
      })

      return retval
    },
  },

  watch: {
    graph: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.paths = this.sanitizePaths(newValue.paths) // El orden es importante(!) snaitizeNodes necesita que this.paths este sanitizado (!)
        this.nodes = this.sanitizeNodes(newValue.nodes)
      },
    },
  },

  methods: {
    sanitizePaths(paths) {
      if (!paths || !paths.length) {
        return []
      }
      return paths
    },

    sanitizeNodes(nodes) {
      if (!nodes || !nodes.length) {
        return []
      }

      let retval = []
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]

        let x = this.getColumn(node.id)
        let y = this.getRow(node.id)

        // Spread out
        x = x * 2 + 1
        y = y * 2 + 1

        retval.push(Object.assign({}, node, { x, y }))
      }

      return retval
    },

    getColumn(nodeId) {
      let max = 0
      let entrances = this.entrances[nodeId] || []
      entrances.forEach((previousNodeId) => {
        max = Math.max(max, this.getColumn(previousNodeId) + 1)
      })
      return max
    },

    getHeight(nodeId) {
      let exits = this.exits[nodeId] || []

      if (!exits.length) {
        return 1
      }

      let sum = 0
      exits.forEach((exitNodeId) => {
        sum = sum + this.getHeight(exitNodeId)
      })
      return sum
    },

    getRow(nodeId) {
      let entrances = this.entrances[nodeId] || []
      if (!entrances.length) {
        // que pasa si hay otros nodos sin entradas (!!!2do)
        return 0
      }

      let min = Infinity
      entrances.forEach((parentNodeId) => {
        let siblingHeight = 0
        let parentRow = this.getRow(parentNodeId)

        let parentExits = this.exits[parentNodeId] || []

        for (let i = 0; i < parentExits.length; i++) {
          let siblingId = parentExits[i]
          if (siblingId == nodeId) {
            break
          }
          siblingHeight += this.getHeight(siblingId)
        }

        let maybe = parentRow + siblingHeight
        min = Math.min(min, maybe)
      })

      return min
    },

    toLine(path, width = 50, height = 50) {
      let rpath = path.concat([])
      let previous = rpath.shift()
      let retval = `M${previous.x * width} ${previous.y * height}`

      rpath.forEach((point, i) => {
        let dh = point.x - previous.x
        let dv = point.y - previous.y

        let isLast = i == rpath.length - 1

        let offset = this.arrow.length + 4

        if (dh) {
          retval += isLast
            ? ` h${(dh * width) / 2 - (offset * dh) / Math.abs(dh)}`
            : ` h${dh * width}`
        }
        if (dv) {
          retval += isLast
            ? ` v${(dv * height) / 2 - (offset * dv) / Math.abs(dv)}`
            : ` v${dv * height}`
        }

        previous = point
      })
      return retval
    },

    // countCorners(path) {
    //   if (!Array.isArray(path) || path.length < 2) {
    //     return 0;
    //   }

    //   let retval = 0;
    //   for (let i = 2; i < path.length; i++) {
    //     let point = path[i];
    //     let parent = path[i - 1];
    //     let gparent = path[i - 2];

    //     let dir = point.x == parent.x ? 'v' : point.y == parent.y ? 'h' : 'dg';
    //     let dir2 =
    //       parent.x == gparent.x ? 'v' : parent.y == gparent.y ? 'h' : 'dg';

    //     if (dir != dir2) {
    //       retval = retval + 1;
    //     }
    //   }

    //   return retval;
    // },

    isAvailable(coord) {
      let x = coord.x
      let y = coord.y

      if (x < 0 || x > this.limits.x || y < 0 || y > this.limits.y) {
        return false
      }

      let hasNode = this.nodes.find((n) => n.x == x && n.y == y)
      return !hasNode
    },

    getPathFromWest(pointFrom, pointTo) {
      let target = {
        x: pointTo.x - 1,
        y: pointTo.y,
      }

      let path = this.getPath(pointFrom, target)
      path.push(pointTo)
      return path
    },

    getPath(pointFrom, pointTo, visited = []) {
      let from = Object.assign(
        { x: 0, y: 0 },
        { x: parseInt(pointFrom.x), y: parseInt(pointFrom.y) },
      )

      let to = Object.assign(
        { x: 0, y: 0 },
        { x: parseInt(pointTo.x), y: parseInt(pointTo.y) },
      )

      let retval = [from]

      let dh = to.x - from.x
      let dv = to.y - from.y

      if (dv == 0 && dh == 0) {
        return retval
      }

      let top = { x: from.x, y: from.y - 1 }
      let right = { x: from.x + 1, y: from.y }
      let bottom = { x: from.x, y: from.y + 1 }
      let left = { x: from.x - 1, y: from.y }

      let choices
      if (dh == 0) {
        choices = [dv > 0 ? bottom : top, right, left, dv > 0 ? top : bottom]
      }
      if (dv == 0) {
        choices = [dh > 0 ? right : left, bottom, top, dh > 0 ? left : right]
      }
      if (dv < 0 && dh > 0) {
        choices = [right, bottom, top, left] // target is in top-right quadrant
      }
      if (dv < 0 && dh < 0) {
        choices = [left, top, right, bottom] // target is in top-left quadrant
      }
      if (dv > 0 && dh > 0) {
        choices = [bottom, right, top, left] // target is in bottom-right quadrant
      }
      if (dv > 0 && dh < 0) {
        choices = [bottom, left, top, right] // target is in bottom-left quadrant
      }

      // Llegamos al destino ?
      for (let i = 0; i < choices.length; i++) {
        let target = choices[i]
        if (target.x == to.x && target.y == to.y) {
          retval.push(target)
          return retval
        }
      }

      for (let i = 0; i < choices.length; i++) {
        let target = choices[i]

        // Ya pasaste por aqui antes (ciclo?)
        if (visited.findIndex((v) => v.x == target.x && v.y == target.y) >= 0) {
          continue
        }

        // Está ocupado ?
        if (!this.isAvailable(target)) {
          continue
        }

        // Se puede llegar desde el siguiente punto al destino ?
        let foundPath = this.getPath(
          target,
          to,
          visited.concat([from], choices),
        )
        if (foundPath) {
          return retval.concat(foundPath)
        }
      }

      return null
    },
  },
}
</script>

<style lang="scss">
.ui-graph-grid {
  overflow: auto;

  .ui-group {
    display: flex;
  }

  .grid-dom {
    display: flex;
    flex-wrap: nowrap;

    .grid-column {
      position: relative;
    }

    .grid-node {
      // position: absolute;
      // display: flex;
      // justify-content: center;
      // align-items: center;

      border-radius: var(--ui-radius);
      background-color: #fff;
      cursor: pointer;

      &:hover {
        background-color: #fafafa;
      }
    }
  }

  .grid-svg {
    .grid-guide {
      visibility: hidden;
    }

    &.--guides {
      .grid-guide {
        visibility: visible;
      }
    }
  }
}

.really {
  opacity: 0;
  cursor: pointer;
  fill: black;
  transition: all 120ms;

  &:hover {
    opacity: 0.1;
    // r: 20;
  }
}
</style>