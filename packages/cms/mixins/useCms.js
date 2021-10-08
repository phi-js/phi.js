import Cms from '../singleton/index.js'

export default {
  computed: {
    $cms() {
      return Cms
    },
  },
}