import GoToChapterEditor from './GoToChapterEditor.vue'

export default {
  name: 'MediaVideo.goToChapter',
  icon: 'mdi:fast-forward',
  title: 'Go to chapter',

  editor: {
    component: GoToChapterEditor,
    props: null,
  },

  /*
  gotoArgs: {
    "ref": ".. name of block 'ref'",
    "chapter": "... chapter name ..."
  }
  */
  callback: function(gotoArgs, _scope = null, _vm = null) {
    if (!_vm?.custom?.story) {
      console.warn('MediaVideo.goToChapter: No \'story\' object found')
      return
    }

    if (!_vm.custom.story.refs?.[gotoArgs?.ref]?.goToChapter) {
      console.warn('MediaVideo.goToChapter: unknown ref')
      return
    }

    const videoRef = _vm.custom.story.refs[gotoArgs.ref]

    videoRef.goToChapter(gotoArgs.chapter)
  },
}