import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { LocateFixed, MapPin, Search, X } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { TextCustom, useLocalizedTextStyle } from '../../../components/react-native';
import { ScreenHeader } from '../../../components/screen-header';
import { useI18n, type TranslationKey } from '../../../i18n';
import { PrimaryButton } from '../../../components/primary-button';
import { createAddress, listAddresses, reverseGeocode, searchPlaces, updateAddress } from '../../../api/addresses';
import { errorMessage } from '../../../api/errors';
import type { AddressLabel, GeoPlace } from '../../../api/types';
import { DEFAULT_COORDINATE, GOOGLE_MAPS_ENABLED } from '../../../config';
import { LWINOO_MAP_STYLE } from '../../../assets/map-style';
import { currentCoordinate, type Coordinate } from '../../../utils/location';
import { askLocation, locationAccess } from '../../../utils/permissions';

type Props = NativeStackScreenProps<RootStackParamList, 'MapPin'>;

type Resolved = { text: string; placeId: string | null; city: string | null };

const DELTA = 0.005;
// Google when keyed; otherwise the platform default (Apple Maps on iOS, keyless).
const USE_GOOGLE = GOOGLE_MAPS_ENABLED || Platform.OS === 'android';
const LABELS: { code: AddressLabel; key: TranslationKey }[] = [
  { code: 'HOME', key: 'mapPin.label.home' },
  { code: 'WORK', key: 'mapPin.label.work' },
  { code: 'OTHER', key: 'mapPin.label.other' },
];

const regionOf = (c: Coordinate): Region => ({ ...c, latitudeDelta: DELTA, longitudeDelta: DELTA });
const near = (a: Coordinate, b: Coordinate) => Math.abs(a.latitude - b.latitude) < 1e-5 && Math.abs(a.longitude - b.longitude) < 1e-5;
const plain = (c: Coordinate) => `${c.latitude.toFixed(5)}, ${c.longitude.toFixed(5)}`;

