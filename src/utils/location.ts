import Geolocation from '@react-native-community/geolocation';

export type Coordinate = { latitude: number; longitude: number };

Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: 'whenInUse' });

export const currentCoordinate = (): Promise<Coordinate> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      reject,
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  });
