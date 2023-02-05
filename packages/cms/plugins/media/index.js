// import MediaFile from './components/MediaFile/MediaFile.block.js'
// import MediaMath from './components/MediaMath/MediaMath.block.js'
import i18n from './i18n'

import MediaCalendar from './components/MediaCalendar/MediaCalendar.block.js'
import MediaDialog from './components/MediaDialog/MediaDialog.block.js'
import MediaDocument from './components/MediaDocument/MediaDocument.block.js'
import MediaFileList from './components/MediaFileList/MediaFileList.block.js'
import MediaGallery from './components/MediaGallery/MediaGallery.block.js'
import MediaHtml from './components/MediaHtml/MediaHtml.block.js'
import MediaIframe from './components/MediaIframe/MediaIframe.block.js'
import MediaImage from './components/MediaImage/MediaImage.block.js'
import MediaItem from './components/MediaItem/MediaItem.block.js'
import MediaLink from './components/MediaLink/MediaLink.block.js'
import MediaLoremIpsum from './components/MediaLoremIpsum/MediaLoremIpsum.block.js'
import MediaMap from './components/MediaMap/MediaMap.block.js'
import MediaPdf from './components/MediaPdf/MediaPdf.block.js'
import MediaVideo from './components/MediaVideo/MediaVideo.block.js'
import MediaVideoContainer from './components/MediaVideo/MediaVideoContainer.block.js'

import fnPlay from './functions/MediaVideo/play.js'
import fnPause from './functions/MediaVideo/pause.js'
import fnStop from './functions/MediaVideo/stop.js'
import fnGoToChapter from './functions/MediaVideo/goToChapter.js'

export default {
  i18n,

  functions: [
    {
      title: 'Video',
      children: [
        fnPlay,
        fnPause,
        fnStop,
        fnGoToChapter,
      ],
    },
  ],

  // ORDER MATTERS (block picker shows blocks in this order)
  blocks: [
    {
      title: 'Content',
      children: [
        MediaHtml,
        MediaImage,
        MediaLink,
        MediaFileList,
        MediaGallery,
        MediaItem,
        MediaLoremIpsum,
      ],
    },
    {
      title: 'Navigation', // so that the Navigation tab is kept in this position (afer content)
      children: [],
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
        MediaVideoContainer,
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
  ],
}