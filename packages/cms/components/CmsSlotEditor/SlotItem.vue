<!-- eslint-disable max-len -->
<script>
import { h, ref, watch, inject, provide, computed } from 'vue'
import { useI18n } from '@/packages/i18n'

import { getBlockDefinition } from '../../functions'
import EditorAction from '../CmsBlockEditor/EditorAction.vue'
import BlockScaffold from '../BlockScaffold/BlockScaffold.vue'

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

  emits: ['update:block', 'delete', 'select', 'deselect', 'insert-sibling'],

  setup(props, { emit }) {
    const definition = getBlockDefinition(props.block)

    const innerBlock = ref()
    watch(
      () => props.block,
      (newValue) => {
        innerBlock.value = {
          ...newValue,
          props: {
            ...definition?.block?.props,
            ...newValue?.props,
          },
        }
      },
      { immediate: true },
    )

    function deleteBlock() {
      emit('delete')
    }

    function selectBlock(evt) {
      emit('select', evt)
    }

    const openBlockWindow = inject('$_cms_openBlockWindow')
    function openEditor(actionId = null) {
      openBlockWindow({
        innerBlock,
        updateBlock: (newValue) => emit('update:block', newValue),
      }, actionId)
    }

    function insertSibling(position = null) {
      emit('insert-sibling', position)
    }


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


    provide('_cms_SlotItem', {
      parent: inject('_cms_SlotItem', null),
      innerBlock,
      definition,
      selectBlock,
    })

    const innerRef = ref()

    const i18n = useI18n()

    return {
      innerBlock,
      definition,
      transitionClassNames,
      deleteBlock,
      openEditor,
      selectBlock,
      insertSibling,
      innerRef,
      i18n,
    }
  },

  render() {
    if (!this.definition) {
      return h(
        BlockScaffold,
        {
          block: this.innerBlock,
          selected: this.selected,
          onSelect: this.selectBlock,
          onDelete: this.deleteBlock,
        },
        {
          default: () => h(
            'div',
            `Uknkown block '${this.innerBlock.component}'`,
          ),
        },
      )
    }

    if (this.definition?.editor?.component) {
      return h(
        this.definition.editor.component,
        {
          'ref': 'innerRef',
          'block': this.innerBlock,
          'onUpdate:block': (evt) => this.$emit('update:block', evt),

          'selected': this.selected,
          'onSelect': this.selectBlock,
          'onDelete': this.deleteBlock,

          'onOpenEditor': this.openEditor,
          'onInsertSibling': this.insertSibling,

          'class': this.transitionClassNames,

          // prevent clicks from bubbling up to parent BlockScaffold (if there is one)
          'onClick': (evt) => evt.stopPropagation(),
        },
      )
    }

    return h(
      BlockScaffold,
      {
        ref: 'innerRef',
        block: this.innerBlock,
        class: this.transitionClassNames,
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

              'class': ['CmsBlock', this.innerBlock.props?.class],
              'style': this.innerBlock.props?.style,
            },
          )
          : () => h( // Use block component as editor face
            this.definition.block.component,
            this.i18n.obj({
              ...this.innerBlock.props,
              class: ['CmsBlock', this.innerBlock.props?.class],
              style: 'pointer-events:none',
            }),
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