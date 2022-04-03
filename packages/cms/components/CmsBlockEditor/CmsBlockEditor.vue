<script>
import { ref, h, provide, inject, defineAsyncComponent, Teleport } from 'vue'
import { blocks } from '../../singleton/index.js'
import BlockScaffold from './BlockScaffold.vue'

const CmsBlockEditor = {
  inheritAttrs: false,

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

  setup(props, { emit, attrs }) {
    var settings = {}
    if (props.settings) {
      settings = { ...props.settings }
      provide('$_cms_settings', settings)
    } else {
      settings = inject('$_cms_settings', {})
    }

    const blockCSS = ref(props.block?.css?.css)

    return (instance) => {
      const definition = blocks[props.block.component]

      const styleNode = h(
        Teleport,
        { to: 'head' },
        h(
          'style',
          { type: 'text/css', class: 'CmsBlockEditor__style' },
          blockCSS.value,
        ),
      )

      if (definition?.editor?.component) {
        const customEditor = h(definition.editor.component, {
          ...attrs,
          'block': props.block,
          'onUpdate:block': (newValue) => emit('update:block', newValue),
          'onDelete': () => emit('delete'),
        }, instance.$slots)
        return [customEditor, styleNode]
      }

      // No hay editor Y no hay slots.  Usar BlockScaffold
      if (typeof props.block.slot === 'undefined') {
        const scaffoldNode = h(BlockScaffold, {
          ...attrs,
          'class': 'BlockScaffold--default',
          'block': props.block,
          'onUpdate:block': (newValue) => emit('update:block', newValue),
          'onDelete': () => emit('delete'),
        })
        return [scaffoldNode, styleNode]
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

      const faceNode = h(defaultFace, { ...attrs, ...props.block.props }, defaultSlots)
      return [faceNode, styleNode]
    }
  },
}

export default CmsBlockEditor
</script>