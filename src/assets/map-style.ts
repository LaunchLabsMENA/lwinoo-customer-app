import type { MapStyleElement } from 'react-native-maps';

// Google map tinted to the LWINOO palette: ivory land, champagne roads, soft muted water.
export const LWINOO_MAP_STYLE: MapStyleElement[] = [
  { elementType: 'geometry', stylers: [{ color: '#FAF3EE' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7A6E64' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#FAF3EE' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#E8D3BD' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: '#F5EAE3' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#F1E2DC' }] },
  { featureType: 'poi', elementType: 'labels.icon', stylers: [{ saturation: -60 }, { lightness: 15 }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#E6EAD8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#EADFD8' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#F6EBDD' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#E8D3BD' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#D9BFA5' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#EFE1DA' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#DCE3E6' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#8A979C' }] },
];
