import { FC, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { ScreenHeader } from '../../../components/screen-header';
import { StepProgress } from '../../../components/step-progress';
import { PrimaryButton } from '../../../components/primary-button';
import { useI18n } from '../../../i18n';
import { completeOnboarding, getCategories, getSelectedCategories, saveSelectedCategories } from '../../../api/customer';
import { errorMessage } from '../../../api/errors';
import type { Category } from '../../../api/types';
import { CATEGORY_IMAGES } from './data';

type Props = NativeStackScreenProps<RootStackParamList, 'Preferences'>;

const Separator = () => <View style={styles.separator} />;

export const PreferencesScreen: FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { t, row, locale } = useI18n();
  const editing = route.params?.mode === 'edit';
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const [list, ids] = await Promise.all([getCategories(), editing ? getSelectedCategories() : []]);
      setSelected(ids);
      setCategories(list);
    } catch (failure) {
      setError(errorMessage(failure, t));
    }
  }, [editing, t]);

  useEffect(() => {
    load();
  }, [load]);

  const onContinue = async () => {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      await saveSelectedCategories(selected);
      if (editing) {
        navigation.goBack();
      } else {
        await completeOnboarding();
        navigation.navigate('Welcome');
      }
    } catch (failure) {
      setError(errorMessage(failure, t));
    } finally {
      setSaving(false);
    }
  };

  const toggle = (id: string) =>
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const arabic = locale === 'ar';

  const renderItem = ({ item }: { item: Category }) => {
    const active = selected.includes(item.id);
    const description = arabic ? item.descriptionAr ?? item.descriptionEn : item.descriptionEn;
    return (
      <Pressable onPress={() => toggle(item.id)} style={[styles.card, { flexDirection: row }, active && styles.cardActive]}>
        <Image source={item.imageUrl ? { uri: item.imageUrl } : CATEGORY_IMAGES[item.slug]} style={styles.image} />
        <View style={styles.body}>
          <View style={[styles.titleRow, { flexDirection: row }]}>
            <TextCustom style={styles.title}>{arabic ? item.nameAr ?? item.nameEn : item.nameEn}</TextCustom>
            {item.isTopPick ? (
              <View style={styles.topPick}>
                <TextCustom style={styles.topPickText}>{t('preferences.topPick')}</TextCustom>
              </View>
            ) : null}
          </View>
          {description ? <TextCustom style={styles.subtitle}>{description}</TextCustom> : null}
          <View style={[styles.tags, { flexDirection: row }]}>
            {item.subcategories.slice(0, 3).map(tag => (
              <View key={tag.id} style={styles.tag}>
                <TextCustom style={styles.tagText}>{arabic ? tag.nameAr ?? tag.nameEn : tag.nameEn}</TextCustom>
              </View>
            ))}
          </View>
        </View>
        <View style={[styles.radio, active && styles.radioActive]}>
          {active ? <Check size={14} color={COLORS.white} strokeWidth={3} /> : null}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title={t('preferences.header')} onBack={navigation.canGoBack() ? navigation.goBack : undefined} />
      {editing ? null : <StepProgress step={4} total={4} label={t('step.location')} />}

      {categories ? (
        <FlatList
          data={categories}
          keyExtractor={c => c.id}
          renderItem={renderItem}
          ListHeaderComponent={<HeadingText style={styles.heading}>{t('preferences.heading')}</HeadingText>}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={Separator}
        />
      ) : (
        <View style={styles.center}>
          {error ? (
            <Pressable onPress={load} hitSlop={8}>
              <TextCustom style={styles.reset}>{t('common.retry')}</TextCustom>
            </Pressable>
          ) : (
            <ActivityIndicator color={COLORS.brand} />
          )}
        </View>
      )}

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={[styles.summary, { flexDirection: row }]}>
          <View style={styles.dot} />
          <TextCustom style={styles.summaryText}>
            {t(selected.length === 1 ? 'preferences.selectedOne' : 'preferences.selectedMany', { count: selected.length })}
          </TextCustom>
          <Pressable onPress={() => setSelected([])} hitSlop={8}>
            <TextCustom style={styles.reset}>{t('preferences.reset')}</TextCustom>
          </Pressable>
        </View>
        {error ? <TextCustom style={styles.error}>{error}</TextCustom> : null}
        <PrimaryButton
          title={t(editing ? 'preferences.save' : 'common.continue')}
          disabled={selected.length === 0}
          loading={saving}
          onPress={onContinue}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 18,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  cardActive: {
    borderColor: COLORS.brand,
    backgroundColor: '#FFFBFA',
  },
  image: {
    width: 64,
    height: 80,
    borderRadius: 10,
    backgroundColor: COLORS.brandSoft,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
  topPick: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: COLORS.brandSoft,
  },
  topPickText: {
    fontSize: 11,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.inkMuted,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: 11,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.hairline,
    backgroundColor: COLORS.white,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brand,
  },
  summaryText: {
    flex: 1,
    fontFamily: FONTS.medium,
  },
  reset: {
    color: COLORS.inkMuted,
  },
  error: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.error,
  },
});
