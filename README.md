# 🌍 PMTiles Vue Demo - Interactive Style Editor

This repository demonstrates how to **host a `.pmtiles` archive on GitHub Pages** and render it in a **Vite + Vue 3** app using **OpenLayers** and **ol-pmtiles**. It features an enhanced UI with a modern design and interactive style editing capabilities.

---

## ✨ Key Features

- **Modern, Component-Based Architecture**
  - Separation of concerns with distinct components
  - Clean code organization with styles in separate files
  - Responsive design for various screen sizes

- **Interactive Style Editor**
  - Choose from multiple built-in style presets (Default, Light, Dark)
  - Customize individual style properties with real-time preview
  - Save custom styles as new presets
  - Organize style properties in tabs for easy access

- **Multiple PMTiles Loading Options**
  - Load PMTiles from URL input
  - Drag & drop support for local PMTiles files
  - Reset to original PMTiles file with one click

- **User Experience Enhancements**
  - Status feedback with clear visual indicators
  - Tooltips with property descriptions
  - Modern UI with smooth transitions and animations

---

## 📡 PMTiles URL

Your hosted `.pmtiles` file will be accessible at:

`https://YOUR_USERNAME.github.io/pmtiles-demo/<your_file>.pmtiles`

Replace `<your_file>.pmtiles` with the actual name you used, such as `berlin_area.pmtiles`.

---

## 🔍 Test Without App

You can test your `.pmtiles` file without this Vue app. Just copy the URL and paste it into:

🔗 [Protomaps Viewer](https://maps.protomaps.com)

---

## 🚀 Live Demo

After enabling GitHub Pages, visit your hosted app at:

`https://YOUR_USERNAME.github.io/pmtiles-demo/`

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 📂 Project Structure

```
pmtiles-demo/
├── public/
│   └── berlin_area.pmtiles    # Default PMTiles file
├── src/
│   ├── components/
│   │   ├── ControlPanel.vue   # PMTiles loading interface
│   │   ├── MapDisplay.vue     # OpenLayers map rendering
│   │   └── StyleControl.vue   # Style editing interface
│   ├── styles/
│   │   ├── mapStyles.js       # Style presets and utilities
│   │   └── styleUtils.js      # Vector tile styling functions
│   ├── App.vue                # Main app component
│   ├── main.js                # App entry point
│   └── style.css              # Global styles
├── vite.config.js             # Vite configuration
└── README.md                  # Documentation
```

---

## 🧪 Quick Start Guide

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/pmtiles-demo.git
cd pmtiles-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your PMTiles file

Copy your `.pmtiles` file into the `public/` folder:

```bash
cp /path/to/your-file.pmtiles public/
```

Update the reference in `App.vue` if necessary.

### 4. Start development server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser to test locally.

### 5. Build for production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

---

## 🎨 Using the Style Editor

1. **Select a Preset**: Choose from Default, Light, or Dark styles
2. **Customize Style**: Click 'Customize' to open the style editor
3. **Edit Properties**: Use color pickers to modify style properties
4. **Save Custom Style**: Save your custom style as a new preset
5. **Reset**: Return to the original preset style

---

## 🛠️ Technologies Used

- **Vue 3** with Composition API
- **OpenLayers** for map rendering
- **ol-pmtiles** for PMTiles support
- **Vite** for development and building

---

## 📄 License

MIT