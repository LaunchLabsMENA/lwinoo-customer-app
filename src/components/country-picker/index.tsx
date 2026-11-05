import { FC, useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Search } from 'lucide-react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { useI18n, ltr } from '../../i18n';
import { COUNTRIES, Country, countryName, filterCountries } from '../../utils/countries';
import { TextCustom, useLocalizedTextStyle } from '../react-native';

type Props = {
  visible: boolean;
  selectedCode: string;
  onSelect: (country: Country) => void;
  onClose: () => void;
};

// Bottom sheet with a searchable country list (by name in either language, or dial code).
export const CountryPicker: FC<Props> = ({ visible, selectedCode, onSelect, onClose }) => {
  const insets = useSafeAreaInsets();
  const { t, locale, row } = useI18n();
  const [query, setQuery] = useState('');
  const searchStyle = useLocalizedTextStyle(styles.searchInput);

  // Start each opening with a clean search.
  useEffect(() => {
    if (visible) setQuery('');
  }, [visible]);

  const list = useMemo(() => filterCountries(COUNTRIES, query), [query]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.handle} />
          <TextCustom style={styles.title}>{t('countryPicker.title')}</TextCustom>

          <View style={[styles.search, { flexDirection: row }]}>
            <Search size={18} color={COLORS.inkMuted} />
            <TextInput
              style={searchStyle}
              placeholder={t('countryPicker.search')}
              placeholderTextColor={COLORS.placeholder}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
            />
          </View>

          <FlatList
            data={list}
            keyExtractor={c => c.code}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<TextCustom style={styles.empty}>{t('countryPicker.noResults')}</TextCustom>}
            renderItem={({ item }) => {
              const active = item.code === selectedCode;
              return (
                <Pressable
                  style={({ pressed }) => [styles.row, { flexDirection: row }, pressed && styles.pressed]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <TextCustom style={styles.flag}>{item.flag}</TextCustom>
                  <TextCustom style={[styles.name, active && styles.active]} numberOfLines={1}>
                    {countryName(item, locale)}
                  </TextCustom>
                  <TextCustom style={[styles.dial, active && styles.active]}>{ltr(`+${item.dial}`)}</TextCustom>
                  <View style={styles.check}>{active ? <Check size={16} color={COLORS.brandDeep} /> : null}</View>
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    height: '75%',
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
    marginBottom: 14,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: 17,
    marginBottom: 14,
  },
  search: {
    alignItems: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.ink,
  },
  row: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.hairline,
  },
  pressed: {
    backgroundColor: COLORS.brandSoft,
  },
  flag: {
    fontSize: 22,
  },
  name: {
    flex: 1,
    fontSize: 15,
  },
  dial: {
    fontSize: 15,
    color: COLORS.inkMuted,
  },
  active: {
    fontFamily: FONTS.semiBold,
    color: COLORS.brandDeep,
  },
  check: {
    width: 16,
  },
  empty: {
    paddingVertical: 28,
    textAlign: 'center',
    color: COLORS.inkMuted,
  },
});
