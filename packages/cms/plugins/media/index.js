// import MediaGallery from './components/MediaGallery/MediaGallery.block.js'
// import MediaFile from './components/MediaFile/MediaFile.block.js'
import MediaCalendar from './components/MediaCalendar/MediaCalendar.block.js'
import MediaDialog from './components/MediaDialog/MediaDialog.block.js'
import MediaDocument from './components/MediaDocument/MediaDocument.block.js'
import MediaFileList from './components/MediaFileList/MediaFileList.block.js'
import MediaHtml from './components/MediaHtml/MediaHtml.block.js'
import MediaIframe from './components/MediaIframe/MediaIframe.block.js'
import MediaImage from './components/MediaImage/MediaImage.block.js'
import MediaItem from './components/MediaItem/MediaItem.block.js'
import MediaLink from './components/MediaLink/MediaLink.block.js'
import MediaLoremIpsum from './components/MediaLoremIpsum/MediaLoremIpsum.block.js'
import MediaMap from './components/MediaMap/MediaMap.block.js'
// import MediaMath from './components/MediaMath/MediaMath.block.js'
// import MediaTable from './components/MediaTable/MediaTable.block.js'
import MediaVideo from './components/MediaVideo/MediaVideo.block.js'
import MediaPdf from './components/MediaPdf/MediaPdf.block.js'

export default {
  // ORDER MATTERS (block picker shows blocks in this order)
  blocks: {
    MediaHtml,
    MediaImage,
    MediaLink,
    MediaFileList,
    MediaVideo,
    MediaDocument,
    // MediaTable,
    MediaItem,
    MediaMap,
    MediaDialog,
    MediaCalendar,
    MediaIframe,
    // MediaMath,
    MediaLoremIpsum,
    // MediaGallery,
    // MediaFile,
    MediaPdf,
  },

  actions: {},
}