export const MapPinScreen: FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { t, row, locale } = useI18n();
  const mode = route.params?.mode ?? 'onboarding';
  const addressId = route.params?.addressId;
  const searchInputStyle = useLocalizedTextStyle(styles.searchInput);

  const mapRef = useRef<MapView>(null);
  const skipFor = useRef<Coordinate | null>(null);
  const requestId = useRef(0);
  const savedId = useRef<string | null>(addressId ?? null);

  const [initial, setInitial] = useState<Region | null>(addressId ? null : regionOf(DEFAULT_COORDINATE));
  const [center, setCenter] = useState<Coordinate>(DEFAULT_COORDINATE);
  const [resolved, setResolved] = useState<Resolved | null>(null);
  const [resolving, setResolving] = useState(false);
  const [label, setLabel] = useState<AddressLabel>('HOME');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoPlace[]>([]);
  const [searching, setSearching] = useState(false);
  const [locationOff, setLocationOff] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const moveTo = useCallback((coordinate: Coordinate) => {
    mapRef.current?.animateToRegion(regionOf(coordinate), 400);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (addressId) {
      listAddresses()
        .then(addresses => {
          const found = addresses.find(item => item.id === addressId);
          if (cancelled) return;
          if (!found) {
            setInitial(regionOf(DEFAULT_COORDINATE));
            return;
          }
          const coordinate = { latitude: found.latitude, longitude: found.longitude };
          skipFor.current = coordinate;
          setLabel(found.label);
          setResolved({ text: found.formattedAddress, placeId: found.placeId, city: found.city });
          setCenter(coordinate);
          setInitial(regionOf(coordinate));
        })
        .catch(failure => {
          if (cancelled) return;
          setInitial(regionOf(DEFAULT_COORDINATE));
          setError(errorMessage(failure, t));
        });
      return () => {
        cancelled = true;
      };
    }
    locationAccess()
      .then(async access => {
        if (access !== 'granted') {
          if (!cancelled) setLocationOff(access === 'blocked');
          return;
        }
        if (!cancelled) setLocationGranted(true);
        const coordinate = await currentCoordinate();
        if (!cancelled) moveTo(coordinate);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [addressId, moveTo, t]);

  useEffect(() => {
    if (skipFor.current && near(skipFor.current, center)) return;
    const current = ++requestId.current;
    setResolving(true);
    const timer = setTimeout(() => {
      reverseGeocode(center.latitude, center.longitude, locale)
        .then(result => {
          if (requestId.current !== current) return;
          setResolved(result ? { text: result.formattedAddress, placeId: result.placeId, city: result.city } : null);
        })
        .catch(() => {
          if (requestId.current === current) setResolved(null);
        })
        .finally(() => {
          if (requestId.current === current) setResolving(false);
        });
    }, 500);
    return () => clearTimeout(timer);
  }, [center, locale]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const timer = setTimeout(() => {
      searchPlaces(trimmed, locale)
        .then(found => {
          if (!cancelled) setResults(found);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, locale]);

  const onSelectPlace = (place: GeoPlace) => {
    setQuery('');
    setResults([]);
    const coordinate = { latitude: place.latitude, longitude: place.longitude };
    skipFor.current = coordinate;
    setResolved({ text: place.formattedAddress, placeId: place.placeId, city: place.city });
    setResolving(false);
    moveTo(coordinate);
  };

  const onMyLocation = async () => {
    setError('');
    let access = await locationAccess();
    if (access !== 'granted') access = await askLocation();
    if (access !== 'granted') {
      setLocationOff(true);
      return;
    }
    setLocationOff(false);
    setLocationGranted(true);
    try {
      moveTo(await currentCoordinate());
    } catch {
      setLocationOff(true);
    }
  };

  const onSave = async () => {
    if (saving) return;
    setSaving(true);
    setError('');
    // If the lookup for this spot hasn't finished, save the coordinates rather than a stale address.
    const address = resolving ? null : resolved;
    const payload = {
      formattedAddress: address?.text ?? plain(center),
      latitude: center.latitude,
      longitude: center.longitude,
      city: address?.city ?? undefined,
      placeId: address?.placeId ?? undefined,
      label,
    };
    try {
      if (savedId.current) {
        await updateAddress(savedId.current, payload);
      } else {
        const created = await createAddress(mode === 'onboarding' ? { ...payload, isDefault: true } : payload);
        savedId.current = created.id;
      }
      if (mode === 'onboarding') navigation.navigate('Preferences');
      else navigation.goBack();
    } catch (failure) {
      setError(errorMessage(failure, t));
    } finally {
      setSaving(false);
    }
  };

  const onboarding = mode === 'onboarding';
  const header = mode === 'edit' ? 'mapPin.editHeader' : 'mapPin.addHeader';

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.mapArea}>
        {initial ? (
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            provider={USE_GOOGLE ? PROVIDER_GOOGLE : undefined}
            customMapStyle={USE_GOOGLE ? LWINOO_MAP_STYLE : undefined}
            // Apple Maps can't take a custom style; the muted variant sits closest to the LWINOO palette.
            mapType={USE_GOOGLE ? 'standard' : 'mutedStandard'}
            showsPointsOfInterests={false}
            userInterfaceStyle="light"
            toolbarEnabled={false}
            initialRegion={initial}
            showsUserLocation={locationGranted}
            showsMyLocationButton={false}
            onRegionChangeComplete={region =>
              // Ignore sub-pixel jitter (Apple Maps re-reports the region on resize/settle), which
              // would otherwise restart the address lookup in a loop.
              setCenter(previous => {
                const threshold = region.latitudeDelta * 0.01;
                const moved =
                  Math.abs(previous.latitude - region.latitude) > threshold ||
                  Math.abs(previous.longitude - region.longitude) > threshold;
                return moved ? { latitude: region.latitude, longitude: region.longitude } : previous;
              })
            }
          />
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator color={COLORS.brand} />
          </View>
        )}

        <View pointerEvents="none" style={styles.pinWrap}>
          <MapPin size={46} color={COLORS.white} fill={COLORS.mapPin} strokeWidth={1.5} />
          <View style={styles.pinShadow} />
        </View>

        {onboarding ? null : (
          <View style={{ paddingTop: insets.top, backgroundColor: COLORS.white }}>
            <ScreenHeader title={t(header)} onBack={navigation.goBack} />
          </View>
        )}

        <View style={[styles.search, { top: (onboarding ? insets.top : insets.top + 52) + 12, flexDirection: row }]}>
          <Search size={18} color={COLORS.inkMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('mapPin.search')}
            placeholderTextColor={COLORS.placeholder}
            style={searchInputStyle}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searching ? <ActivityIndicator size="small" color={COLORS.brand} /> : null}
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <X size={16} color={COLORS.inkMuted} />
            </Pressable>
          ) : null}
        </View>

        {query.trim().length >= 2 && !searching ? (
          <View style={[styles.results, { top: (onboarding ? insets.top : insets.top + 52) + 12 + 56 }]}>
            <ScrollView keyboardShouldPersistTaps="handled">
              {results.length ? (
                results.map(item => (
                  <Pressable key={item.placeId} style={styles.result} onPress={() => onSelectPlace(item)}>
                    <TextCustom style={styles.resultTitle} numberOfLines={2}>
                      {item.formattedAddress}
                    </TextCustom>
                    {item.city ? (
                      <TextCustom style={styles.resultSub} numberOfLines={1}>
                        {item.city}
                      </TextCustom>
                    ) : null}
                  </Pressable>
                ))
              ) : (
                <TextCustom style={styles.noResults}>{t('mapPin.noResults')}</TextCustom>
              )}
            </ScrollView>
          </View>
        ) : null}

        <Pressable
          style={styles.locate}
          onPress={onMyLocation}
          accessibilityRole="button"
          accessibilityLabel={t('mapPin.myLocation')}
        >
          <LocateFixed size={20} color={COLORS.brandDeep} />
        </Pressable>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.handle} />
        <TextCustom style={styles.sheetTitle}>{t('mapPin.currentLocation')}</TextCustom>
        <View style={[styles.addressRow, { flexDirection: row }]}>
          <TextCustom style={styles.address} numberOfLines={2}>
            {resolving ? t('mapPin.loading') : resolved?.text ?? plain(center)}
          </TextCustom>
        </View>

        <View style={[styles.labels, { flexDirection: row }]}>
          {LABELS.map(option => {
            const active = option.code === label;
            return (
              <Pressable
                key={option.code}
                onPress={() => setLabel(option.code)}
                style={[styles.labelChip, active && styles.labelChipActive]}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
              >
                <TextCustom style={[styles.labelText, active && styles.labelTextActive]}>{t(option.key)}</TextCustom>
              </Pressable>
            );
          })}
        </View>

        {locationOff ? <TextCustom style={styles.hint}>{t('mapPin.locationOff')}</TextCustom> : null}
        {error ? <TextCustom style={styles.error}>{error}</TextCustom> : null}

        <PrimaryButton
          title={t(onboarding ? 'common.continue' : 'mapPin.saveAddress')}
          onPress={onSave}
          loading={saving}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  mapArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 46,
  },
  pinShadow: {
    width: 10,
    height: 4,
    marginTop: -2,
    borderRadius: 5,
    backgroundColor: 'rgba(66,57,48,0.25)',
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
    borderRadius: 25,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.darkBrown,
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
  results: {
    position: 'absolute',
    left: 16,
    right: 16,
    maxHeight: 260,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  result: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.hairline,
  },
  resultTitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  resultSub: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.inkMuted,
  },
  noResults: {
    padding: 14,
    color: COLORS.inkMuted,
  },
  locate: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.darkBrown,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginBottom: 14,
  },
  sheetTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
  // Fixed height (two lines) so the sheet never resizes the map while the address loads.
  addressRow: {
    flexDirection: 'row',
    height: 56,
  },
  address: {
    flex: 1,
    marginTop: 6,
    marginBottom: 12,
    fontSize: 13,
    color: COLORS.inkMuted,
  },
  labels: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  labelChip: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelChipActive: {
    backgroundColor: COLORS.brandSoft,
    borderColor: COLORS.brand,
  },
  labelText: {
    fontSize: 13,
    color: COLORS.inkMuted,
  },
  labelTextActive: {
    fontFamily: FONTS.semiBold,
    color: COLORS.brandDeep,
  },
  hint: {
    marginBottom: 10,
    fontSize: 12,
    color: COLORS.inkMuted,
  },
  error: {
    marginBottom: 10,
    fontSize: 12,
    color: COLORS.error,
  },
});
