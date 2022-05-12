<script>
import { inject } from 'vue'
import { VM } from '@/packages/vm'
import blockToVNode from './blockToVNode'

export default {
  props: {
    block: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    modelValue: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },

  emits: ['update:modelValue'],

  setup() {
    const blockVM = new VM()

    const injectedStory = inject('$_cms_story', null)
    if (injectedStory) {
      blockVM.custom = { story: injectedStory }
    }

    return { blockVM }
  },

  render() {
    return blockToVNode(this.block, this.modelValue, this.blockVM)
  },
}
</script>