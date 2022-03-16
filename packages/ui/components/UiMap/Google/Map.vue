<script setup>
import { onMounted, ref, shallowRef, watch } from 'vue'

const props = defineProps({
  /*
  Google Maps API key
  https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY
  */
  apiKey: {
    type: String,
    required: true,
  },

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
})

const emit = defineEmits(['update:center', 'update:zoom', 'update:markers'])

const mapEl = ref()
const mapObj = shallowRef()
const innerMarkers = shallowRef({}) // innerMarkers[markerID] = { marker: {id, text, icon, position},  gMarker: Google Map Marker Object, _keep }

function emitUpdateMarkers() {
  const markers = Object.values(innerMarkers.value).map((im) => im.marker)
  emit('update:markers', markers)
}

async function loadLibrary() {
  if (window._phi_GoogleMapsLoader) {
    return window._phi_GoogleMapsLoader
  }

  window._phi_GoogleMapsLoader = new Promise((resolve) => {
    window._phi_GoogleMapsInit = () => resolve()

    var scriptTag = document.createElement('script')
    scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&callback=_phi_GoogleMapsInit`
    scriptTag.async = true

    document.head.appendChild(scriptTag)
  })

  return window._phi_GoogleMapsLoader
}

onMounted(async () => {
  await loadLibrary()

  /* Create the Google Map object */
  mapObj.value = new google.maps.Map(mapEl.value, {
    center: props.center,
    zoom: props.zoom,
  })

  /* Sync v-model:center */
  let _halt_center_listen = false

  mapObj.value.addListener('center_changed', () => { // center_changed also fires when setCenter is called
    _halt_center_listen = true
    const center = mapObj.value.getCenter()
    emit('update:center', { lat: center.lat(), lng: center.lng() })
  })
  watch(
    () => props.center,
    () => {
      if (_halt_center_listen) {
        _halt_center_listen = false
        return
      }

      mapObj.value.setCenter({
        lat: parseFloat(props.center.lat),
        lng: parseFloat(props.center.lng),
      })
    },
    { deep: true },
  )

  /* Sync v-model:zoom */
  mapObj.value.addListener('zoom_changed', () => emit('update:zoom', mapObj.value.getZoom()))
  watch(
    () => props.zoom,
    () => mapObj.value.setZoom(parseInt(props.zoom)),
  )

  watch(
    () => props.markers,
    () => {
      Object.values(innerMarkers.value).forEach((marker) => marker._keep = false)

      props.markers.forEach((marker) => {
        if (!innerMarkers.value[marker.id]) {
          innerMarkers.value[marker.id] = {
            id: marker.id,
            marker,
            gMarker: new google.maps.Marker({ map: mapObj.value }),
          }

          innerMarkers.value[marker.id].gMarker.addListener('dragend', (mapDragendEvent) => {
            innerMarkers.value[marker.id].marker.position = {
              lat: mapDragendEvent.latLng.lat(),
              lng: mapDragendEvent.latLng.lng(),
            }
            emitUpdateMarkers()
          })
        }

        innerMarkers.value[marker.id]._keep = true
        innerMarkers.value[marker.id].gMarker.setOptions({
          position: {
            lat: parseFloat(marker.position.lat),
            lng: parseFloat(marker.position.lng),
          },
          title: marker.text,
          draggable: !!marker.draggable,
          icon: marker.icon,
        })
      })

      // Discard markers without _keep
      Object.values(innerMarkers.value).forEach((marker) => {
        if (!marker._keep) {
          marker.gMarker.setMap(null)
          delete innerMarkers.value[marker.id]
        }
      })
    },

    { immediate: true, deep: true },
  )
})
</script>

<template>
  <div
    ref="mapEl"
    class="GoogleMap"
  />
</template>

<style lang="scss">
.GoogleMap {
  height: 100%;
  min-height: 500px;
}
</style>