<template>
  <div class="app-container" :data-mobile-panel="activeMobilePanel">
    <!-- Left sidebar for controls -->
    <ControlPanel
      :originalPmTiles="originalPmTiles"
      :currentPmTiles="currentPmTiles"
      :statusMessage="statusMessage"
      :statusType="statusType"
      @load-pmtiles="loadPmTiles"
      @set-status="setStatus"
      @reset-to-original="resetToOriginal"
    />
    
    <!-- Main content area -->
    <div class="main-content">
      <MapDisplay
        :pmtilesUrl="currentPmTilesUrl"
        :stylePreset="currentStylePreset"
        :customStyle="customStyle"
        @map-error="onMapError"
        @map-success="onMapSuccess"
      />
    </div>
    
    <!-- Right sidebar for style controls -->
    <div class="right-sidebar">
      <div class="sidebar-content">
        <StyleControl
          :currentStylePreset="currentStylePreset"
          @update-style="updateStyle"
        />
      </div>
    </div>
    
    <!-- Mobile menu bar -->
    <div class="mobile-menu-bar">
      <button @click="setActiveMobilePanel('controls')" :class="{ active: activeMobilePanel === 'controls' }">
        🛠️ Controls
      </button>
      <button @click="setActiveMobilePanel('map')" :class="{ active: activeMobilePanel === 'map' }">
        🗺️ Map
      </button>
      <button @click="setActiveMobilePanel('styles')" :class="{ active: activeMobilePanel === 'styles' }">
        🎨 Styles
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ControlPanel from './components/ControlPanel.vue';
import StyleControl from './components/StyleControl.vue';
import MapDisplay from './components/MapDisplay.vue';

export default {
  name: 'App',
  components: {
    ControlPanel,
    StyleControl,
    MapDisplay
  },
  
  setup() {
    // Constants
    const originalPmTiles = 'public/berlin_area.pmtiles';
    
    // Reactive state
    const currentPmTiles = ref(originalPmTiles);
    const currentPmTilesUrl = ref(originalPmTiles);
    const statusMessage = ref('Ready to load PMTiles');
    const statusType = ref('info');
    const currentStylePreset = ref('default');
    const customStyle = ref(null);
    
    // Layout state
    const activeMobilePanel = ref('map');

    // Set active mobile panel
    const setActiveMobilePanel = (panel) => {
      activeMobilePanel.value = panel;
    };

    // Load PMTiles function
    const loadPmTiles = (url) => {
      try {
        setStatus('Loading PMTiles...', 'loading');
        currentPmTiles.value = url;
        currentPmTilesUrl.value = url;
        // On mobile, switch to map view after loading a new PMTile
        if (window.innerWidth <= 768) {
          setActiveMobilePanel('map');
        }
      } catch (error) {
        console.error('Error loading PMTiles:', error);
        setStatus('Error loading PMTiles: ' + error.message, 'error');
      }
    };

    // Reset to original
    const resetToOriginal = () => {
      loadPmTiles(originalPmTiles);
    };
    
    // Status updater
    const setStatus = (message, type = 'info') => {
      statusMessage.value = message;
      statusType.value = type;
    };

    // Style updater
    const updateStyle = (presetName, styleData) => {
      console.log('Updating style:', presetName, styleData);
      currentStylePreset.value = presetName;
      
      // Deep clone the style data to ensure reactivity
      if (presetName === 'custom' && styleData) {
        customStyle.value = JSON.parse(JSON.stringify(styleData));
      } else {
        customStyle.value = null;
      }
      
      // On mobile, switch to map view after applying a style
      if (window.innerWidth <= 768) {
        setActiveMobilePanel('map');
      }
    };

    // Map event handlers
    const onMapError = (message) => {
      setStatus(message, 'error');
    };

    const onMapSuccess = (message) => {
      setStatus(message, 'success');
    };

    // Initialize on component mount
    onMounted(() => {
      loadPmTiles(originalPmTiles);
      
      // Set initial mobile view based on screen size
      if (window.innerWidth <= 768) {
        activeMobilePanel.value = 'map';
      }
    });

    return {
      originalPmTiles,
      currentPmTiles,
      currentPmTilesUrl,
      statusMessage,
      statusType,
      currentStylePreset,
      customStyle,
      activeMobilePanel,
      loadPmTiles,
      resetToOriginal,
      setStatus,
      updateStyle,
      onMapError,
      onMapSuccess,
      setActiveMobilePanel
    };
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --danger-color: #e74c3c;
  --text-color: #2c3e50;
  --light-bg: #f5f7fa;
  --sidebar-width: 350px;
  --right-sidebar-width: 340px;
  --border-radius: 12px;
  --header-height: 60px;
  --footer-height: 50px;
  --mobile-menu-height: 60px;
}

body {
  background-color: var(--light-bg);
  color: var(--text-color);
  font-size: 16px;
  line-height: 1.6;
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f0f4f8;
}

.main-content {
  flex: 1;
  position: relative;
  height: 100%;
  transition: margin 0.3s ease;
}

/* Right sidebar */
.right-sidebar {
  width: var(--right-sidebar-width);
  height: 100%;
  background-color: #ffffff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 900;
  display: flex;
  flex-direction: column;
}

.sidebar-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
}

/* Mobile menu */
.mobile-menu-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--mobile-menu-height);
  background-color: #ffffff;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.mobile-menu-bar button {
  flex: 1;
  height: 100%;
  background-color: transparent;
  border: none;
  color: #95a5a6;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  position: relative;
  overflow: hidden;
}

.mobile-menu-bar button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #2980b9);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mobile-menu-bar button.active {
  color: var(--primary-color);
}

.mobile-menu-bar button.active::before {
  opacity: 1;
}

button:focus, input:focus {
  outline: none;
}

/* Responsive styles */
@media (max-width: 1200px) {
  :root {
    --right-sidebar-width: 320px;
  }
}

@media (max-width: 1024px) {
  :root {
    --right-sidebar-width: 300px;
  }
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  .mobile-menu-bar {
    display: flex;
  }
  
  .control-panel, .right-sidebar, .main-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: var(--mobile-menu-height);
    width: 100vw;
    height: calc(100vh - var(--mobile-menu-height));
    z-index: 1000;
    transform: none;
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0;
    pointer-events: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Show appropriate panel based on selection */
  [data-mobile-panel="controls"] .control-panel {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
  }
  
  [data-mobile-panel="map"] .main-content {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
  }
  
  [data-mobile-panel="styles"] .right-sidebar {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
  }
  
  /* Hide other panels with transitions */
  [data-mobile-panel="controls"] .main-content,
  [data-mobile-panel="controls"] .right-sidebar {
    transform: translateX(100%);
  }
  
  [data-mobile-panel="map"] .control-panel {
    transform: translateX(-100%);
  }
  
  [data-mobile-panel="map"] .right-sidebar {
    transform: translateX(100%);
  }
  
  [data-mobile-panel="styles"] .control-panel,
  [data-mobile-panel="styles"] .main-content {
    transform: translateX(-100%);
  }
  
  .sidebar-toggle {
    display: none;
  }
  
  /* Right sidebar full width on mobile */
  .right-sidebar {
    width: 100%;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>