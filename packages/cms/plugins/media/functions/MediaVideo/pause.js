import BlockRefPicker from './BlockRefPicker.vue'

export default {
  name: 'MediaVideo.pause',
  icon: 'mdi:pause',
  title: 'pause',

  editor: {
    component: BlockRefPicker,
    props: null,
  },

  /*
  pauseArgs: {
    "ref": ".. name of block 'ref'"
  }
  */
  callback: function(pauseArgs, _scope = null, _vm = null) {
    if (!_vm?.custom?.story) {
      console.warn('MediaVideo.pause: No \'story\' object found')
      return
    }

    if (!_vm.custom.story.refs?.[pauseArgs?.ref]?.pause) {
      console.warn('MediaVideo.pause: unknown ref')
      return
    }

    _vm.custom.story.refs[pauseArgs.ref].pause()
  },
}