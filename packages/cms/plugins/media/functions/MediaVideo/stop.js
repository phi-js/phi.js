import BlockRefPicker from './BlockRefPicker.vue'

export default {
  name: 'MediaVideo.stop',
  icon: 'mdi:stop',
  title: 'stop',

  editor: {
    component: BlockRefPicker,
    props: null,
  },

  /*
  stopArgs: {
    "ref": ".. name of block 'ref'"
  }
  */
  callback: function(stopArgs, _scope = null, _vm = null) {
    if (!_vm?.custom?.story) {
      console.warn('MediaVideo.stop: No \'story\' object found')
      return
    }

    if (!_vm.custom.story.refs?.[stopArgs?.ref]?.stop) {
      console.warn('MediaVideo.stop: unknown ref')
      return
    }

    _vm.custom.story.refs[stopArgs.ref].stop()
  },
}