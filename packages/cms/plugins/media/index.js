// import MediaGallery from './components/MediaGallery/MediaGallery.block.js'
// import MediaFile from './components/MediaFile/MediaFile.block.js'
// import MediaMath from './components/MediaMath/MediaMath.block.js'
// import MediaTable from './components/MediaTable/MediaTable.block.js'

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
import MediaPdf from './components/MediaPdf/MediaPdf.block.js'
import MediaVideo from './components/MediaVideo/MediaVideo.block.js'

export default {
  // ORDER MATTERS (block picker shows blocks in this order)
  blocks: [
    {
      title: 'Content',
      children: [
        MediaHtml,
        MediaImage,
        MediaLink,
        MediaFileList,
      ],
    },
    {
      title: 'Layout',
      children: [
        MediaDialog,
      ],
    },
    {
      title: 'Video',
      children: [
        MediaVideo,
      ],
    },
    {
      title: 'Embed',
      children: [
        MediaDocument,
        MediaMap,
        MediaCalendar,
        MediaIframe,
        MediaPdf,
      ],
    },
    {
      title: 'Placeholder',
      children: [
        MediaItem,
        MediaLoremIpsum,
      ],
    },
  ],

}