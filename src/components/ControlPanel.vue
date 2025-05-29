<template>
  <div class="control-panel">
    <!-- Source URL Section -->
    <section class="panel-section">
      <div class="section-title">
        <span class="section-icon">🔗</span>
        <h2>Source</h2>
      </div>
      
      <div class="input-group">
        <input 
          type="text" 
          v-model="pmtilesUrl" 
          placeholder="Enter PMTiles URL or paste link" 
          @keyup.enter="handleLoadPmTiles"
        />
        <button @click="handleLoadPmTiles" class="btn primary-btn">
          <span class="btn-icon">↗</span> Load
        </button>
      </div>
      
      <div class="buttons-group">
        <button @click="resetToOriginal" class="btn reset-btn">
          <span class="btn-icon">↩</span> Reset to Original
        </button>
      </div>
    </section>
    
    <!-- Upload Section -->
    <section class="panel-section">
      <div class="section-title">
        <span class="section-icon">📤</span>
        <h2>Upload</h2>
      </div>
      
      <div class="drag-drop-area" 
        @dragover.prevent="dragOver" 
        @dragleave.prevent="dragLeave"
        @drop.prevent="handleDrop"
        :class="{ active: isDragging }">
        <div class="drop-overlay" v-if="isDragging">
          <div class="overlay-content">
            <div class="drop-icon pulse">📥</div>
            <div class="drop-message">Release to load file</div>
          </div>
        </div>
        <div class="drag-drop-content">
          <div class="drag-icon">
            <span>�</span>
          </div>
          <div class="drag-drop-text">
            <span class="primary-text">Drag & drop PMTiles file here</span>
            <span class="secondary-text">or click to browse files</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Status Section -->
    <section class="panel-section">
      <div class="section-title">
        <span class="section-icon">📋</span>
        <h2>Status</h2>
      </div>
      
      <div class="status-box" :class="statusType">
        <div class="status-icon">
          <span v-if="statusType === 'success'">✓</span>
          <span v-else-if="statusType === 'error'">✗</span>
          <span v-else-if="statusType === 'loading'">⟳</span>
          <span v-else>ⓘ</span>
        </div>
        <div class="status-content">
          <div class="status-title">
            {{ statusTitle }}
          </div>
          <div class="status-message">{{ statusMessage }}</div>
        </div>
      </div>
    </section>
    
    <!-- File Info Section -->
    <section class="panel-section">
      <div class="section-title">
        <span class="section-icon">🗺️</span>
        <h2>Current File</h2>
      </div>
      
      <div class="info-box">
        <div class="info-content">
          <span class="file-icon">🗺️</span>
          <div class="file-details">
            <div class="file-name">{{ getFileName(currentPmTiles) }}</div>
            <div class="file-path">{{ getFilePath(currentPmTiles) }}</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-content">
        <a href="https://github.com/ronitjadhav/pmtiles-demo" target="_blank" class="footer-link">
          <span class="github-icon">⌥</span>
          View on GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ControlPanel',
  props: {
    originalPmTiles: {
      type: String,
      required: true
    },
    currentPmTiles: {
      type: String,
      required: true
    },
    statusType: {
      type: String,
      default: 'info'
    },
    statusMessage: {
      type: String,
      default: 'Ready to load PMTiles'
    }
  },
  emits: ['load-pmtiles', 'set-status', 'reset-to-original'],
  
  setup(props, { emit }) {
    const pmtilesUrl = ref('')
    const isDragging = ref(false)
    
    // Computed status title based on status type
    const statusTitle = computed(() => {
      switch (props.statusType) {
        case 'success': return 'Success';
        case 'error': return 'Error';
        case 'loading': return 'Loading';
        default: return 'Info';
      }
    });
    
    const handleLoadPmTiles = () => {
      if (!pmtilesUrl.value) {
        emit('set-status', 'Please enter a PMTiles URL', 'error')
        return
      }
      
      emit('load-pmtiles', pmtilesUrl.value)
      pmtilesUrl.value = ''
    }
    
    const resetToOriginal = () => {
      emit('reset-to-original')
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
          emit('load-pmtiles', url)
        } else {
          emit('set-status', 'Please drop a valid .pmtiles file', 'error')
        }
      }
    }
    
    // File name and path extraction
    const getFileName = (path) => {
      if (!path) return 'No file selected';
      
      // Extract the filename from the path
      const parts = path.split('/');
      return parts[parts.length - 1] || path;
    };
    
    const getFilePath = (path) => {
      if (!path) return '';
      
      if (path.startsWith('blob:')) {
        return 'Local uploaded file';
      }
      
      // For URL paths, return the path without the filename
      const parts = path.split('/');
      if (parts.length <= 1) return path;
      
      parts.pop(); // Remove filename
      return parts.join('/') || '/';
    };
    
    return {
      pmtilesUrl,
      isDragging,
      statusTitle,
      handleLoadPmTiles,
      resetToOriginal,
      dragOver,
      dragLeave,
      handleDrop,
      getFileName,
      getFilePath
    }
  }
}
</script>

