import BlockRefPicker from './BlockRefPicker.vue'

export default {
  name: 'MediaVideo.play',
  icon: 'mdi:play',
  title: 'Play',

  editor: {
    component: BlockRefPicker,
    props: null,
  },

  /*
  playArgs: {
    "ref": ".. name of block 'ref'"
  }
  */
  callback: function(playArgs, _scope = null, _vm = null) {
    if (!_vm?.custom?.story) {
      console.warn('MediaVideo.play: No \'story\' object found')
      return
    }

    if (!_vm.custom.story.refs?.[playArgs?.ref]?.play) {
      console.warn('MediaVideo.play: unknown ref')
      return
    }

    _vm.custom.story.refs[playArgs.ref].play()
  },
}