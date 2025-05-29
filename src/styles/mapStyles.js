// Map style presets for PMTiles
export const stylePresets = {
  default: {
    water: '#80deea',
    landuse: {
      park: '#9cd3b4',
      industrial: '#d1dde1',
      hospital: '#e4dad9'
    },
    buildings: 'rgba(204, 204, 204, 0.5)',
    roads: {
      highway: '#ffffff',
      major: '#ffffff',
      minor: '#ebebeb'
    },
    background: '#e2dfda'
  },
  light: {
    water: '#b3e5fc',
    landuse: {
      park: '#c5e1a5',
      industrial: '#eceff1',
      hospital: '#f5f5f5'
    },
    buildings: 'rgba(224, 224, 224, 0.4)',
    roads: {
      highway: '#ffffff',
      major: '#fafafa',
      minor: '#f5f5f5'
    },
    background: '#ffffff'
  },
  dark: {
    water: '#263238',
    landuse: {
      park: '#2e7d32',
      industrial: '#37474f',
      hospital: '#37474f'
    },
    buildings: 'rgba(66, 66, 66, 0.5)',
    roads: {
      highway: '#9e9e9e',
      major: '#757575',
      minor: '#616161'
    },
    background: '#212121'
  }
};

// Function to create a deep copy of a style object
export const cloneStyle = (style) => {
  return JSON.parse(JSON.stringify(style));
};

// Function to create a new custom style from a base preset
export const createCustomStyle = (basePreset) => {
  const base = stylePresets[basePreset] || stylePresets.default;
  return cloneStyle(base);
};

// Function to merge two styles
export const mergeStyles = (baseStyle, overrides) => {
  const result = cloneStyle(baseStyle);
  
  for (const key in overrides) {
    if (typeof overrides[key] === 'object' && overrides[key] !== null) {
      if (typeof result[key] !== 'object') {
        result[key] = {};
      }
      result[key] = { ...result[key], ...overrides[key] };
    } else {
      result[key] = overrides[key];
    }
  }
  
  return result;
};

// Function to convert HEX to RGBA
export const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return 'rgba(0, 0, 0, 1)';
  
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle shorthand hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Parse hex values
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Function to get style property description
export const getStylePropertyInfo = (key) => {
  const descriptions = {
    water: 'Color of water bodies like rivers, lakes and oceans',
    background: 'Base color for the map background',
    buildings: 'Color of building structures',
    'roads.highway': 'Color of major highways and expressways',
    'roads.major': 'Color of main roads and arteries',
    'roads.minor': 'Color of smaller streets and roads',
    'landuse.park': 'Color of parks, forests and natural reserves',
    'landuse.industrial': 'Color of industrial zones and areas',
    'landuse.hospital': 'Color of hospitals and healthcare facilities'
  };
  
  return descriptions[key] || 'Map style property';
};
