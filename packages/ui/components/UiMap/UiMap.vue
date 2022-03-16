<script setup>
import GoogleMap from './Google/Map.vue'

const props = defineProps({
  /*
  CENTER object
  {
    lat: ...,
    lng: ...
  }
  */
  center: {
    type: Object,
    required: false,
    default: () => ({ lat: -34.397, lng: 150.644 }),
  },

  /*
  ZOOM level: 0-20
  */
  zoom: {
    type: [String, Number],
    required: false,
    default: 8,
  },

  /*
  ARRAY of MARKER objects:
  [
    {
      id: 'x1',
      text: '',
      subtext: '',
      icon: '',

      position: {
        lat: x,
        lng: x,
      },

      draggable: true | false
    },
    ...
  ]
  */
  markers: {
    type: Array,
    required: false,
    default: () => [],
  },

  /*
  Settings OBJECT
  */
  settings: {
    type: Object,
    required: false,
    default: () => ({
      provider: 'google',
      apiKey: null,
    }),
  },
})

const emit = defineEmits(['update:center', 'update:markers', 'update:zoom'])
</script>

<template>
  <GoogleMap
    class="UiMap"
    :api-key="props.settings.apiKey"
    :center="props.center"
    :markers="props.markers"
    :zoom="props.zoom"
    @update:center="emit('update:center', $event)"
    @update:markers="emit('update:markers', $event)"
    @update:zoom="emit('update:zoom', $event)"
  />
</template>