# 🌍 PMTiles Vue Demo on GitHub Pages

This repository demonstrates how to **host a `.pmtiles` archive on GitHub Pages** and render it in a **Vite + Vue 3** app using **OpenLayers** and **ol-pmtiles**. It works entirely through static hosting — no servers or backend required.

---

## 📡 PMTiles URL

Your hosted `.pmtiles` file will be accessible at:

`https://YOUR_USERNAME.github.io/pmtiles-vue-demo/<your_file>.pmtiles`

Replace `<your_file>.pmtiles` with the actual name you used, such as `berlin_area.pmtiles`.

---

## 🔍 Test Without App

You can test your `.pmtiles` file without this Vue app. Just copy the URL and paste it into:

🔗 [Protomaps Viewer](https://maps.protomaps.com)

This viewer loads `.pmtiles` from a URL and displays them directly in your browser.

---

## ✨ Features

- **Improved UI with sidebar control panel**
- **Multiple ways to load PMTiles:**
  - Input box for custom PMTiles URLs
  - Drag & drop support for local PMTiles files
  - Reset to original PMTiles file
- **Status feedback** for loading states, errors, and success messages
- **Currently loaded PMTiles info display**

---

## 🚀 Live Demo

After enabling GitHub Pages, visit your hosted app at:

`https://YOUR_USERNAME.github.io/pmtiles-vue-demo/`

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 📂 Repository Structure

```
pmtiles-vue-demo/
├── docs/                      # GitHub Pages serves this folder
│   ├── index.html             # Vite's output HTML
│   └── <your_file>.pmtiles    # Your hosted PMTiles file
├── public/
│   └── <your_file>.pmtiles    # Copy your PMTiles here
├── src/
│   ├── App.vue                # Vue component with map and UI
│   └── main.js                # Vue app entrypoint
├── vite.config.js             # Vite configuration
└── README.md                  # You're reading this!
```

---

## 🧪 Quick Start Guide

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/pmtiles-vue-demo.git
cd pmtiles-vue-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your PMTiles file

Copy your `.pmtiles` file into the `public/` folder and rename it to match your dataset, for example:

```bash
cp /path/to/berlin_area.pmtiles public/berlin_area.pmtiles
```

You don't need to manually update any references - the app has a default value for the original PMTiles file.

### 4. Start development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser to test locally.

### 5. Build for production

```bash
npm run build
```

This compiles your app into the `docs/` folder (used by GitHub Pages) and copies your `.pmtiles` file along with it.

### 6. Push to GitHub and enable Pages

```bash
git add .
git commit -m "Initial commit with PMTiles viewer"
git push
```

Then:

1. Go to your repo on GitHub.
2. Navigate to **Settings → Pages**.
3. Under **Source**, select:
   - **Branch**: `main`
   - **Folder**: `/docs`
4. Click **Save**.

After a minute or two, your live map will be available at:

`https://YOUR_USERNAME.github.io/pmtiles-vue-demo/`

---

## 🗺️ How It Works

- **OpenLayers** renders a vector tile map using `VectorTileLayer`.
- **ol-pmtiles** enables OpenLayers to stream tiles from `.pmtiles` using HTTP range requests.
- **GitHub Pages** supports byte-range requests and CORS, making it perfect for PMTiles hosting.
- **Vite + Vue 3** provides fast development experience and static bundling.
- **Modern UI** with drag-and-drop and URL input support for loading different PMTiles files.

---

## 👩‍💻 Using the App

### Loading PMTiles via URL
1. Enter a valid PMTiles URL in the input box
2. Press Enter or click the "Load" button
3. The map will refresh with the new PMTiles data

### Loading PMTiles via Drag & Drop
1. Prepare a local `.pmtiles` file on your device
2. Drag the file over the drop area in the sidebar
3. Drop the file to load it into the map

### Resetting to Original
1. Click the "Reset to Original" button
2. The map will reload with the default PMTiles file

---

## 🎨 Customizing Your Map

To style map features, edit the `style` function in `src/App.vue`:

```javascript
style: feature => {
  return new Style({
    stroke: new Stroke({ color: '#555', width: 1 }),
    fill: new Fill({ color: 'rgba(100,150,200,0.4)' })
  });
}
```

You can also:

- Add multiple tile layers
- Adjust map center and zoom
- Load other `.pmtiles` files from the `public/` folder
- Customize the sidebar UI colors and layout

---

## 📚 Resources

- [PMTiles GitHub](https://github.com/protomaps/PMTiles)
- [ol-pmtiles GitHub](https://github.com/protomaps/ol-pmtiles)
- [OpenLayers Documentation](https://openlayers.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Protomaps Viewer](https://maps.protomaps.com)

---

## 🗺️ Built with ❤️ for the geospatial community

This version includes a modern UI with multiple ways to load PMTiles data, making it flexible for different use cases and datasets.