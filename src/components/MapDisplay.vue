<template>
  <div class="map-wrapper">
    <div class="map-header">
      <h2>PMTiles Viewer</h2>
    </div>
    <div class="map-container" ref="mapContainer"></div>
  </div>
</template>

<script>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorTileLayer from 'ol/layer/VectorTile';
import MVT from 'ol/format/MVT';
import { PMTilesVectorSource } from 'ol-pmtiles';
import { fromLonLat } from 'ol/proj';
import { createVectorTileStyle } from '../styles/styleUtils';
import { stylePresets } from '../styles/mapStyles';

export default {
  name: 'MapDisplay',
  props: {
    pmtilesUrl: {
      type: String,
      required: true
    },
    stylePreset: {
      type: String,
      default: 'default'
    },
    customStyle: {
      type: Object,
      default: null
    }
  },
  emits: ['map-error', 'map-success'],
  
  setup(props, { emit }) {
    const mapContainer = ref(null);
    let map = null;
    let currentLayer = null;
    
    // Initialize map
    const initMap = () => {
      if (map) return;
      
      try {
        loadPmTiles(props.pmtilesUrl);
      } catch (error) {
        emit('map-error', 'Error initializing map: ' + error.message);
      }
    };

    // Load PMTiles function
    const loadPmTiles = (url) => {
      try {
        emit('map-success', 'Loading PMTiles...');
        
        // Get the style to apply
        const style = props.customStyle || stylePresets[props.stylePreset];
        
        // Create new source and layer
        const source = new PMTilesVectorSource({
          url: url,
          format: new MVT()
        });
        
        const newLayer = new VectorTileLayer({
          source: source,
          style: createVectorTileStyle(style)
        });
        
        // If map already exists, update it
        if (map) {
          // Remove previous layer if it exists
          if (currentLayer) {
            map.removeLayer(currentLayer);
          }
          
          // Add new layer
          map.addLayer(newLayer);
          currentLayer = newLayer;
        } 
        // First time map initialization
        else {
          currentLayer = newLayer;
          map = new Map({
            target: mapContainer.value,
            layers: [newLayer],
            view: new View({
              center: fromLonLat([13.404954, 52.520008]), // Berlin coordinates as default
              zoom: 10
            })
          });
        }
        
        emit('map-success', 'PMTiles loaded successfully!');
      } catch (error) {
        console.error('Error loading PMTiles:', error);
        emit('map-error', 'Error loading PMTiles: ' + error.message);
      }
    };
    
    // Update map style
    const updateMapStyle = () => {
      if (!map || !currentLayer) return;
      
      try {
        const style = props.customStyle || stylePresets[props.stylePreset];
        currentLayer.setStyle(createVectorTileStyle(style));
        
        // Force redraw by updating source
        const source = currentLayer.getSource();
        if (source) {
          source.refresh();
        }
        
        emit('map-success', 'Style updated successfully!');
      } catch (error) {
        console.error('Error updating map style:', error);
        emit('map-error', 'Error updating style: ' + error.message);
      }
    };
    
    // Watch for prop changes
    watch(() => props.pmtilesUrl, (newUrl) => {
      if (newUrl) loadPmTiles(newUrl);
    });
    
    // Separate watchers for better reactivity
    watch(() => props.stylePreset, () => {
      updateMapStyle();
    });
    
    watch(() => props.customStyle, () => {
      if (props.customStyle) updateMapStyle();
    }, { deep: true });
    
    // Initialize map on component mount
    onMounted(() => {
      initMap();
    });
    
    // Clean up on component unmount
    onBeforeUnmount(() => {
      if (map) {
        map.setTarget(null);
        map = null;
        currentLayer = null;
      }
    });
    
    return {
      mapContainer
    };
  }
}
</script>

<style scoped>
.map-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.map-header {
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-header h2 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
}

.map-container {
  position: relative;
  flex: 1;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
</style>
