import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { IMAGES } from '../../../assets/images';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

// Persisted flag: once set, the intro video is skipped on later launches.
const SPLASH_VIDEO_SEEN_KEY = 'splash_video_seen';

// Safety net in case the video never fires onEnd (decoder stall, etc.).
const MAX_SPLASH_MS = 12000;
// How long returning users see the logo before moving on.
const LOGO_SPLASH_MS = 1500;

type Mode = 'loading' | 'video' | 'logo';

export const SplashScreen: FC<Props> = ({ navigation }) => {
  const done = useRef(false);
  const [mode, setMode] = useState<Mode>('loading');

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }, [navigation]);

  // Decide which splash to show.
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(SPLASH_VIDEO_SEEN_KEY)
      .then(seen => {
        if (!cancelled) setMode(seen ? 'logo' : 'video');
      })
      .catch(() => {
        if (!cancelled) setMode('logo');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Video mode: mark as seen once shown, with a timeout safety net.
  // Logo mode: hold briefly, then go to Login.
  useEffect(() => {
    if (mode === 'loading') return;
    if (mode === 'video') {
      AsyncStorage.setItem(SPLASH_VIDEO_SEEN_KEY, '1').catch(() => {});
    }
    const id = setTimeout(finish, mode === 'video' ? MAX_SPLASH_MS : LOGO_SPLASH_MS);
    return () => clearTimeout(id);
  }, [mode, finish]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {mode === 'video' && (
        <Video
          source={require('../../../assets/video/splash.mp4')}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          repeat={false}
          controls={false}
          ignoreSilentSwitch="obey"
          disableFocus
          onEnd={finish}
          onError={finish}
        />
      )}
      {mode === 'logo' && <Image source={IMAGES.logo} style={styles.logo} resizeMode="contain" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dustyRose,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 32,
  },
});
