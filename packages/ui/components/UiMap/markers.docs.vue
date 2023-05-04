<script setup>
import { ref } from 'vue'
import UiMap from './UiMap.vue'
import { UiItem } from '../UiItem'
import { UiInput } from '../UiInput'

// const center = ref({ lat: -34.397, lng: 150.644 })
const center = ref({ lat: 40.4144424, lng: -3.711398 })
const zoom = ref(16)
const markers = ref([
  {
    id: 'm1',
    text: 'Marker 1',
    subtext: 'Subtext 1',
    icon: null,

    position: {
      lat: 40.4144424,
      lng: -3.711398,
    },
  },
  {
    id: 'm2',
    text: 'Marker 2',
    subtext: 'Subtext 2',
    // icon: 'https://image.shutterstock.com/image-vector/car-icon-vector-symbol-on-260nw-1721339608.jpg',
    icon: null,

    position: {
      lat: 40.4152056,
      lng: -3.7080868,
    },

    draggable: true,
  },
])

const settings = ref({
  provider: 'google',
  apiKey: 'AIzaSyCpSKazmH7T7ArBkdcPiRYaYG_QKhj7rRM',
})
</script>

<template>
  <div class="UiMapDocs">
    <UiMap
      v-model:center="center"
      v-model:zoom="zoom"
      v-model:markers="markers"
      :settings="settings"
    />

    <fieldset>
      <legend>v-models</legend>

      <ul>
        <li
          v-for="(marker, index) in markers"
          :key="marker.id"
        >
          <UiItem
            :text="marker.text"
            :subtext="`${marker.position.lat}, ${marker.position.lng}`"
            icon="mdi:map-marker"
          >
            <input
              v-model="marker.position.lat"
              type="text"
            >
            <input
              v-model="marker.position.lng"
              type="text"
            >

            <template #actions>
              <button
                type="button"
                @click="markers.splice(index, 1)"
              >
                &times;
              </button>
            </template>
          </UiItem>
        </li>

        <li>
          <UiItem
            class="ui--clickable"
            text="Add marker"
            icon="mdi:map-marker-plus"
            @click="markers.push({
              id: `m${markers.length+1}`,
              text: `Marker ${markers.length+1}`,
              icon: null,
              position: center,
              draggable: true,
            })"
          />
        </li>
      </ul>

      <UiInput label="center">
        <input
          v-model="center.lat"
          type="text"
        >
        <input
          v-model="center.lng"
          type="text"
        >
      </UiInput>


      <UiInput
        v-model="zoom"
        label="zoom"
        type="number"
        min="0"
        max="25"
      />
    </fieldset>
  </div>
</template>