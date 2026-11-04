import { FC, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
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
import { CATEGORIES, PreferenceCategory } from './data';

type Props = NativeStackScreenProps<RootStackParamList, 'Preferences'>;

const Separator = () => <View style={styles.separator} />;

export const PreferencesScreen: FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string[]>(['hair', 'makeup', 'nails']);

  const toggle = (id: string) =>
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const renderItem = ({ item }: { item: PreferenceCategory }) => {
    const active = selected.includes(item.id);
    return (
      <Pressable onPress={() => toggle(item.id)} style={[styles.card, active && styles.cardActive]}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <TextCustom style={styles.title}>{item.title}</TextCustom>
            {item.topPick ? (
              <View style={styles.topPick}>
                <TextCustom style={styles.topPickText}>Top Pick</TextCustom>
              </View>
            ) : null}
          </View>
          <TextCustom style={styles.subtitle}>{item.subtitle}</TextCustom>
          <View style={styles.tags}>
            {item.tags.map(t => (
              <View key={t} style={styles.tag}>
                <TextCustom style={styles.tagText}>{t}</TextCustom>
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
      <ScreenHeader title="Preference" onBack={navigation.goBack} />
      <StepProgress step={4} total={4} label="Location" />

      <FlatList
        data={CATEGORIES}
        keyExtractor={c => c.id}
        renderItem={renderItem}
        ListHeaderComponent={<HeadingText style={styles.heading}>What are you into?</HeadingText>}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Separator}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.summary}>
          <View style={styles.dot} />
          <TextCustom style={styles.summaryText}>
            {`${selected.length} ${selected.length === 1 ? 'category' : 'categories'} selected`}
          </TextCustom>
          <Pressable onPress={() => setSelected([])} hitSlop={8}>
            <TextCustom style={styles.reset}>Reset</TextCustom>
          </Pressable>
        </View>
        <PrimaryButton
          title="Continue"
          disabled={selected.length === 0}
          onPress={() => navigation.navigate('Welcome')}
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
});
