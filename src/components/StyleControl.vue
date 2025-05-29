<template>
  <div class="style-control">
    <!-- Minimalist Header -->
    <div class="header">
      <div class="header-content">
        <div class="title-container">
          <span class="title-icon">🎨</span>
          <h1>style</h1>
        </div>
        <!-- Mobile close button -->
        <button @click="toggleCustomEditor" class="mobile-close-btn" v-if="isMobileView">✕</button>
      </div>
    </div>
    
    <!-- Style Presets -->
    <section class="panel-section">
      <div class="section-title">
        <span class="section-icon">🎨</span>
        <h2>Map Styles</h2>
      </div>
      
      <div class="style-selector">
        <div class="style-options">
          <button 
            v-for="(preset, name) in availablePresets"
            :key="name"
            @click="selectPreset(name)" 
            :class="['style-btn', currentPreset === name ? 'active' : '']"
            :style="getPresetButtonStyle(name)"
          >
            <div class="style-btn-content">
              <span class="style-btn-icon">{{ getPresetIcon(name) }}</span>
              <span class="style-btn-name">{{ formatPresetName(name) }}</span>
            </div>
          </button>
        </div>
      </div>
    </section>
    
    <!-- Custom Style Editor -->
    <section class="panel-section">
      <div class="section-title">
        <span class="section-icon">⚙️</span>
        <h2>Custom Editor</h2>
        <button @click="toggleCustomEditor" class="editor-toggle-btn">
          <span v-if="!showCustomEditor">Customize</span>
          <span v-else>Close</span>
        </button>
      </div>
      
      <div class="custom-editor" v-if="showCustomEditor">
        <div class="editor-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="['tab-btn', currentTab === tab.id ? 'active' : '']"
          >
            <span class="tab-icon">{{ getTabIcon(tab.id) }}</span>
            {{ tab.name }}
          </button>
        </div>
        
        <!-- Basic Colors -->
        <div class="tab-content" v-if="currentTab === 'basic'">
          <div class="color-grid">
            <div v-for="(value, key) in getBasicProperties()" :key="key" class="color-input">
              <div class="property-info">
                <label :for="key">{{ formatPropertyName(key) }}</label>
                <div class="tooltip" :class="{ 'tooltip-visible': hoveredProperty === key }">
                  <span class="tooltip-icon" @mouseenter="hoveredProperty = key" @mouseleave="hoveredProperty = null">ⓘ</span>
                  <span class="tooltiptext">{{ getPropertyDescription(key) }}</span>
                </div>
              </div>
              <div class="color-controls">
                <div class="color-picker-wrapper">
                  <input 
                    type="color" 
                    :id="key" 
                    v-model="customStyle[key]" 
                    @input="applyCustomStyle"
                  >
                </div>
                <input 
                  type="text" 
                  v-model="customStyle[key]" 
                  @input="applyCustomStyle" 
                  class="color-text-input"
                  :style="{ borderColor: customStyle[key] }"
                >
              </div>
            </div>
          </div>
        </div>
        
        <!-- Roads Colors -->
        <div class="tab-content" v-if="currentTab === 'roads'">
          <div class="color-grid">
            <div 
              v-for="(nestedValue, nestedKey) in customStyle.roads" 
              :key="`roads-${nestedKey}`"
              class="color-input"
            >
              <div class="property-info">
                <label :for="`roads-${nestedKey}`">{{ formatPropertyName(nestedKey) }}</label>
                <div class="tooltip" :class="{ 'tooltip-visible': hoveredProperty === `roads.${nestedKey}` }">
                  <span class="tooltip-icon" @mouseenter="hoveredProperty = `roads.${nestedKey}`" @mouseleave="hoveredProperty = null">ⓘ</span>
                  <span class="tooltiptext">{{ getPropertyDescription(`roads.${nestedKey}`) }}</span>
                </div>
              </div>
              <div class="color-controls">
                <div class="color-picker-wrapper">
                  <input 
                    type="color" 
                    :id="`roads-${nestedKey}`" 
                    v-model="customStyle.roads[nestedKey]" 
                    @input="applyCustomStyle"
                  >
                </div>
                <input 
                  type="text" 
                  v-model="customStyle.roads[nestedKey]" 
                  @input="applyCustomStyle" 
                  class="color-text-input"
                  :style="{ borderColor: customStyle.roads[nestedKey] }"
                >
              </div>
            </div>
          </div>
        </div>
        
        <!-- Landuse Colors -->
        <div class="tab-content" v-if="currentTab === 'landuse'">
          <div class="color-grid">
            <div 
              v-for="(nestedValue, nestedKey) in customStyle.landuse" 
              :key="`landuse-${nestedKey}`"
              class="color-input"
            >
              <div class="property-info">
                <label :for="`landuse-${nestedKey}`">{{ formatPropertyName(nestedKey) }}</label>
                <div class="tooltip" :class="{ 'tooltip-visible': hoveredProperty === `landuse.${nestedKey}` }">
                  <span class="tooltip-icon" @mouseenter="hoveredProperty = `landuse.${nestedKey}`" @mouseleave="hoveredProperty = null">ⓘ</span>
                  <span class="tooltiptext">{{ getPropertyDescription(`landuse.${nestedKey}`) }}</span>
                </div>
              </div>
              <div class="color-controls">
                <div class="color-picker-wrapper">
                  <input 
                    type="color" 
                    :id="`landuse-${nestedKey}`" 
                    v-model="customStyle.landuse[nestedKey]" 
                    @input="applyCustomStyle"
                  >
                </div>
                <input 
                  type="text" 
                  v-model="customStyle.landuse[nestedKey]" 
                  @input="applyCustomStyle" 
                  class="color-text-input"
                  :style="{ borderColor: customStyle.landuse[nestedKey] }"
                >
              </div>
            </div>
          </div>
        </div>
        
        <div class="editor-actions">
          <button @click="saveCustomStyle" class="save-btn">
            <span class="btn-icon">💾</span> Save as Preset
          </button>
          <button @click="resetStyle" class="reset-btn">
            <span class="btn-icon">🔄</span> Reset
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { stylePresets, cloneStyle, getStylePropertyInfo } from '../styles/mapStyles.js';

