import { Style, Fill, Stroke, Text } from 'ol/style';
import { stylePresets } from './mapStyles';

// Helper function to create vector tile style based on feature properties and style preset
export const createVectorTileStyle = (styleConfig) => {
  // If no style config is provided, use default
  const stylePreset = styleConfig || stylePresets.default;
  
  return (feature) => {
    const featureType = feature.getGeometry().getType();
    const layerName = feature.get('layer'); // Get the layer name
    const kind = feature.get('kind') || '';
    
    // Default styles
    let fillColor = 'rgba(200, 200, 200, 0.6)';
    let strokeColor = 'rgba(100, 100, 100, 0.8)';
    let strokeWidth = 1;
    let textContent = '';
    let textColor = stylePreset.background === '#212121' ? '#ffffff' : '#333333';
    
    // Style based on geometry type and properties
    if (featureType === 'Polygon' || featureType === 'MultiPolygon') {
      if (layerName === 'water') {
        fillColor = stylePreset.water;
        strokeColor = stylePreset.water;
      } else if (layerName === 'landuse') {
        if (kind === 'park' || kind === 'nature_reserve' || kind === 'forest') {
          fillColor = stylePreset.landuse?.park || '#9cd3b4';
        } else if (kind === 'industrial') {
          fillColor = stylePreset.landuse?.industrial || '#d1dde1';
        } else if (kind === 'hospital') {
          fillColor = stylePreset.landuse?.hospital || '#e4dad9';
        }
      } else if (layerName === 'buildings') {
        fillColor = stylePreset.buildings || 'rgba(204, 204, 204, 0.5)';
      } else if (layerName === 'earth') {
        fillColor = stylePreset.background || '#e2dfda';
      }
    } else if (featureType === 'LineString' || featureType === 'MultiLineString') {
      if (layerName === 'roads') {
        const roadKind = feature.get('kind');
        if (roadKind === 'highway') {
          strokeColor = stylePreset.roads?.highway || '#ffffff';
          strokeWidth = 5;
        } else if (roadKind === 'major_road') {
          strokeColor = stylePreset.roads?.major || '#ffffff';
          strokeWidth = 3;
        } else if (roadKind === 'minor_road') {
          strokeColor = stylePreset.roads?.minor || '#ebebeb';
          strokeWidth = 2;
        } else {
          strokeColor = stylePreset.roads?.minor || '#ebebeb';
          strokeWidth = 1;
        }
      }
    } else if (featureType === 'Point') {
      if (layerName === 'places') {
        textContent = feature.get('name') || '';
        textColor = stylePreset.background === '#212121' ? '#ffffff' : '#333333';
      }
    }
    
    const styleObj = new Style({
      fill: new Fill({
        color: fillColor
      }),
      stroke: new Stroke({
        color: strokeColor,
        width: strokeWidth
      })
    });
    
    if (textContent) {
      styleObj.setText(new Text({
        text: textContent,
        font: '12px sans-serif',
        fill: new Fill({
          color: textColor
        }),
        stroke: new Stroke({
          color: stylePreset.background === '#212121' ? '#000000' : '#ffffff',
          width: 2
        })
      }));
    }
    
    return styleObj;
  };
};

// Function to extract colors from a style for display in the UI
export const extractStyleColors = (style) => {
  return {
    water: style.water,
    background: style.background,
    buildings: style.buildings,
    roads: {
      highway: style.roads?.highway,
      major: style.roads?.major,
      minor: style.roads?.minor
    },
    landuse: {
      park: style.landuse?.park,
      industrial: style.landuse?.industrial,
      hospital: style.landuse?.hospital
    }
  };
};
