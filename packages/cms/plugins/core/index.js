import assign from './actions/assign.js'
import console from './actions/console.js'
// import http from './actions/http.js'
import goto from './actions/goto.js'

import CmsDialog from './blocks/CmsDialog.js'

export default {
  actions: {
    assign,
    console,
    // http,
    goto,
  },

  blocks: { CmsDialog },
}