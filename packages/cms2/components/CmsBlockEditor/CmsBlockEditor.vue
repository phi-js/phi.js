<script>
import { h, provide, inject, defineAsyncComponent } from 'vue'
import { blocks } from '../../singleton/index.js'
import BlockScaffold from './BlockScaffold.vue'

const CmsBlockEditor = {
  props: {
    block: {
      type: [Object, Array],
      required: false,
      default: null,
    },

    settings: {
      type: Object,
      required: false,
      default: null,
    },
  },

  emits: ['update:block', 'delete'],

  setup(props, { emit }) {
    var settings = {}
    if (props.settings) {
      settings = { ...props.settings }
      provide('$_cms_settings', settings)
    } else {
      settings = inject('$_cms_settings')
    }

    return () => {
      const definition = blocks[props.block.component]

      if (definition?.editor?.component) {
        return h(definition.editor.component, {
          'block': props.block,
          'onUpdate:block': (newValue) => emit('update:block', newValue),
          'onDelete': () => emit('delete'),
        })
      }

      // No hay editor Y no hay slots.  Usar BlockScaffold
      if (typeof props.block.slot === 'undefined') {
        return h(BlockScaffold, {
          'block': props.block,
          'onUpdate:block': (newValue) => emit('update:block', newValue),
          'onDelete': () => emit('delete'),
        })
      }

      // No hay editor.  Usar el componente del bloque
      const defaultFace = typeof definition.block.component === 'function'
        ? defineAsyncComponent(definition.block.component)
        : definition.block.component

      // Si tiene slots, reemplazar cada hijo del slot por un CmsBlockEditor
      const defaultSlots = typeof props.block.slot !== 'undefined'
        ? () => props.block.slot.map((slotItem, slotIndex) => h(CmsBlockEditor, {
          'block': slotItem,
          'settings': props.settings,
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

      return h(defaultFace, { ...props.block.props }, defaultSlots)
    }
  },
}

export default CmsBlockEditor
</script>