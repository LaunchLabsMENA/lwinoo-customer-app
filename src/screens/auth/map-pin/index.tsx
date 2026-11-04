import { FC } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
import { MapPin, Search } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { TextCustom } from '../../../components/react-native';
import { PrimaryButton } from '../../../components/primary-button';

type Props = NativeStackScreenProps<RootStackParamList, 'MapPin'>;

// Riyadh
const INITIAL_REGION = {
  latitude: 24.7136,
  longitude: 46.6753,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export const MapPinScreen: FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={INITIAL_REGION} />

      {/* Fixed centre pin: the address is wherever the map is centred. */}
      <View pointerEvents="none" style={styles.pinWrap}>
        <MapPin size={44} color={COLORS.white} fill={COLORS.mapPin} strokeWidth={1.5} />
      </View>

      <View style={[styles.search, { top: insets.top + 12 }]}>
        <Search size={18} color={COLORS.inkMuted} />
        <TextInput
          placeholder="Search for your address"
          placeholderTextColor={COLORS.placeholder}
          style={styles.searchInput}
        />
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.handle} />
        <TextCustom style={styles.sheetTitle}>Current Location</TextCustom>
        <TextCustom style={styles.address}>Hijaz, GPRR+GC Hadiyah Saudi Arabia</TextCustom>
        <PrimaryButton title="Continue" onPress={() => navigation.navigate('Preferences')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  pinWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    // Lift the pin so its tip, not its centre, marks the map centre (and clear the sheet).
    paddingBottom: 44 + 160,
  },
  search: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.ink,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: COLORS.white,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
  address: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 13,
    color: COLORS.inkMuted,
  },
});
