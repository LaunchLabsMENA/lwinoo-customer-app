import { FC, useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { TextCustom } from '../../../components/react-native';
import { ScreenHeader } from '../../../components/screen-header';
import { PrimaryButton } from '../../../components/primary-button';
import { useI18n, type TranslationKey } from '../../../i18n';
import { listAddresses, makeDefaultAddress, removeAddress } from '../../../api/addresses';
import { errorMessage } from '../../../api/errors';
import type { Address, AddressLabel } from '../../../api/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Addresses'>;

const LABEL_KEYS: Record<AddressLabel, TranslationKey> = {
  HOME: 'mapPin.label.home',
  WORK: 'mapPin.label.work',
  OTHER: 'mapPin.label.other',
};

export const AddressesScreen: FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { t, row } = useI18n();
  const [items, setItems] = useState<Address[] | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await listAddresses());
      setError('');
    } catch (failure) {
      setError(errorMessage(failure, t));
      setItems(current => current ?? []);
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const makeDefault = async (id: string) => {
    try {
      await makeDefaultAddress(id);
      await load();
    } catch (failure) {
      Alert.alert(errorMessage(failure, t));
    }
  };

  const confirmRemove = (item: Address) =>
    Alert.alert(t('addresses.removeTitle'), t('addresses.removeBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('addresses.remove'),
        style: 'destructive',
        onPress: async () => {
          try {
            await removeAddress(item.id);
            await load();
          } catch (failure) {
            Alert.alert(errorMessage(failure, t));
          }
        },
      },
    ]);

  const renderItem = ({ item }: { item: Address }) => (
    <View style={styles.card}>
      <View style={[styles.cardTop, { flexDirection: row }]}>
        <MapPin size={18} color={COLORS.brandDeep} />
        <View style={styles.cardBody}>
          <View style={[styles.titleRow, { flexDirection: row }]}>
            <TextCustom style={styles.cardTitle}>{t(LABEL_KEYS[item.label])}</TextCustom>
            {item.isDefault ? (
              <View style={styles.badge}>
                <TextCustom style={styles.badgeText}>{t('addresses.default')}</TextCustom>
              </View>
            ) : null}
          </View>
          <TextCustom style={styles.cardAddress}>{item.formattedAddress}</TextCustom>
        </View>
      </View>
      <View style={[styles.actions, { flexDirection: row }]}>
        {item.isDefault ? null : (
          <Pressable onPress={() => makeDefault(item.id)} hitSlop={8}>
            <TextCustom style={styles.action}>{t('addresses.makeDefault')}</TextCustom>
          </Pressable>
        )}
        <Pressable onPress={() => navigation.navigate('MapPin', { mode: 'edit', addressId: item.id })} hitSlop={8}>
          <TextCustom style={styles.action}>{t('addresses.edit')}</TextCustom>
        </Pressable>
        <Pressable onPress={() => confirmRemove(item)} hitSlop={8}>
          <TextCustom style={[styles.action, styles.remove]}>{t('addresses.remove')}</TextCustom>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title={t('addresses.header')} onBack={navigation.goBack} />
      {items === null ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.brand} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={
            <View style={styles.center}>
              <TextCustom style={error ? styles.error : styles.empty}>{error || t('addresses.empty')}</TextCustom>
              {error ? (
                <Pressable onPress={load} style={styles.retry}>
                  <TextCustom style={styles.action}>{t('common.retry')}</TextCustom>
                </Pressable>
              ) : null}
            </View>
          }
        />
      )}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <PrimaryButton title={t('addresses.add')} onPress={() => navigation.navigate('MapPin', { mode: 'add' })} />
      </View>
    </View>
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  empty: {
    color: COLORS.inkMuted,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
  },
  retry: {
    marginTop: 12,
  },
  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  cardBody: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: COLORS.brandSoft,
  },
  badgeText: {
    fontSize: 11,
  },
  cardAddress: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.inkMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.hairline,
  },
  action: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.brandDeep,
  },
  remove: {
    color: COLORS.error,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.surface,
  },
});
