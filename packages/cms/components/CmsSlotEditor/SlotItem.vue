<!-- eslint-disable max-len -->
<script>
import { h, ref, watch, inject, provide, computed } from 'vue'

import { getBlockDefinition } from '../../functions'
import EditorAction from '../CmsBlockEditor/EditorAction.vue'
import Bloh from './Bloh.vue'

export default {
  props: {
    block: {
      type: Object,
      required: true,
    },

    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  emits: ['update:block', 'delete', 'select', 'deselect', 'open-editor', 'insert-sibling'],

  setup(props, { emit }) {
    const innerBlock = ref()
    watch(
      () => props.block,
      (newValue) => innerBlock.value = { ...newValue },
      { immediate: true },
    )

    const definition = getBlockDefinition(props.block)

    function deleteBlock() {
      emit('delete')
    }

    function selectBlock(evt) {
      emit('select', evt)
    }

    function openEditor(actionId = null) {
      emit('open-editor', actionId)
    }

    function insertSibling(position = null) {
      emit('insert-sibling', position)
    }


    /* Block transition classnames */
    const transitionClassNames = computed(() => {
      const blockTransitions = props.block?.transitions || {}
      const objTransitions = {
        'navigation-forward-enter': blockTransitions['navigation-forward-enter'] || blockTransitions['navigation-enter'],
        'navigation-forward-leave': blockTransitions['navigation-forward-leave'] || blockTransitions['navigation-leave'],
        'navigation-back-enter': blockTransitions['navigation-back-enter'] || blockTransitions['navigation-enter'],
        'navigation-back-leave': blockTransitions['navigation-back-leave'] || blockTransitions['navigation-leave'],
        'show': blockTransitions.show,
        'hide': blockTransitions.hide,
      }

      const retval = []
      for (const [key, value] of Object.entries(objTransitions)) {
        if (value) {
          retval.push(`_phi_transition_${key}_${value}`)
        }
      }
      return retval
    })


    const SlotItemInstance = {
      parent: inject('_cms_SlotItem', null),
      isSlotItem: true,
      innerBlock,
      definition,
      deleteBlock,
      updateBlock: (newValue) => emit('update:block', newValue),
      openEditor,
      selectBlock,
      insertSibling,

      transitionClassNames,
    }
    provide('_cms_SlotItem', SlotItemInstance)

    return SlotItemInstance
  },

  render() {
    if (!this.definition) {
      return
    }

    if (this.definition?.editor?.component) {
      // if the custom editor is not wrapped in a DIV,
      // the drag/drop attributes/listeners (incoming $attrs) don't work properly
      return h(
        'div',
        h(
          this.definition.editor.component,
          {
            'block': this.innerBlock,
            'onUpdate:block': (evt) => this.$emit('update:block', evt),

            'selected': this.selected,
            'onSelect': this.selectBlock,
            'onDelete': this.deleteBlock,

            'onOpenEditor': this.openEditor,
            'onInsertSibling': this.insertSibling,

            // prevent clicks from bubbling up to parent Bloh (if there is one)
            // so that select is not triggered (line 94)
            'onClick': (evt) => {
              evt.stopPropagation()
            },

            'class': this.transitionClassNames,
          },
        ),
      )
    }

    return h(
      Bloh,
      {
        block: this.innerBlock,
        class: [this.innerBlock?.props?.class, ...this.transitionClassNames],
        style: this.innerBlock?.props?.style,
        selected: this.selected,
        onSelect: this.selectBlock,
        onDelete: this.deleteBlock,
        onOpenEditor: this.openEditor,
        onInsertSibling: this.insertSibling,
      },
      {
        default: this.definition?.editor?.face
          ? () => h(
            EditorAction,
            {
              'action': this.definition.editor.face,
              'block': this.innerBlock,
              'onUpdate:block': (evt) => this.$emit('update:block', evt),
            },
          )
          : () => h(
            this.definition.block.component,
            this.innerBlock.props,
          ),

        toolbar: this.definition?.editor?.toolbar
          ? () => h(
            EditorAction,
            {
              'action': this.definition.editor.toolbar,
              'block': this.innerBlock,
              'onUpdate:block': (evt) => this.$emit('update:block', evt),
            },
          )
          : null,
      },
    )
  },
}
</script>