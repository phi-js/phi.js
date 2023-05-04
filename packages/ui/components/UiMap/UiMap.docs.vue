<script setup>
const settings = {
  provider: 'google',
  apiKey: 'AIzaSyCpSKazmH7T7ArBkdcPiRYaYG_QKhj7rRM',
}

import UiMap from './UiMap.vue'

</script>

<template>
  <div class="Docs">
    <h1>UiMap</h1>
    <code>import { UiMap } from '@/packages/ui'</code>
    <p>This is a component that displays a map using Google Maps API.</p>

    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Description</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>center</td>
          <td>The center of the map.</td>
          <td>Object</td>
          <td>No</td>
          <td>{ lat: -34.397, lng: 150.644 }</td>
        </tr>
        <tr>
          <td>zoom</td>
          <td>The zoom level of the map.</td>
          <td>String or Number</td>
          <td>No</td>
          <td>8</td>
        </tr>
        <tr>
          <td>markers</td>
          <td>An array of markers that will be displayed on the map.</td>
          <td>Array</td>
          <td>No</td>
          <td>[]</td>
        </tr>
        <tr>
          <td>settings</td>
          <td>An object containing settings for the map.</td>
          <td>Object</td>
          <td>No</td>
          <td>{ provider: 'google', apiKey: null }</td>
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
          <td>update:center</td>
          <td>Emitted when the center of the map is updated.</td>
        </tr>
        <tr>
          <td>update:markers</td>
          <td>Emitted when the markers on the map are updated.</td>
        </tr>
        <tr>
          <td>update:zoom</td>
          <td>Emitted when the zoom level of the map is updated.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <pre><code>&lt;UiMap :settings="settings" :center="{ lat: 37.7749, lng: -122.4194 }" :zoom="12" :markers="[{ id: '1', text: 'Marker 1', subtext: 'This is marker 1', icon: '', position: { lat: 37.7749, lng: -122.4194 }, draggable: true }]" /&gt;</code></pre>

    <UiMap
      :settings="settings"
      :center="{ lat: 37.7749, lng: -122.4194 }"
      :zoom="12"
      :markers="[{ id: '1', text: 'Marker 1', subtext: 'This is marker 1', icon: '', position: { lat: 37.7749, lng: -122.4194 }, draggable: true }]"
    />
  </div>
</template>