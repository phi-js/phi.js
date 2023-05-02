<!-- eslint-disable max-len -->
<script setup>
import { ref } from 'vue'
import UiFileList from './UiFileList.vue'
import { UiUpload } from '../UiUpload'

// const files = ref([])
const files = ref([
  {
    id: 'odzvc02sfxz',
    path: '/cms/pages/test',
    name: 'Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    size: '29050',
    mimetype: 'image/jpeg',
    timestamp: '1615566175',
    url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    preview: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg.preview.jpg',
    thumbnail: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg.thumbnail.jpg',
  },
  {
    id: 'oe0z03mcq1f',
    path: '/cms/pages/test',
    name: 'ciudad-de-sofia-antiguo-imperio-otomano.jpg',
    size: '91704',
    mimetype: 'image/jpeg',
    timestamp: '1615572838',
    url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/ciudad-de-sofia-antiguo-imperio-otomano.jpg',
    preview: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/ciudad-de-sofia-antiguo-imperio-otomano.jpg.preview.jpg',
    thumbnail: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/ciudad-de-sofia-antiguo-imperio-otomano.jpg.thumbnail.jpg',
  },
  {
    id: 'otvq0lf633s',
    path: '/cms/pages/test',
    name: 'de4s4m4-55703bed-438a-4993-9eb3-a14a3f547a69.jpg',
    size: '1050479',
    mimetype: 'image/jpeg',
    timestamp: '1619023947',
    url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/de4s4m4-55703bed-438a-4993-9eb3-a14a3f547a69.jpg',
    preview: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/de4s4m4-55703bed-438a-4993-9eb3-a14a3f547a69.jpg.preview.jpg',
    thumbnail: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/de4s4m4-55703bed-438a-4993-9eb3-a14a3f547a69.jpg.thumbnail.jpg',
  },
])

const testUrl = ref('http://v4.local/1/cms/pages/test/files')
</script>

<template>
  <div class="Docs">
    <h1>UiFileList</h1>
    <code>import { UiFileList } from '@/packages/ui'</code>
    <p>
      The UiFileList component displays a list of files. It can be displayed as a list, grid or gallery. Each file is represented with an UiItem component that displays the file name, description and thumbnail. If a file doesn't have a thumbnail, it will display an icon based on its mimetype.
    </p>

    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Description</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default Value</th>
          <th>Accepted Values</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>files</td>
          <td>An array of file objects to be displayed in the list.</td>
          <td>Array</td>
          <td>No</td>
          <td>[]</td>
          <td>-</td>
        </tr>
        <tr>
          <td>view</td>
          <td>The display mode of the file list. Can be set to list, grid or gallery.</td>
          <td>String</td>
          <td>No</td>
          <td>'list'</td>
          <td>'list', 'grid', 'gallery'</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>-</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
          <th>Slot bindings</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>-</td>
          <td>The default slot to be used for the UiItem component.</td>
          <td>
            <ul>
              <li><strong>text</strong>: The text to be displayed in the UiItem component. Can be the file title or name.</li>
              <li><strong>subtext</strong>: The subtext to be displayed in the UiItem component. Can be the file description.</li>
              <li><strong>icon</strong>: The icon to be displayed in the UiItem component. Can be the file thumbnail or a mimetype icon.</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Displaying a list of files</h3>
    <pre><code>
&lt;UiFileList :files="[
  {
    id: 'odzvc02sfxz',
    path: '/cms/pages/test',
    name: 'Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    size: '29050',
    mimetype: 'image/jpeg',
    timestamp: '1615566175',
    url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    preview: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg.preview.jpg',
    thumbnail: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg.thumbnail.jpg',
    title: 'Cheesecake Recipe',
    description: 'The best cheesecake recipe you will ever try.',
  },
  {
    id: 'of3qz7jop5a',
    path: '/cms/pages/test',
    name: 'Document.pdf',
    size: '1024',
    mimetype: 'application/pdf',
    timestamp: '1615566175',
    url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Document.pdf',
    preview: null,
    thumbnail: null,
    title: 'Document',
    description: 'A sample document.',
  },
  {
    id: 'ojvqz4jop3c',
    path: '/cms/pages/test',
    name: 'Video.mp4',
    size: '2048',
    mimetype: 'video/mp4',
    timestamp: '1615566175',
    url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Video.mp4',
    preview: null,
    thumbnail: null,
    title: 'Video',
    description: 'A sample video.',
  }
]" /&gt;
</code></pre>
    <div class="UiFileList UiFileList--list">
      <a
        href="https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg"
        target="_blank"
        class="UiFileList__link"
      >
        <div class="UiItem">
          <div class="UiItem__icon">
            <img
              src="https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg.thumbnail.jpg"
              alt="Cheesecake Recipe thumbnail"
            >
          </div>
          <div class="UiItem__content">
            <div class="UiItem__text">Cheesecake Recipe</div>
            <div class="UiItem__subtext">The best cheesecake recipe you will ever try.</div>
          </div>
        </div>
      </a>
      <a
        href="https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Document.pdf"
        target="_blank"
        class="UiFileList__link"
      >
        <div class="UiItem">
          <div class="UiItem__icon">
            <i class="fa fa-file-pdf-o" />
          </div>
          <div class="UiItem__content">
            <div class="UiItem__text">Document.pdf</div>
            <div class="UiItem__subtext">A sample document.</div>
          </div>
        </div>
      </a>
      <a
        href="https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Video.mp4"
        target="_blank"
        class="UiFileList__link"
      >
        <div class="UiItem">
          <div class="UiItem__icon">
            <i class="fa fa-file-video-o" />
          </div>
          <div class="UiItem__content">
            <div class="UiItem__text">Video.mp4</div>
            <div class="UiItem__subtext">A sample video.</div>
          </div>
        </div>
      </a>
    </div>

    <h3>Displaying a grid of files</h3>
    <pre><code>
&lt;UiFileList
  :files="[
    {
      id: 'odzvc02sfxz',
      path: '/cms/pages/test',
      name: 'Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
      size: '29050',
      mimetype: 'image/jpeg',
      timestamp: '1615566175',
      url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
      preview: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg.preview.jpg',
      thumbnail: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg.thumbnail.jpg',
      title: 'Cheesecake Recipe',
      description: 'The best cheesecake recipe you will ever try.',
    },
    {
      id: 'of3qz7jop5a',
      path: '/cms/pages/test',
      name: 'Document.pdf',
      size: '1024',
      mimetype: 'application/pdf',
      timestamp: '1615566175',
      url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Document.pdf',
      preview: null,
      thumbnail: null,
      title: 'Document',
      description: 'A sample document.',
    },
    {
      id: 'ojvqz4jop3c',
      path: '/cms/pages/test',
      name: 'Video.mp4',
      size: '2048',
      mimetype: 'video/mp4',
      timestamp: '1615566175',
      url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Video.mp4',
      preview: null,
      thumbnail: null,
      title: 'Video',
      description: 'A sample video.',
    }
  ]"
  view="grid"
/>
</code></pre>

    <!-- Human made -->
    <h1>UiFileList</h1>
    <UiFileList :files="files" />
    <hr>
    <UiFileList
      :files="files"
      view="gallery"
    />
    <hr>
    <UiUpload
      v-model="files"
      :endpoint="testUrl"
      inline
      multiple
    />
    <hr>
    <pre>files: {{ files }}</pre>
  </div>
</template>