export default {
  name: 'StyleControl',
  props: {
    currentStylePreset: {
      type: String,
      default: 'default'
    }
  },
  emits: ['update-style'],
  
  setup(props, { emit }) {
    const currentPreset = ref(props.currentStylePreset);
    const showEditor = ref(true);
    const showCustomEditor = ref(false);
    const customStyle = ref({});
    const availablePresets = ref({ ...stylePresets });
    const currentTab = ref('basic');
    const hoveredProperty = ref(null);
    
    // Add mobile view detection
    const isMobileView = ref(false);
    
    // Update mobile view state on mount and resize
    onMounted(() => {
      checkMobileView();
      window.addEventListener('resize', checkMobileView);
    });
    
    onUnmounted(() => {
      window.removeEventListener('resize', checkMobileView);
    });
    
    const checkMobileView = () => {
      isMobileView.value = window.innerWidth <= 768;
    };

    // Define tabs for the editor
    const tabs = [
      { id: 'basic', name: 'Basic' },
      { id: 'roads', name: 'Roads' },
      { id: 'landuse', name: 'Landuse' }
    ];
    
    // Initialize custom style
    const initCustomStyle = () => {
      customStyle.value = cloneStyle(availablePresets.value[currentPreset.value] || stylePresets.default);
    };
    
    // Watch for prop changes
    watch(() => props.currentStylePreset, (newValue) => {
      currentPreset.value = newValue;
      initCustomStyle();
    });
    
    // Format preset name for display
    const formatPresetName = (name) => {
      return name.charAt(0).toUpperCase() + name.slice(1);
    };
    
    // Get preset icon
    const getPresetIcon = (presetName) => {
      const icons = {
        default: '🌟',
        light: '☀️',
        dark: '🌙',
        custom: '✨'
      };
      return icons[presetName] || '🎨';
    };
    
    // Get tab icon
    const getTabIcon = (tabId) => {
      const icons = {
        basic: '🎯',
        roads: '🛣️',
        landuse: '🏞️'
      };
      return icons[tabId] || '🔧';
    };
    
    // Format property name for display
    const formatPropertyName = (name) => {
      return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
    };
    
    // Get basic properties (non-nested)
    const getBasicProperties = () => {
      const basics = {};
      for (const key in customStyle.value) {
        if (typeof customStyle.value[key] === 'string') {
          basics[key] = customStyle.value[key];
        }
      }
      return basics;
    };
    
    // Get preset button style
    const getPresetButtonStyle = (presetName) => {
      const preset = availablePresets.value[presetName];
      if (!preset) return {};
      
      const bgColor = preset.background || '#ffffff';
      const isDark = bgColor === '#212121';
      const textColor = isDark ? '#ffffff' : '#2c3e50';
      const borderColor = preset.water || '#80deea';
      
      return {
        backgroundColor: bgColor,
        color: textColor,
        borderColor: borderColor,
        '--hover-bg': isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        '--active-shadow': `0 0 0 2px ${borderColor}`
      };
    };
    
    // Get property description
    const getPropertyDescription = (key) => {
      return getStylePropertyInfo(key);
    };
    
    // Select a preset
    const selectPreset = (presetName) => {
      currentPreset.value = presetName;
      customStyle.value = cloneStyle(availablePresets.value[presetName]);
      emit('update-style', currentPreset.value, customStyle.value);
    };
    
    // Toggle custom editor
    const toggleCustomEditor = () => {
      showCustomEditor.value = !showCustomEditor.value;
      if (showCustomEditor.value && (!customStyle.value || Object.keys(customStyle.value).length === 0)) {
        initCustomStyle();
      }
    };
    
    // Apply custom style
    const applyCustomStyle = () => {
      emit('update-style', 'custom', customStyle.value);
    };
    
    // Save custom style as a preset
    const saveCustomStyle = () => {
      const presetName = prompt('Enter a name for your custom preset:', 'my-custom-style');
      if (presetName) {
        availablePresets.value[presetName] = cloneStyle(customStyle.value);
        currentPreset.value = presetName;
        emit('update-style', currentPreset.value, customStyle.value);
      }
    };
    
    // Reset style to selected preset
    const resetStyle = () => {
      if (confirm('Are you sure you want to reset the style?')) {
        initCustomStyle(); // Reinitialize with the current preset's original style
        emit('update-style', currentPreset.value, customStyle.value);
      }
    };
    
    // Initialize
    initCustomStyle();
    
    return {
      currentPreset,
      showEditor,
      showCustomEditor,
      customStyle,
      availablePresets,
      currentTab,
      tabs,
      hoveredProperty,
      isMobileView,
      formatPresetName,
      formatPropertyName,
      getBasicProperties,
      getPresetButtonStyle,
      getPropertyDescription,
      getPresetIcon,
      getTabIcon,
      selectPreset,
      toggleCustomEditor,
      applyCustomStyle,
      saveCustomStyle,
      resetStyle
    };
  }
}
</script>

