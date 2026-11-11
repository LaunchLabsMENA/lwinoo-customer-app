import { Platform } from 'react-native';
import {
  check,
  checkNotifications,
  openSettings,
  PERMISSIONS,
  request,
  requestNotifications,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';

export type Access = 'granted' | 'denied' | 'blocked' | 'unavailable';

const LOCATION = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

const toAccess = (status: PermissionStatus): Access => {
  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) return 'granted';
  if (status === RESULTS.BLOCKED) return 'blocked';
  if (status === RESULTS.UNAVAILABLE) return 'unavailable';
  return 'denied';
};

export const locationAccess = async (): Promise<Access> => toAccess(await check(LOCATION));
export const askLocation = async (): Promise<Access> => toAccess(await request(LOCATION));
export const notificationAccess = async (): Promise<Access> => toAccess((await checkNotifications()).status);
export const askNotifications = async (): Promise<Access> =>
  toAccess((await requestNotifications(['alert', 'sound', 'badge'])).status);
export const openAppSettings = () => openSettings().catch(() => {});
