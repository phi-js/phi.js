<script>
import { h, defineAsyncComponent, watch, ref } from 'vue'
import BlockScaffold from './BlockScaffold.vue'
import { getBlockDefinition } from '../../functions'

const CmsBlockEditor = {
  inheritAttrs: false,

  props: {
    block: {
      type: [Object, Array],
      required: false,
      default: null,
    },
  },

  emits: ['update:block', 'delete'],

  setup(props, { emit, attrs, expose }) {
    const definition = getBlockDefinition(props.block)

    const innerBlock = ref(props.block)
    watch(
      () => props.block,
      (newBlock) => innerBlock.value = {
        ...newBlock,
        props: {
          ...definition?.block?.props,
          ...newBlock?.props,
        },
      },
    )

    const innerRef = ref()

    expose({
      block: innerBlock,
      onBlockCreated: () => definition?.onCreated?.(innerRef.value),
      openAction: (actionIndex = 0) => innerRef.value.openAction(actionIndex),
    })

    return (instance) => {
      if (definition?.editor?.component) {
        const customEditor = h(
          definition.editor.component,
          {
            'ref': innerRef,
            ...attrs,
            'block': innerBlock.value,
            'onUpdate:block': (newValue) => emit('update:block', newValue),
            'onDelete': () => emit('delete'),
          },
          instance.$slots,
        )
        return customEditor
      }

      // No hay editor Y no hay slots.  Usar BlockScaffold
      if (definition?.editor?.face || typeof props.block.slot === 'undefined') {
        const scaffoldNode = h(
          BlockScaffold,
          {
            'ref': innerRef,
            ...attrs,
            'block': innerBlock.value,
            'onUpdate:block': (newValue) => emit('update:block', newValue),
            'onDelete': () => emit('delete'),
          },
          instance.$slots,
        )
        return scaffoldNode
      }

      // No hay editor.  Usar el componente del bloque
      const defaultFace = typeof definition.block.component === 'function'
        ? defineAsyncComponent(definition.block.component)
        : definition.block.component

      // Si tiene slots, reemplazar cada hijo del slot por un CmsBlockEditor
      const defaultSlots = typeof props.block.slot !== 'undefined'
        ? () => props.block.slot
          .map((slotItem, slotIndex) => h(CmsBlockEditor, {
            'block': slotItem,
            'onUpdate:block': (newValue) => {
              const slotCopy = props.block.slot
              slotCopy[slotIndex] = newValue
              emit('update:block', { ...props.block, slot: slotCopy })
            },
            'onDelete': () => {
              const slotCopy = props.block.slot
              slotCopy.splice(slotIndex, 1)
              emit('update:block', { ...props.block, slot: slotCopy })
            },
          }))
        : undefined

      const faceNode = h(
        defaultFace,
        {
          ref: innerRef,
          ...attrs,
          ...props.block.props,
          class: ['CmsBlock', props.block.props?.class],
        },
        defaultSlots,
      )
      return faceNode
    }
  },
}

export default CmsBlockEditor
</script>