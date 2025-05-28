<template>
  <div class="app-container">
    <div class="control-panel">
      <h1>PMTiles Viewer</h1>
      
      <div class="input-group">
        <input 
          type="text" 
          v-model="pmtilesUrl" 
          placeholder="Enter PMTiles URL or drag & drop a file" 
          @keyup.enter="loadPmTilesFromUrl"
        />
        <button @click="loadPmTilesFromUrl" class="btn">Load</button>
      </div>
      
      <div class="buttons-group">
        <button @click="resetToOriginal" class="btn reset-btn">
          Reset to Original
        </button>
      </div>
      
      <div class="status-box" :class="statusType">
        {{ statusMessage }}
      </div>
      
      <div class="drag-drop-area" 
        @dragover.prevent="dragOver" 
        @dragleave.prevent="dragLeave"
        @drop.prevent="handleDrop"
        :class="{ active: isDragging }">
        <div class="drag-drop-text">
          <span v-if="!isDragging">Drag & drop PMTiles file here</span>
          <span v-else>Drop file to load</span>
        </div>
      </div>
      
      <div class="info-box">
        <h3>Current PMTiles:</h3>
        <p>{{ currentPmTiles }}</p>
      </div>
    </div>
    
    <div id="map" class="map" ref="mapContainer"></div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import VectorTileLayer from 'ol/layer/VectorTile'
import MVT from 'ol/format/MVT'
import { PMTilesVectorSource } from 'ol-pmtiles'
import { fromLonLat } from 'ol/proj'

export default {
  setup() {
    // Reactive state
    const mapContainer = ref(null)
    const pmtilesUrl = ref('')
    const isDragging = ref(false)
    const statusMessage = ref('Ready to load PMTiles')
    const statusType = ref('info')
    const currentPmTiles = ref('berlin_area.pmtiles')
    const originalPmTiles = 'berlin_area.pmtiles'
    
    // Store the map instance
    let map = null
    let currentLayer = null

    // Initialize map
    const initMap = () => {
      loadPmTiles(originalPmTiles)
    }

    // Load PMTiles from URL
    const loadPmTilesFromUrl = () => {
      if (!pmtilesUrl.value) {
        setStatus('Please enter a PMTiles URL', 'error')
        return
      }
      
      loadPmTiles(pmtilesUrl.value)
    }

    // Load PMTiles function (reusable)
    const loadPmTiles = (url) => {
      try {
        setStatus('Loading PMTiles...', 'loading')
        
        // Create new source and layer
        const source = new PMTilesVectorSource({
          url: url,
          format: new MVT()
        })
        
        const newLayer = new VectorTileLayer({
          source: source
        })
        
        // If map already exists, update it
        if (map) {
          // Remove previous layer if it exists
          if (currentLayer) {
            map.removeLayer(currentLayer)
          }
          
          // Add new layer
          map.addLayer(newLayer)
          currentLayer = newLayer
          
          // Set view to a reasonable default (no auto-fitting)
        } 
        // First time map initialization
        else {
          currentLayer = newLayer
          map = new Map({
            target: mapContainer.value,
            layers: [newLayer],
            view: new View({
              center: fromLonLat([13.404954, 52.520008]), // Berlin coordinates as default
              zoom: 10
            })
          })
          
          // Keep the default view (no auto-fitting)
        }
        
        // Update current PMTiles info
        currentPmTiles.value = url
        pmtilesUrl.value = '' // Clear input field
        setStatus('PMTiles loaded successfully!', 'success')
      } catch (error) {
        console.error('Error loading PMTiles:', error)
        setStatus('Error loading PMTiles: ' + error.message, 'error')
      }
    }

    // Reset to original
    const resetToOriginal = () => {
      loadPmTiles(originalPmTiles)
    }

    // Drag events
    const dragOver = (event) => {
      isDragging.value = true
    }
    
    const dragLeave = (event) => {
      isDragging.value = false
    }
    
    const handleDrop = (event) => {
      isDragging.value = false
      const files = event.dataTransfer.files
      
      if (files.length) {
        const file = files[0]
        if (file.name.endsWith('.pmtiles')) {
          const url = URL.createObjectURL(file)
          loadPmTiles(url)
        } else {
          setStatus('Please drop a valid .pmtiles file', 'error')
        }
      }
    }
    
    // Status updater
    const setStatus = (message, type = 'info') => {
      statusMessage.value = message
      statusType.value = type
    }

    // Initialize map on component mount
    onMounted(() => {
      initMap()
    })

    return {
      mapContainer,
      pmtilesUrl,
      isDragging,
      statusMessage,
      statusType,
      currentPmTiles,
      loadPmTilesFromUrl,
      resetToOriginal,
      dragOver,
      dragLeave,
      handleDrop
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.control-panel {
  width: 300px;
  height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.control-panel h1 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #343a40;
}

.input-group {
  display: flex;
  margin-bottom: 15px;
}

.input-group input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.btn {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  transition: background-color 0.3s;
}

.buttons-group {
  display: flex;
  margin-bottom: 15px;
}

.reset-btn {
  width: 100%;
  background-color: #6c757d;
  border-radius: 4px;
}

.btn:hover {
  background-color: #0069d9;
}

.reset-btn:hover {
  background-color: #5a6268;
}

.status-box {
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}

.status-box.info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-box.error {
  background-color: #f8d7da;
  color: #721c24;
}

.status-box.success {
  background-color: #d4edda;
  color: #155724;
}

.status-box.loading {
  background-color: #fff3cd;
  color: #856404;
}

.drag-drop-area {
  flex-grow: 1;
  border: 2px dashed #ced4da;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  transition: all 0.3s;
  min-height: 100px;
}

.drag-drop-area.active {
  background-color: rgba(0, 123, 255, 0.1);
  border-color: #007bff;
}

.drag-drop-text {
  text-align: center;
  color: #6c757d;
}

.info-box {
  padding: 10px;
  background-color: #e9ecef;
  border-radius: 4px;
  margin-bottom: 15px;
}

.info-box h3 {
  font-size: 14px;
  margin-bottom: 5px;
  color: #495057;
}

.info-box p {
  font-size: 12px;
  word-break: break-all;
  color: #343a40;
}

.map {
  flex-grow: 1;
  height: 100vh;
}
</style>