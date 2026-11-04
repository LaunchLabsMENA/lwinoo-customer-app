import { FC, useCallback, useEffect, useRef } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

// Safety net in case the video never fires onEnd (decoder stall, etc.).
const MAX_SPLASH_MS = 12000;

export const SplashScreen: FC<Props> = ({ navigation }) => {
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }, [navigation]);

  useEffect(() => {
    const id = setTimeout(finish, MAX_SPLASH_MS);
    return () => clearTimeout(id);
  }, [finish]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dustyRose,
  },
});