<style scoped>
.control-panel {
  width: var(--sidebar-width);
  height: 100vh;
  background-color: #ffffff;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 28px 24px;
  position: relative;
  background-image: linear-gradient(to bottom, #ffffff, #f8faff);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

/* Panel Sections */
.panel-section {
  margin-bottom: 28px;
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
}

.section-icon {
  font-size: 18px;
  margin-right: 10px;
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

.badge {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 10px;
  margin-left: 10px;
  box-shadow: 0 2px 5px rgba(52, 152, 219, 0.3);
}

/* Input Group */
.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  position: relative;
  width: 100%;
}

input[type="text"] {
  flex: 1;
  padding: 14px;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #fff;
  min-width: 0; /* Allows flex to shrink properly */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

input[type="text"]:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
  outline: none;
}

.btn {
  padding: 12px 16px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.2);
  white-space: nowrap;
  flex-shrink: 0;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(52, 152, 219, 0.3);
}

.btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.2);
}

.primary-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.btn-icon {
  font-size: 16px;
}

.buttons-group {
  margin-bottom: 5px;
  display: flex;
  gap: 10px;
}

.reset-btn {
  width: 100%;
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  box-shadow: 0 4px 8px rgba(127, 140, 141, 0.2);
}

.reset-btn:hover {
  box-shadow: 0 6px 12px rgba(127, 140, 141, 0.3);
}

/* Enhanced Drag & Drop Area */
.drag-drop-area {
  flex-grow: 0;
  height: 160px;
  border: 2px dashed #d0d8e0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: rgba(248, 249, 250, 0.7);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.drag-drop-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(52, 152, 219, 0.03), transparent);
  z-index: 0;
}

.drag-drop-area:hover {
  border-color: #3498db;
  background-color: rgba(52, 152, 219, 0.05);
  transform: translateY(-2px);
}

.drag-drop-area.active {
  border-color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.1);
}

.drag-drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  position: relative;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  height: 100%;
}

/* Drop overlay */
.drop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(52, 152, 219, 0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  border-radius: 14px;
  animation: fadeIn 0.3s ease;
}

.overlay-content {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: scale(1.05);
  animation: scaleIn 0.3s ease forwards;
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.drop-icon {
  font-size: 42px;
  color: #3498db;
  margin-bottom: 12px;
}

.pulse {
  animation: pulse 1.5s infinite alternate;
}

.drop-message {
  font-weight: 600;
  font-size: 18px;
  color: #3498db;
}

.drag-icon {
  font-size: 38px;
  margin-bottom: 15px;
  color: #7f8c8d;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: rgba(52, 152, 219, 0.1);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drag-drop-area:hover .drag-icon {
  color: #3498db;
  transform: translateY(-3px);
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.1); opacity: 0.8; }
}

.drag-drop-text {
  text-align: center;
  max-width: 90%;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.primary-text {
  color: #34495e;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 5px;
}

.secondary-text {
  color: #7f8c8d;
  font-size: 14px;
  font-weight: 400;
}

/* Enhanced Status Box */
.status-box {
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 5px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.status-content {
  flex: 1;
}

.status-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.status-message {
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.4;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: bold;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  margin-top: 2px;
}

.status-box.info {
  background-color: #e3f2fd;
  color: #1565c0;
  border-left-color: #1565c0;
}

.status-box.info .status-icon {
  background-color: #1565c0;
  color: white;
}

.status-box.error {
  background-color: #ffebee;
  color: #c62828;
  border-left-color: #c62828;
}

.status-box.error .status-icon {
  background-color: #c62828;
  color: white;
}

.status-box.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border-left-color: #2e7d32;
}

.status-box.success .status-icon {
  background-color: #2e7d32;
  color: white;
}

.status-box.loading {
  background-color: #fff8e1;
  color: #f57f17;
  border-left-color: #f57f17;
}

.status-box.loading .status-icon {
  background-color: #f57f17;
  color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Enhanced Info Box */
.info-box {
  background-color: #f5f7fa;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.info-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.06);
}

.info-content {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 8px;
}

.file-icon {
  font-size: 24px;
  color: #3498db;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
  min-width: 30px;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: 600;
  font-size: 14px;
  color: #34495e;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-path {
  font-size: 12px;
  color: #7f8c8d;
  word-break: break-all;
}

/* Enhanced Footer */
.footer {
  margin-top: auto;
  padding: 20px 0;
  position: relative;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-link {
  color: #3498db;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.footer-link:hover {
  color: #2980b9;
  background: rgba(52, 152, 219, 0.1);
  transform: translateY(-2px);
}

.github-icon {
  font-size: 16px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .control-panel {
    width: 100vw;
    height: calc(100vh - var(--mobile-menu-height));
    padding: 20px 18px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    border-right: none;
    background-image: linear-gradient(to bottom, #ffffff, #f7f9ff);
    box-sizing: border-box;
  }
  
  .panel-section {
    margin-bottom: 22px;
  }
  
  .info-box, .status-box {
    margin-bottom: 0;
  }
  
  .drag-drop-area {
    height: 140px;
  }
  
  .footer {
    padding-bottom: 20px;
    margin-top: auto;
  }
  
  .input-group {
    box-sizing: border-box;
  }
  
  .btn {
    padding: 12px 14px;
    font-size: 14px;
  }
  
  .drag-icon {
    width: 60px;
    height: 60px;
    font-size: 32px;
  }
  
  .primary-text {
    font-size: 15px;
  }
  
  .secondary-text {
    font-size: 13px;
  }
}
</style>