<style scoped>
/* Base style panel styles */
.style-control {
  padding: 28px 24px;
  background-color: transparent;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  max-width: var(--right-sidebar-width);
  box-sizing: border-box;
  overflow-x: hidden;
  background-image: linear-gradient(to bottom, #ffffff, #f8faff);
  position: relative;
}

h3 {
  margin-bottom: 15px;
  font-size: 22px;
  color: #2c3e50;
  font-weight: 600;
}

h4 {
  margin-bottom: 12px;
  font-size: 18px;
  color: #34495e;
  font-weight: 500;
}

h5 {
  margin: 10px 0;
  font-size: 16px;
  color: #546e7a;
  font-weight: 500;
}

.style-selector {
  margin-bottom: 20px;
}

.style-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
}

.style-btn {
  background: var(--button-bg, #fff);
  border: 2px solid var(--border-color, #e0e0e0);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 14px;
  overflow: hidden;
  position: relative;
  padding: 0;
}

.style-btn-content {
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.style-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.style-btn:hover::before {
  opacity: 1;
}

.style-btn.active {
  box-shadow: var(--active-shadow, 0 0 0 2px #3498db);
  transform: translateY(-2px);
}

.style-btn-icon {
  font-size: 16px;
}

.style-btn-name {
  font-weight: 600;
}

.header {
  margin-bottom: 24px;
  padding-bottom: 14px;
  border-bottom: 1px solid #edf2f7;
}

.header-content {
  display: flex;
  align-items: center;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 24px;
  opacity: 0.9;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  text-transform: lowercase;
  letter-spacing: -0.5px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.badge {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 10px;
  margin-left: 10px;
  box-shadow: 0 2px 5px rgba(52, 152, 219, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.panel-section {
  margin-bottom: 20px;
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  position: relative;
}

.section-icon {
  font-size: 18px;
  color: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(52, 152, 219, 0.1);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.15);
}

.section-title h2 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.custom-editor {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 16px;
  animation: slideUp 0.3s ease-out;
  max-width: 100%;
  overflow: hidden;
}

.editor-tabs {
  display: flex;
  gap: 8px;
  margin: -16px -16px 16px -16px;
  padding: 8px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.editor-tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  padding: 8px 12px;
  background-color: #f8fafc;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  flex-shrink: 0;
}

.tab-icon {
  font-size: 16px;
}

.tab-btn:hover {
  background-color: #f1f5f9;
  color: #3498db;
}

.tab-btn.active {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.2);
}

.color-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.color-input {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  transition: all 0.2s ease;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
}

.color-input:hover {
  border-color: #cbd5e1;
  background-color: #f8fafc;
}

.property-info {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.property-info label {
  font-size: 12px;
  font-weight: 500;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tooltip {
  position: relative;
}

.tooltip-icon {
  width: 18px;
  height: 18px;
  font-size: 11px;
}

.color-controls {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: flex-end;
}

.color-picker-wrapper {
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

input[type="color"] {
  position: absolute;
  top: -2px;
  left: -2px;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
}

.color-text-input {
  width: 75px;
  padding: 4px 6px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  color: #334155;
  transition: all 0.2s ease;
  text-align: center;
  font-family: monospace;
}

.color-text-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

/* Make tooltips more compact */
.tooltiptext {
  font-size: 11px;
  padding: 6px 10px;
  max-width: 180px;
  line-height: 1.4;
}

.editor-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.save-btn,
.reset-btn {
  padding: 8px;
  font-size: 13px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn {
  background: linear-gradient(135deg, #4CAF50, #43a047);
  color: white;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.reset-btn {
  background: linear-gradient(135deg, #f44336, #d32f2f);
  color: white;
  box-shadow: 0 2px 4px rgba(244, 67, 54, 0.2);
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
}

.editor-toggle-btn {
  margin-left: auto;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.2);
}

.editor-toggle-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.editor-toggle-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.2);
}

@media (max-width: 768px) {
  .style-control {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100%;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    padding: 20px;
    background-color: #ffffff;
  }

  .header {
    position: sticky;
    top: 0;
    background: #ffffff;
    z-index: 10;
    padding-top: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -20px;
    right: -20px;
    height: 1px;
    background: #edf2f7;
  }

  .title-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Add a close button for mobile */
  .mobile-close-btn {
    display: block;
    padding: 8px;
    background: none;
    border: none;
    color: #64748b;
    font-size: 24px;
    cursor: pointer;
    margin-left: auto;
  }

  .panel-section {
    margin-bottom: 24px;
  }

  .custom-editor {
    margin: 0;
    padding: 16px;
    box-shadow: none;
    border: 1px solid #e2e8f0;
  }

  .color-grid {
    gap: 12px;
  }

  .color-input {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    padding: 12px;
  }

  .property-info {
    max-width: none;
  }

  .color-text-input {
    width: 85px;
  }

  .editor-actions {
    position: sticky;
    bottom: 0;
    background: #ffffff;
    margin: 0 -20px -20px;
    padding: 16px 20px;
    box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.05);
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .property-info {
    max-width: 140px;
  }

  .color-text-input {
    width: 70px;
  }
}

@media (max-width: 320px) {
  .style-options {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 20px;
  }

  .badge {
    padding: 3px 6px;
    font-size: 11px;
  }
}

/* Tooltip optimizations */
.tooltiptext {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #2c3e50;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  z-index: 1000;
  display: none;
}

.tooltip:hover .tooltiptext {
  display: block;
}
</style>
