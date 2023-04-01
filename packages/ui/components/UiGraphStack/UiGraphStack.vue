<script setup>
import { computed } from 'vue'
import draggable from 'vuedraggable'
import UiItem from '../UiItem/UiItem.vue'

const props = defineProps({
  /*
    {
      nodes: [
        { id: 1, text: 'inicio' },
        ...
      ],
      paths: [
        { from: 1, to: 2 },
        ...
      ],
    }
    */
  graph: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:graph', 'click-node'])

const nodeHeight = 47

function getCoordinates(nodeId) {
  const blockHeight = nodeHeight + 22 // node height + GAP
  const foundIndex = props.graph.nodes.findIndex((n) => n.id == nodeId)

  return {
    top: foundIndex * blockHeight,
    bottom: foundIndex * blockHeight + blockHeight - 22,
  }
}

const pathItems = computed(() => {
  return props.graph.paths.map((path, index) => {

    const coordsFrom = getCoordinates(path.from)
    const coordsTo = getCoordinates(path.to)

    let direction, start, end
    if (coordsFrom.top < coordsTo.top) {
      direction = 'fw'
      start = coordsFrom
      end = coordsTo
    } else {
      direction = 'bw'
      start = coordsTo
      end = coordsFrom
    }


    const length = Math.floor((end.top - start.top) / (nodeHeight + 18))
    const offset = (length - 1) * 5
    const top = start.bottom - offset
    const height = end.top - start.bottom + offset * 2

    const style = {
      'top': `${top}px`,
      'height': `${height}px`,
      '--path-width': `${(length - 1) * 6 + index * 3}px`,
    }

    const classNames = [
      'UiGraphStack__path',
      `UiGraphStack__path--${direction}`,
      length == 1 ? 'UiGraphStack__path--short' : '',
      path.class,
    ]

    return {
      length,
      ...path,
      id: `${path.from}_${path.to}`,
      style,
      class: classNames,
    }
  })
})
</script>

<template>
  <div class="UiGraphStack">
    <draggable
      :model-value="graph.nodes"
      class="UiGraphStack__list"
      group="UiGraphStack"
      handle=".UiItem__icon"
      item-key="id"
      :animation="111"
      :empty-insert-threshold="0"
      :swap-threshold="0.5"
      :inverted-swap-threshold="1"
      @update:model-value="emit('update:graph', {...graph, nodes:$event})"
    >
      <template #item="{ element }">
        <UiItem
          class="UiGraphStack__listItem"
          :class="[element.class, {'UiGraphStack__listItem--selected': false}]"
          icon="mdi:drag-vertical"
          :text="element.text || element.id"
          @click-body="emit('click-node', element)"
          @click-actions="emit('click-node', element)"
        >
          <template #actions>
            <slot
              name="node-actions"
              :node="element"
            />
          </template>
        </UiItem>
      </template>
    </draggable>

    <div
      v-for="path in pathItems"
      :key="path.id"
      :class="path.class"
      :style="path.style"
    />
  </div>
</template>

<style lang="scss">
.UiGraphStack {
  position: relative;
  margin: 0 30px;
  padding: 0 30px;

  &__list {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  &__path {
    --path-width: 20px;

    opacity: 0.4;

    position: absolute;
    border: 2px solid var(--ui-color-primary);
    width: var(--path-width);

    &::after {
      display: block;
      position: absolute;

      width: 12px;
      height: 12px;
      line-height: 12px;
      font-size: 12px;
    }

    &--short {
      width: 0;

      &.UiGraphStack__path--fw {
        left: auto;
        right: 36%;

        &::after {
          content: '▼';
          left: -5px;
          bottom: -5px;
        }
      }

      &.UiGraphStack__path--bw {
        left: 36%;
        right: auto;

        &::after {
          content: '▲';
          left: -7px;
          top: -5px;
        }
      }
    }

    &--fw {
      right: calc(30px - var(--path-width));
      border-left: 0;
      &::after {
        content: '◀';
        bottom: -7px;
        left: -4px;
      }
    }

    &--bw {
      left: calc(30px - var(--path-width));
      border-right: 0;
      &::after {
        content: '▶';
        top: -7px;
        right: -4px;
      }
    }
  }
}
</style>