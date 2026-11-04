import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../app/types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
